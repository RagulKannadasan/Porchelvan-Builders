# Crew & Collaborators Page Documentation (`Crew.jsx`)

The **Crew & Collaborators** directory serves as the HR and logistics command center. Managers can register employees, detail their primary trades, and assign or schedule them to active construction projects dynamically.

---

## 🎨 Page Design & Layout
* **Grid Directory (`.crew-grid`)**: Responsive card grid of all staff members.
* **Initials Avatar (`.crew-avatar`)**: Renders first letter of full name, styled with a sleek gradient background.
* **Dropdown Assignment**: Dynamic dropdown selection container attached to each employee card for quick scheduling updates.

---

## 🛠️ Operations & Features

### 1. Crew Registration
* **Add Crew Modal**: Register staff with fields:
  * **Full Name**: Personal name identifier.
  * **Primary Role**: Site Manager, Electrician, Plumber, Carpenter, Mason, General Labor, or Architect.
  * **Phone Number**: Primary contact for SMS/OTP integrations.
  * **Initial Assignment**: Assign to active site or leave as "Bench (Unassigned)".

### 2. Live Dynamic Assignment Calendar
* Allows quick updating of labor placement across construction sites. Selecting an option in the dropdown updates assignments instantly.
* Automatically filters out completed projects to avoid accidental scheduling.

---

## 🔌 API Endpoints Integration

### Crew API
* **GET `/api/crew`**: Fetches the workforce registry.
* **POST `/api/crew`**: Registers a new worker.
* **PUT `/api/crew/:id`**: Reassigns crew member to another project.
  * Payload:
    ```json
    {
      "currentProject": "projectId"
    }
    ```
* **DELETE `/api/crew/:id`**: Deletes the crew registry entry.
