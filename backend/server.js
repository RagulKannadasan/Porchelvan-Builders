const express = require('express');
const cors = require('cors');
const sql = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

console.log("Supabase PostgreSQL Integration initialized");

// --- PROJECT ROUTES ---
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await sql`SELECT * FROM projects ORDER BY "createdAt" DESC`;
        res.json(projects);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch projects" });
    }
});

app.post('/api/projects', async (req, res) => {
    try {
        const { title, description, status, imageUrl, location } = req.body;
        const [newProject] = await sql`
            INSERT INTO projects (title, description, status, "imageUrl", location)
            VALUES (${title || ''}, ${description || ''}, ${status || 'Upcoming'}, ${imageUrl || ''}, ${location || ''})
            RETURNING *
        `;
        res.status(201).json(newProject);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create project" });
    }
});

app.delete('/api/projects/:id', async (req, res) => {
    try {
        // Table constraints specify ON DELETE CASCADE, so associated diaries, expenses, invoices, etc. clean up automatically
        await sql`DELETE FROM projects WHERE id = ${req.params.id}`;
        res.json({ message: "Project deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete project" });
    }
});

// --- SITE DIARY ROUTES ---
app.get('/api/projects/:id/diaries', async (req, res) => {
    try {
        const diaries = await sql`
            SELECT * FROM site_diaries 
            WHERE "projectId" = ${req.params.id} 
            ORDER BY date DESC
        `;
        res.json(diaries);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch diaries" });
    }
});

app.post('/api/projects/:id/diaries', async (req, res) => {
    try {
        const { workCompleted, issues, workersPresent } = req.body;
        
        let weatherStr = "Unknown Weather";
        try {
            const weatherResponse = await fetch('https://api.open-meteo.com/v1/forecast?latitude=13.0827&longitude=80.2707&current_weather=true');
            const weatherData = await weatherResponse.json();
            const temp = weatherData.current_weather.temperature;
            const wind = weatherData.current_weather.windspeed;
            weatherStr = `Temp: ${temp}°C, Wind: ${wind} km/h`;
        } catch (weatherErr) {
            console.error("Failed to fetch weather", weatherErr);
        }

        const [newDiary] = await sql`
            INSERT INTO site_diaries ("projectId", weather, "workCompleted", issues, "workersPresent")
            VALUES (${req.params.id}, ${weatherStr}, ${workCompleted || ''}, ${issues || ''}, ${workersPresent || 0})
            RETURNING *
        `;
        res.status(201).json(newDiary);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create diary" });
    }
});

// --- BUDGET ROUTES (Expenses & Invoices) ---
app.get('/api/projects/:id/budget', async (req, res) => {
    try {
        const expenses = await sql`SELECT * FROM expenses WHERE "projectId" = ${req.params.id} ORDER BY date DESC`;
        const invoices = await sql`SELECT * FROM invoices WHERE "projectId" = ${req.params.id} ORDER BY date DESC`;
        res.json({ expenses, invoices });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch budget data" });
    }
});

app.post('/api/projects/:id/expenses', async (req, res) => {
    try {
        const { category, amount, description, receiptUrl } = req.body;
        const [newExpense] = await sql`
            INSERT INTO expenses ("projectId", category, amount, description, "receiptUrl")
            VALUES (${req.params.id}, ${category || 'Materials'}, ${amount || 0}, ${description || ''}, ${receiptUrl || ''})
            RETURNING *
        `;
        res.status(201).json(newExpense);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to log expense" });
    }
});

app.post('/api/projects/:id/invoices', async (req, res) => {
    try {
        const { amount, description, status } = req.body;
        const [newInvoice] = await sql`
            INSERT INTO invoices ("projectId", amount, description, status)
            VALUES (${req.params.id}, ${amount || 0}, ${description || ''}, ${status || 'Unpaid'})
            RETURNING *
        `;
        res.status(201).json(newInvoice);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create invoice" });
    }
});

app.delete('/api/expenses/:id', async (req, res) => {
    try {
        await sql`DELETE FROM expenses WHERE id = ${req.params.id}`;
        res.json({ message: "Expense deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete expense" });
    }
});

app.delete('/api/invoices/:id', async (req, res) => {
    try {
        await sql`DELETE FROM invoices WHERE id = ${req.params.id}`;
        res.json({ message: "Invoice deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete invoice" });
    }
});

