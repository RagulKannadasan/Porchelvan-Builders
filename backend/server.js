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

// Simple health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running smoothly' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
