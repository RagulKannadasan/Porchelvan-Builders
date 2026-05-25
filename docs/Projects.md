# Projects Management Page Documentation (`Projects.jsx`)

The **Projects Management** page is where internal administrative personnel can manage construction projects and track **Site Diaries (Daily Logs)**. Foremen or site managers submit structured daily diaries tracking tasks completed, weather conditions, on-site personnel count, and operational roadblocks.

---

## 🎨 Page Interface Architecture
* **Split Screen Layout**: Renders a sidebar-list on the left (`1fr`) displaying all construction project names and statuses, alongside a details panel on the right (`2.5fr`) dynamically displaying the selected project's profile and active Site Diaries.
* **Modal Dialog**: Dynamically pops open a clean overlay for creating projects on-the-fly.

---

## 🛠️ Operations & Features

### 1. Project CRUD Actions
* **Create Project**: Input fields for *Project Title, Description, Location, and Status (Upcoming, Ongoing, Completed)*.
* **Read Project List**: Lists cards with title, area/city location, and badge filters.
* **Delete Project**: Triggers secure window confirmation before removing project and its nested database logs.

### 2. Site Diaries (Daily Logs) Module
When a project is selected:
* **Log Entry Form**:
  * **Work Completed**: Textarea documenting achievements.
  * **Issues / Roadblocks**: Logs materials delays, heavy machinery failures, or design bottlenecks.
  * **Workers Present**: Number of laborers on-site.
* **Live Weather Integration**: The backend automatically fetches and logs local weather (e.g. `🌤️ Partly Cloudy`) from a third-party Weather API when the foreman submits the diary.
* **Diaries Log Feed**: Scrollable historical cards displaying Calendar dates, active weather indicators, work summaries, and alert highlight items for roadblock issues.

---

## 🔌 API Endpoints Integration

### Projects API
* **GET `/api/projects`**: Fetches active construction projects list.
* **POST `/api/projects`**: Submits a new project record.
* **DELETE `/api/projects/:id`**: Deletes a project.

### Diaries API
* **GET `/api/projects/:projectId/diaries`**: Fetches daily logs for selected project.
* **POST `/api/projects/:projectId/diaries`**: Creates a daily site diary.
  * Payload:
    ```json
    {
      "workCompleted": "Foundation cement pouring finished on Block A.",
      "issues": "None",
      "workersPresent": 14
    }
    ```
