# Centralized Scheduling Page Documentation (`Scheduling.jsx`)

The **Centralized Scheduling** manager coordinates resources by blocking crew members or heavy machinery assets for specific construction projects within defined date ranges. This timeline view helps prevent double-booking issues and tracks operational logistics.

---

## 🎨 Page Interface Architecture
* **Monthly Timeline View (`.timeline-month`)**: Groups registered assignments by month (e.g. *"May 2026"*), displaying cards in chronological order.
* **Vertical Connector Pipeline (`.timeline-events`)**: Visual timeline pipe with connecting pins (`::before` lines) extending to each card.
* **Active Status Highlights (`.active-event`)**: Active items (where today's date falls between the start and end dates) display a thick **Vibrant Orange** left border.

---

## 🛠️ Operations & Features

### 1. Resource Scheduling Form
* **Resource Type Filter**: Choose whether to schedule a **Crew Member** (labor allocation) or **Heavy Equipment** (machinery allocation).
* **Dynamic Resource Selector**: Populates dropdown options based on the active resource type selection, showing trades or machinery names.
* **Project Selection**: Filtered list of ongoing project locations.
* **Date Picker Range**: Inputs for *Start Date* and *End Date*.
* **Notes Details**: Text input for site foremen instructions (e.g., *"Perform excavation on Phase 2"*).

---

## 🔌 API Endpoints Integration

### Schedule API
* **GET `/api/schedule`**: Fetches registered event blocks.
* **POST `/api/schedule`**: Creates an event assignment block.
  * Payload:
    ```json
    {
      "title": "Excavation Works",
      "resourceType": "Equipment",
      "resourceId": "machineryId",
      "projectId": "projectId",
      "startDate": "2026-05-25",
      "endDate": "2026-05-28",
      "notes": "Confirm diesel fuel is topped up."
    }
    ```
* **DELETE `/api/schedule/:id`**: Removes scheduling assignment block.
