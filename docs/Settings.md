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

### 4. Data Backup & Report Management (JSON & Excel Exporters)
An operational backup and reporting vault to preserve records, analyze statistics, and manage the 512 MB Atlas database limits:
* **JSON Exporter**: Orchestrates concurrent `Promise.all` fetches across 6 primary collections (`projects`, `crew`, `inventory`, `schedule`, `issues`, `vault`) and package them into a timestamped file: `porchelvan_builders_backup_YYYY-MM-DD.json`.
* **JSON Importer**: Parses selected JSON backup files, automatically cleans database specific parameters (`_id`, `__v`, `id`), and runs batch sequential `POST` queries to restore systems.
* **Excel Exporter**: Downloads a multi-sheet spreadsheet file: `porchelvan_builders_export_YYYY-MM-DD.xlsx`. 
  * Automatically creates a separate tab for each database collection (**Projects**, **Crew**, **Inventory**, **Schedule**, **Issues**, **Vault**).
  * **Relational Flatting**: Resolves Mongoose object IDs and references to human-readable strings (e.g. converting a project object reference to its clean site title, or array fields into comma-separated text) so it is instantly readable in Microsoft Excel or Google Sheets.
  * **Sanitization**: Strips raw system internal IDs (`_id` and `__v`) for clear sheet grids.

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