app.put('/api/invoices/:id/status', async (req, res) => {
    try {
        const [updated] = await sql`
            UPDATE invoices 
            SET status = ${req.body.status}, "updatedAt" = now() 
            WHERE id = ${req.params.id}
            RETURNING *
        `;
        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update invoice status" });
    }
});

// --- CREW ROUTES ---
app.get('/api/crew', async (req, res) => {
    try {
        const crew = await sql`
            SELECT c.*, p.title AS "projectTitle"
            FROM crew c
            LEFT JOIN projects p ON c."currentProject" = p.id
            ORDER BY c."createdAt" DESC
        `;
        const formatted = crew.map(c => ({
            ...c,
            currentProject: c.currentProject ? { id: c.currentProject, _id: c.currentProject, title: c.projectTitle } : null
        }));
        res.json(formatted);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch crew" });
    }
});

app.post('/api/crew', async (req, res) => {
    try {
        const { name, role, phone, currentProject } = req.body;
        const projectVal = currentProject || null;
        
        const [newCrew] = await sql`
            INSERT INTO crew (name, role, phone, "currentProject")
            VALUES (${name}, ${role || ''}, ${phone || ''}, ${projectVal})
            RETURNING *
        `;
        
        if (newCrew.currentProject) {
            const [proj] = await sql`SELECT title FROM projects WHERE id = ${newCrew.currentProject}`;
            newCrew.currentProject = { id: newCrew.currentProject, _id: newCrew.currentProject, title: proj.title };
        } else {
            newCrew.currentProject = null;
        }
        res.status(201).json(newCrew);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add crew member" });
    }
});

app.put('/api/crew/:id', async (req, res) => {
    try {
        const { name, role, phone, currentProject } = req.body;
        const projectVal = currentProject === "" ? null : (currentProject || null);
        
        const [updated] = await sql`
            UPDATE crew
            SET name = ${name}, role = ${role}, phone = ${phone}, "currentProject" = ${projectVal}, "updatedAt" = now()
            WHERE id = ${req.params.id}
            RETURNING *
        `;
        
        if (updated.currentProject) {
            const [proj] = await sql`SELECT title FROM projects WHERE id = ${updated.currentProject}`;
            updated.currentProject = { id: updated.currentProject, _id: updated.currentProject, title: proj.title };
        } else {
            updated.currentProject = null;
        }
        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update crew member" });
    }
});

app.delete('/api/crew/:id', async (req, res) => {
    try {
        await sql`DELETE FROM crew WHERE id = ${req.params.id}`;
        res.json({ message: "Crew deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete crew" });
    }
});

// --- INVENTORY ROUTES ---
app.get('/api/inventory', async (req, res) => {
    try {
        const items = await sql`
            SELECT i.*, p.title AS "locationTitle"
            FROM inventory i
            LEFT JOIN projects p ON i."currentLocation" = p.id
            ORDER BY i."createdAt" DESC
        `;
        const formatted = items.map(i => ({
            ...i,
            currentLocation: i.currentLocation ? { _id: i.currentLocation, title: i.locationTitle } : null
        }));
        res.json(formatted);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch inventory" });
    }
});

app.post('/api/inventory', async (req, res) => {
    try {
        const { name, type, status, quantity, minQuantity, unit, currentLocation } = req.body;
        const locationVal = currentLocation || null;

        const [newItem] = await sql`
            INSERT INTO inventory (name, type, status, quantity, "minQuantity", unit, "currentLocation")
            VALUES (${name}, ${type}, ${status || 'Available'}, ${quantity || 0}, ${minQuantity || 0}, ${unit || ''}, ${locationVal})
            RETURNING *
        `;
        
        if (newItem.currentLocation) {
            const [proj] = await sql`SELECT title FROM projects WHERE id = ${newItem.currentLocation}`;
            newItem.currentLocation = { _id: newItem.currentLocation, title: proj.title };
        } else {
            newItem.currentLocation = null;
        }
        res.status(201).json(newItem);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add inventory item" });
    }
});

