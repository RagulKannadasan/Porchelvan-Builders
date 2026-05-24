const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Connected to MongoDB Atlas: porchelvan_builders");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});

// Simple Project Schema
const projectSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: { type: String, enum: ['Ongoing', 'Upcoming', 'Completed'] },
    imageUrl: String,
    location: String
}, { timestamps: true });
const Project = mongoose.model('Project', projectSchema);

const siteDiarySchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    date: { type: Date, default: Date.now },
    weather: String, 
    workCompleted: String,
    issues: String,
    workersPresent: Number
}, { timestamps: true });
const SiteDiary = mongoose.model('SiteDiary', siteDiarySchema);

const expenseSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    date: { type: Date, default: Date.now },
    category: String,
    amount: Number,
    description: String,
    receiptUrl: String
}, { timestamps: true });
const Expense = mongoose.model('Expense', expenseSchema);

const invoiceSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    date: { type: Date, default: Date.now },
    amount: Number,
    status: { type: String, enum: ['Paid', 'Unpaid'] },
    description: String
}, { timestamps: true });
const Invoice = mongoose.model('Invoice', invoiceSchema);

const crewSchema = new mongoose.Schema({
    name: String,
    role: String,
    phone: String,
    currentProject: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null }
}, { timestamps: true });
const Crew = mongoose.model('Crew', crewSchema);

const inventorySchema = new mongoose.Schema({
    name: String,
    type: { type: String, enum: ['Equipment', 'Material'] },
    status: { type: String, enum: ['Available', 'In Use', 'Maintenance'], default: 'Available' },
    quantity: Number,
    minQuantity: Number,
    unit: String,
    currentLocation: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null }
}, { timestamps: true });
const Inventory = mongoose.model('Inventory', inventorySchema);

const scheduleEventSchema = new mongoose.Schema({
    title: String,
    resourceType: { type: String, enum: ['Crew', 'Equipment'] },
    resourceId: { type: mongoose.Schema.Types.ObjectId },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    startDate: Date,
    endDate: Date,
    notes: String
}, { timestamps: true });
const ScheduleEvent = mongoose.model('ScheduleEvent', scheduleEventSchema);

const issueSchema = new mongoose.Schema({
    title: String,
    description: String,
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    status: { type: String, enum: ['Open', 'In Progress', 'Resolved'], default: 'Open' },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' }
}, { timestamps: true });
const Issue = mongoose.model('Issue', issueSchema);

const vaultDocumentSchema = new mongoose.Schema({
    title: String,
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    url: String, 
    type: { type: String, enum: ['Blueprint', 'Permit', 'Contract', 'Other'] }
}, { timestamps: true });
const VaultDocument = mongoose.model('VaultDocument', vaultDocumentSchema);

// --- PROJECT ROUTES ---
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch projects" });
    }
});

app.post('/api/projects', async (req, res) => {
    try {
        const newProject = new Project(req.body);
        await newProject.save();
        res.status(201).json(newProject);
    } catch (err) {
        res.status(500).json({ error: "Failed to create project" });
    }
});

app.delete('/api/projects/:id', async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        // Also delete associated diaries
        await SiteDiary.deleteMany({ projectId: req.params.id });
        res.json({ message: "Project deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete project" });
    }
});

// --- SITE DIARY ROUTES ---
app.get('/api/projects/:id/diaries', async (req, res) => {
    try {
        const diaries = await SiteDiary.find({ projectId: req.params.id }).sort({ date: -1 });
        res.json(diaries);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch diaries" });
    }
});

app.post('/api/projects/:id/diaries', async (req, res) => {
    try {
        const { workCompleted, issues, workersPresent } = req.body;
        
        // Fetch automated weather from open-meteo (using Chennai coordinates as a default)
        let weatherStr = "Unknown Weather";
        try {
            // Using dynamic import or native fetch since Node 18+ supports fetch
            const weatherResponse = await fetch('https://api.open-meteo.com/v1/forecast?latitude=13.0827&longitude=80.2707&current_weather=true');
            const weatherData = await weatherResponse.json();
            const temp = weatherData.current_weather.temperature;
            const wind = weatherData.current_weather.windspeed;
            weatherStr = `Temp: ${temp}°C, Wind: ${wind} km/h`;
        } catch (weatherErr) {
            console.error("Failed to fetch weather", weatherErr);
        }

        const newDiary = new SiteDiary({
            projectId: req.params.id,
            workCompleted,
            issues,
            workersPresent,
            weather: weatherStr
        });
        await newDiary.save();
        res.status(201).json(newDiary);
    } catch (err) {
        res.status(500).json({ error: "Failed to create diary" });
    }
});

// --- BUDGET ROUTES (Expenses & Invoices) ---
app.get('/api/projects/:id/budget', async (req, res) => {
    try {
        const expenses = await Expense.find({ projectId: req.params.id }).sort({ date: -1 });
        const invoices = await Invoice.find({ projectId: req.params.id }).sort({ date: -1 });
        res.json({ expenses, invoices });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch budget data" });
    }
});

app.post('/api/projects/:id/expenses', async (req, res) => {
    try {
        const newExpense = new Expense({ ...req.body, projectId: req.params.id });
        await newExpense.save();
        res.status(201).json(newExpense);
    } catch (err) {
        res.status(500).json({ error: "Failed to log expense" });
    }
});

