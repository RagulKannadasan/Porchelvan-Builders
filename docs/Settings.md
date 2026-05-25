# System Settings Page Documentation (`Settings.jsx`)

The **System Settings** manager controls visual preferences, notification toggle profiles, and comprehensive database backup, export, and import tasks.

---

## 🎨 Page Setup & Tab Layout
* **Left Navigation Panel (`.settings-nav`)**: Custom-styled navigation list with integrated Lucide icons.
* **Content Segment (`.settings-content`)**: Adaptive viewport displaying the targeted controls based on the selected tab:
  * **Profile & Account**
  * **Appearance**
  * **Notifications**
  * **Data Management**

---

## 🛠️ Settings Compartments

### 1. Profile & Account
* Inputs to modify full administrator name and email values.
* Password credentials replacement controls.

### 2. Appearance & Visual Themes
* Offers card options to choose local theme setups:
  * **Light Mode**: Inverts variables to high-contrast white background styling.
  * **Dark Mode**: Sets body attribute `data-theme="dark"` for modern, low-light viewing.
  * **System Theme**: Default preference that adapts to local OS configurations.

### 3. Notification Toggles
* Clean toggle switches to customize alert permissions:
  * **Email Alerts**: Standard notifications.
  * **Low Stock Warnings**: Triggers when inventory levels fall below set limits.
  * **New Issues Logged**: Triggers for snag reports.
  * **Daily Digest**: Nightly construction summaries.

### 4. Data Backup Management (JSON Exporter/Importer)
An operational backup recovery vault to preserve data and manage the 512 MB storage limit:
* **JSON Exporter**: Orchestrates concurrent `Promise.all` fetches across 6 primary collections:
  * `projects`, `crew`, `inventory`, `schedule`, `issues`, and `vault`.
  * Generates and downloads a timestamped backup file: `porchelvan_builders_backup_YYYY-MM-DD.json`.
* **JSON Importer**: Allows users to select a JSON file. Automatically parses and cleans metadata (`_id`, `__v`), then runs sequential `POST` queries to restore databases seamlessly.

---

## 🔌 API Endpoints Integration

### Concurrent Data Fetch (Export)
* **GET `/api/projects`**
* **GET `/api/crew`**
* **GET `/api/inventory`**
* **GET `/api/schedule`**
* **GET `/api/issues`**
* **GET `/api/vault`**

### Sequential Restoration (Import)
* **POST `/api/projects`**
* **POST `/api/crew`**
* **POST `/api/inventory`**
* **POST `/api/schedule`**
* **POST `/api/issues`**
* **POST `/api/vault`**