app.put('/api/inventory/:id', async (req, res) => {
    try {
        const { name, type, status, quantity, minQuantity, unit, currentLocation } = req.body;
        const locationVal = currentLocation === "" ? null : (currentLocation || null);

        const [updated] = await sql`
            UPDATE inventory
            SET name = ${name}, type = ${type}, status = ${status}, quantity = ${quantity}, "minQuantity" = ${minQuantity}, unit = ${unit}, "currentLocation" = ${locationVal}, "updatedAt" = now()
            WHERE id = ${req.params.id}
            RETURNING *
        `;
        
        if (updated.currentLocation) {
            const [proj] = await sql`SELECT title FROM projects WHERE id = ${updated.currentLocation}`;
            updated.currentLocation = { _id: updated.currentLocation, title: proj.title };
        } else {
            updated.currentLocation = null;
        }
        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update inventory" });
    }
});

app.delete('/api/inventory/:id', async (req, res) => {
    try {
        await sql`DELETE FROM inventory WHERE id = ${req.params.id}`;
        res.json({ message: "Item deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete item" });
    }
});

// --- SCHEDULING ROUTES ---
app.get('/api/schedule', async (req, res) => {
    try {
        const events = await sql`
            SELECT s.*, p.title AS "projectTitle"
            FROM schedule_events s
            LEFT JOIN projects p ON s."projectId" = p.id
            ORDER BY s."startDate" ASC
        `;
        const formatted = events.map(e => ({
            ...e,
            projectId: e.projectId ? { _id: e.projectId, title: e.projectTitle } : null
        }));
        res.json(formatted);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch schedule events" });
    }
});

app.post('/api/schedule', async (req, res) => {
    try {
        const { title, resourceType, resourceId, projectId, startDate, endDate, notes } = req.body;
        const [newEvent] = await sql`
            INSERT INTO schedule_events (title, "resourceType", "resourceId", "projectId", "startDate", "endDate", notes)
            VALUES (${title}, ${resourceType}, ${resourceId}, ${projectId}, ${startDate}, ${endDate}, ${notes || ''})
            RETURNING *
        `;
        const [proj] = await sql`SELECT title FROM projects WHERE id = ${newEvent.projectId}`;
        newEvent.projectId = { _id: newEvent.projectId, title: proj.title };
        res.status(201).json(newEvent);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create schedule event" });
    }
});

app.delete('/api/schedule/:id', async (req, res) => {
    try {
        await sql`DELETE FROM schedule_events WHERE id = ${req.params.id}`;
        res.json({ message: "Event deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete schedule event" });
    }
});

// --- ISSUES ROUTES ---
app.get('/api/issues', async (req, res) => {
    try {
        const issues = await sql`
            SELECT i.*, p.title AS "projectTitle"
            FROM issues i
            LEFT JOIN projects p ON i."projectId" = p.id
            ORDER BY i."createdAt" DESC
        `;
        const formatted = issues.map(i => ({
            ...i,
            projectId: i.projectId ? { _id: i.projectId, title: i.projectTitle } : null
        }));
        res.json(formatted);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch issues" });
    }
});

app.post('/api/issues', async (req, res) => {
    try {
        const { title, description, projectId, status, priority } = req.body;
        const [newIssue] = await sql`
            INSERT INTO issues (title, description, "projectId", status, priority)
            VALUES (${title}, ${description || ''}, ${projectId}, ${status || 'Open'}, ${priority || 'Medium'})
            RETURNING *
        `;
        const [proj] = await sql`SELECT title FROM projects WHERE id = ${newIssue.projectId}`;
        newIssue.projectId = { _id: newIssue.projectId, title: proj.title };
        res.status(201).json(newIssue);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create issue" });
    }
});

app.put('/api/issues/:id', async (req, res) => {
    try {
        const { title, description, projectId, status, priority } = req.body;
        const [updated] = await sql`
            UPDATE issues
            SET title = ${title}, description = ${description}, "projectId" = ${projectId}, status = ${status}, priority = ${priority}, "updatedAt" = now()
            WHERE id = ${req.params.id}
            RETURNING *
        `;
        const [proj] = await sql`SELECT title FROM projects WHERE id = ${updated.projectId}`;
        updated.projectId = { _id: updated.projectId, title: proj.title };
        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update issue" });
    }
});