app.post('/api/projects/:id/invoices', async (req, res) => {
    try {
        const newInvoice = new Invoice({ ...req.body, projectId: req.params.id });
        await newInvoice.save();
        res.status(201).json(newInvoice);
    } catch (err) {
        res.status(500).json({ error: "Failed to create invoice" });
    }
});

app.delete('/api/expenses/:id', async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: "Expense deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete expense" });
    }
});

app.delete('/api/invoices/:id', async (req, res) => {
    try {
        await Invoice.findByIdAndDelete(req.params.id);
        res.json({ message: "Invoice deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete invoice" });
    }
});

app.put('/api/invoices/:id/status', async (req, res) => {
    try {
        const updated = await Invoice.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: "Failed to update invoice status" });
    }
});

// --- CREW ROUTES ---
app.get('/api/crew', async (req, res) => {
    try {
        const crew = await Crew.find().populate('currentProject', 'title').sort({ createdAt: -1 });
        res.json(crew);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch crew" });
    }
});

app.post('/api/crew', async (req, res) => {
    try {
        const newCrew = new Crew(req.body);
        await newCrew.save();
        res.status(201).json(await newCrew.populate('currentProject', 'title'));
    } catch (err) {
        res.status(500).json({ error: "Failed to add crew member" });
    }
});

app.put('/api/crew/:id', async (req, res) => {
    try {
        // Handle assigning to "null"
        const updateData = { ...req.body };
        if (updateData.currentProject === "") {
            updateData.currentProject = null;
        }
        const updated = await Crew.findByIdAndUpdate(req.params.id, updateData, { new: true }).populate('currentProject', 'title');
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: "Failed to update crew member" });
    }
});

app.delete('/api/crew/:id', async (req, res) => {
    try {
        await Crew.findByIdAndDelete(req.params.id);
        res.json({ message: "Crew deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete crew" });
    }
});

// --- INVENTORY ROUTES ---
app.get('/api/inventory', async (req, res) => {
    try {
        const items = await Inventory.find().populate('currentLocation', 'title').sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch inventory" });
    }
});

app.post('/api/inventory', async (req, res) => {
    try {
        const newItem = new Inventory(req.body);
        await newItem.save();
        res.status(201).json(await newItem.populate('currentLocation', 'title'));
    } catch (err) {
        res.status(500).json({ error: "Failed to add inventory item" });
    }
});

app.put('/api/inventory/:id', async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (updateData.currentLocation === "") updateData.currentLocation = null;
        
        const updated = await Inventory.findByIdAndUpdate(req.params.id, updateData, { new: true }).populate('currentLocation', 'title');
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: "Failed to update inventory" });
    }
});

app.delete('/api/inventory/:id', async (req, res) => {
    try {
        await Inventory.findByIdAndDelete(req.params.id);
        res.json({ message: "Item deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete item" });
    }
});

// --- SCHEDULING ROUTES ---
app.get('/api/schedule', async (req, res) => {
    try {
        const events = await ScheduleEvent.find().populate('projectId', 'title').sort({ startDate: 1 });
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch schedule events" });
    }
});

app.post('/api/schedule', async (req, res) => {
    try {
        const newEvent = new ScheduleEvent(req.body);
        await newEvent.save();
        res.status(201).json(await newEvent.populate('projectId', 'title'));
    } catch (err) {
        res.status(500).json({ error: "Failed to create schedule event" });
    }
});

app.delete('/api/schedule/:id', async (req, res) => {
    try {
        await ScheduleEvent.findByIdAndDelete(req.params.id);
        res.json({ message: "Event deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete schedule event" });
    }
});

// --- ISSUES ROUTES ---
app.get('/api/issues', async (req, res) => {
    try {
        const issues = await Issue.find().populate('projectId', 'title').sort({ createdAt: -1 });
        res.json(issues);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch issues" });
    }
});

app.post('/api/issues', async (req, res) => {
    try {
        const newIssue = new Issue(req.body);
        await newIssue.save();
        res.status(201).json(await newIssue.populate('projectId', 'title'));
    } catch (err) {
        res.status(500).json({ error: "Failed to create issue" });
    }
});

app.put('/api/issues/:id', async (req, res) => {
    try {
        const updated = await Issue.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('projectId', 'title');
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: "Failed to update issue" });
    }
});

app.delete('/api/issues/:id', async (req, res) => {
    try {
        await Issue.findByIdAndDelete(req.params.id);
        res.json({ message: "Issue deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete issue" });
    }
});

// --- VAULT ROUTES ---
app.get('/api/vault', async (req, res) => {
    try {
        const docs = await VaultDocument.find().populate('projectId', 'title').sort({ createdAt: -1 });
        res.json(docs);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch documents" });
    }
});

app.post('/api/vault', async (req, res) => {
    try {
        const newDoc = new VaultDocument(req.body);
        await newDoc.save();
        res.status(201).json(await newDoc.populate('projectId', 'title'));
    } catch (err) {
        res.status(500).json({ error: "Failed to upload document" });
    }
});

app.delete('/api/vault/:id', async (req, res) => {
    try {
        await VaultDocument.findByIdAndDelete(req.params.id);
        res.json({ message: "Document deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete document" });
    }
});

// Simple health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running smoothly' });
});

// Serve frontend static files in production (Render deployment)
const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
