# Issues & Vault Page Documentation (`IssuesVault.jsx`)

The **Issues & Vault** page is a multi-purpose utility segment designed for **Quality Control** and **Document Storage**. It hosts the structural **Snag List** to track construction roadblocks, and the **Document Vault** to securely store blueprints, permits, and building contracts.

---

## 🎨 Tab Layout Navigation
* **Snag List (Issues)**: Renders a card-based board illustrating logged building defects or delays.
* **Document Vault**: Renders a structured file tabular layout tracking CAD blueprints, contract PDFs, and municipal permits.

---

## 🛠️ Operations & Features

### 1. Snag List defect management
* **Log Issue Modal**: Register defects with fields:
  * **Issue Title**: Concise title summarizing defect (e.g. *"Plumbing leak block B"*).
  * **Description**: Complete description of defect.
  * **Priority**: Low (Green), Medium (Orange), or High (Red) priority tags.
  * **Project Site**: Associated construction project.
* **Defect Actions**: Direct status updating select-box on cards (*Open, In Progress, Resolved*). Toggling status instantly updates status in backend.

### 2. Document Vault Management
* **Upload Document Modal**: Save blueprints or site documentation:
  * **Document Title**: Display name.
  * **Document Type**: Blueprint, Permit, Contract, or Other.
  * **Project Site**: Associated project.
  * **File URL**: Cloud storage link for secure file retrieval.
* **Document Table Feed**: Displays clickable URLs with target external link icons for quick access.

---

## 🔌 API Endpoints Integration

### Snag List API
* **GET `/api/issues`**: Fetches active snags and defects.
* **POST `/api/issues`**: Creates a defect snag log.
* **PUT `/api/issues/:id`**: Updates status.
  * Payload:
    ```json
    {
      "status": "In Progress"
    }
    ```
* **DELETE `/api/issues/:id`**: Removes defect log.

### Document Vault API
* **GET `/api/vault`**: Fetches secured document registry.
* **POST `/api/vault`**: Commits new file link.
* **DELETE `/api/vault/:id`**: Removes record.
