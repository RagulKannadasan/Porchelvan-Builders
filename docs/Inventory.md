# Inventory Management Page Documentation (`Inventory.jsx`)

The **Inventory Management** page monitors high-value capital assets, machinery locations, and logistics materials essential to Porchelvan Builders' active construction workflows.

---

## 🎨 Layout & Navigation Features
* **Tabbed Navigation (`.tabs`)**: Implements tab switching to focus operations:
  * **Equipment Tracking**: Machinery status updates and site deployment details.
  * **Material Stock**: Stock counts, standard metric units, and alert thresholds.
* **Inline Table Controls**: Toggles or adjustments (e.g. incrementing brick stock, changing concrete mixer locations) occur inline without requiring modals.

---

## 🛠️ Operations & Features

### 1. Equipment Tracking Tab
Tracks capital tools (concrete mixers, excavators, scaffolding sets):
* **Status Updates**: Select dropdown values (*Available, In Use, Maintenance*), updating border highlights dynamically.
* **Deployment Siting**: Re-assigns machinery to active construction sites, helping managers coordinate logistics across projects.

### 2. Material Stock Tab
Monitors consumable inventory levels (cement bags, steel rebar, sand):
* **Direct Stock Incrementor**: Interactive `+` and `-` buttons for real-time inventory adjustments.
* **Low Supply Alerts**: Automatically marks rows in light red and attaches a **"Low Stock" alert badge** if quantities dip below a predefined threshold.
* **Assigned Location**: Identifies if stock is residing in the *Main Warehouse* or has already been delivered to a specific site.

---

## 🔌 API Endpoints Integration

### Inventory API
* **GET `/api/inventory`**: Fetches registered tools and consumables.
* **POST `/api/inventory`**: Creates a new asset or supply entry.
* **PUT `/api/inventory/:id`**: Modifies an item's status, stock levels, or location parameters.
  * Payload Example (Material quantity increment):
    ```json
    {
      "quantity": 12
    }
    ```
* **DELETE `/api/inventory/:id`**: Removes item from registry database.