app.delete('/api/issues/:id', async (req, res) => {
    try {
        await sql`DELETE FROM issues WHERE id = ${req.params.id}`;
        res.json({ message: "Issue deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete issue" });
    }
});

// --- VAULT ROUTES ---
app.get('/api/vault', async (req, res) => {
    try {
        const docs = await sql`
            SELECT v.*, p.title AS "projectTitle"
            FROM vault_documents v
            LEFT JOIN projects p ON v."projectId" = p.id
            ORDER BY v."createdAt" DESC
        `;
        const formatted = docs.map(d => ({
            ...d,
            projectId: d.projectId ? { _id: d.projectId, title: d.projectTitle } : null
        }));
        res.json(formatted);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch documents" });
    }
});

app.post('/api/vault', async (req, res) => {
    try {
        const { title, projectId, url, type } = req.body;
        const [newDoc] = await sql`
            INSERT INTO vault_documents (title, "projectId", url, type)
            VALUES (${title}, ${projectId}, ${url}, ${type || 'Other'})
            RETURNING *
        `;
        const [proj] = await sql`SELECT title FROM projects WHERE id = ${newDoc.projectId}`;
        newDoc.projectId = { _id: newDoc.projectId, title: proj.title };
        res.status(201).json(newDoc);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to upload document" });
    }
});

app.delete('/api/vault/:id', async (req, res) => {
    try {
        await sql`DELETE FROM vault_documents WHERE id = ${req.params.id}`;
        res.json({ message: "Document deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete document" });
    }
});

// --- INQUIRIES ROUTES ---
app.get('/api/inquiries', async (req, res) => {
    try {
        const inquiries = await sql`SELECT * FROM inquiries ORDER BY "createdAt" DESC`;
        res.json(inquiries);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch inquiries" });
    }
});

app.post('/api/inquiries', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, projectType, message } = req.body;
        const [newInquiry] = await sql`
            INSERT INTO inquiries ("firstName", "lastName", email, phone, "projectType", message)
            VALUES (${firstName || ''}, ${lastName || ''}, ${email || ''}, ${phone || ''}, ${projectType || ''}, ${message || ''})
            RETURNING *
        `;
        res.status(201).json(newInquiry);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to submit inquiry" });
    }
});

app.put('/api/inquiries/:id', async (req, res) => {
    try {
        const [updated] = await sql`
            UPDATE inquiries 
            SET status = ${req.body.status}, "updatedAt" = now() 
            WHERE id = ${req.params.id}
            RETURNING *
        `;
        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update inquiry" });
    }
});

app.delete('/api/inquiries/:id', async (req, res) => {
    try {
        await sql`DELETE FROM inquiries WHERE id = ${req.params.id}`;
        res.json({ message: "Inquiry deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete inquiry" });
    }
});

// --- DASHBOARD STATS ROUTE ---
app.get('/api/dashboard/stats', async (req, res) => {
    try {
        const [stats] = await sql`
            SELECT 
                (SELECT count(*) FROM projects WHERE status IN ('Ongoing', 'Upcoming'))::int AS active_projects,
                (SELECT count(*) FROM crew)::int AS total_workers,
                (SELECT count(*) FROM invoices WHERE status = 'Unpaid')::int AS pending_invoices,
                (SELECT count(*) FROM issues WHERE status = 'Open')::int AS open_issues
        `;
        const recentLogs = await sql`SELECT * FROM projects ORDER BY "createdAt" DESC LIMIT 3`;
        
        // Count roles for Designation Mix
        const supervisors = await sql`SELECT count(*)::int FROM crew WHERE role ILIKE '%supervisor%' OR role ILIKE '%manager%'`;
        const masons = await sql`SELECT count(*)::int FROM crew WHERE role ILIKE '%mason%'`;
        const laborers = await sql`SELECT count(*)::int FROM crew WHERE role ILIKE '%laborer%' OR role ILIKE '%labour%'`;
        
        res.json({
            activeProjects: stats.active_projects,
            totalWorkers: stats.total_workers,
            pendingInvoices: stats.pending_invoices,
            openIssues: stats.open_issues,
            recentLogs,
            designationMix: {
                supervisors: supervisors[0].count,
                masons: masons[0].count,
                laborers: laborers[0].count
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
});

// Simple health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running smoothly on Supabase Postgres' });
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
