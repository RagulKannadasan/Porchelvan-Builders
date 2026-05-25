# Dashboard Page Documentation (`Dashboard.jsx`)

The **Administrative Dashboard** is the secure, central operations hub for the Porchelvan Builders internal management team. It aggregates key operations metrics, tracks database storage footprints, shows structural logs, and displays crew resource availability.

---

## 🎨 UI & Layout Guidelines
* **Minimalist Aesthetics**: Ditching crowded dashboards, this page adopts a borderless card philosophy with massive typography headers and generous whitespace.
* **Animations**: Elements load in sequence using CSS fade-in keyframes (`animate-fade-in-up`).
* **Visual States**: The *"Open Issues"* value automatically inverts color to **Vibrant Orange** if any critical tickets are logged.

---

## 📊 Core Metrics Matrix (`.stats-matrix`)
Directly tracks four vital status metrics:
1. **Active Projects**: Calculated number of live sites currently running.
2. **Crew Members**: Active labourers, supervisors, and masons assigned on-site today.
3. **Pending Invoices**: Estimated invoices awaiting client check or finance approval.
4. **Open Issues**: Unresolved structural, logistical, or materials delays requiring immediate review.

---

## ⚙️ Widgets & Charts

### 1. Designation Mix Widget (`.mix-list`)
* Categorizes current crew deployment using progress bars:
  * **Supervisors**: Managers in charge of daily log compliance.
  * **Masons**: Specialized construction workers.
  * **Laborers**: General works crew.

### 2. Recent Project Logs (`.log-list`)
* Captures a list of recent daily site entries, indicating the project name, physical location, and status dots.

### 3. Database Storage Monitor (`.storage-hero`)
* Tracks storage consumption closely (essential for managing the **512 MB MongoDB Atlas Free-Tier limit**).
* Displays a progress bar tracking total kilobytes, categorized by collections:
  * **Daily Logs** (e.g. `0.06 MB`)
  * **Expense Receipts** (e.g. `0.04 MB`)
  * **System Database & Users** (e.g. `0.02 MB`)

### 4. 7-Day Weekly Activity (`.weekly-chart`)
* Custom rendered CSS bar chart mapping daily log entry submissions from Monday through Sunday, tracking manager activity over a 7-day period.

---

## 🔌 API Endpoints Integration
* **GET `/api/dashboard/stats`**: Pulls compiled metrics on system status.
  * Response Schema:
    ```json
    {
      "activeProjects": 3,
      "totalWorkers": 18,
      "pendingInvoices": 2,
      "openIssues": 1,
      "recentLogs": [
        { "_id": "...", "title": "Heritage Villa", "location": "Thanjavur", "status": "active" }
      ],
      "designationMix": {
        "supervisors": 2,
        "masons": 6,
        "laborers": 10
      }
    }
    ```
