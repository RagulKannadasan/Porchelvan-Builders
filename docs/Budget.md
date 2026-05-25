# Budget & Invoices Page Documentation (`Budget.jsx`)

The **Budget & Invoices** page allows company management to track project financials, monitor construction cost estimates, log receipts, and review overall profitability parameters per site.

---

## 🎨 Page Architecture
* **Sidebar Selector**: Choose a construction site from the sidebar (`250px` width) to view site-specific financial statements.
* **Metric Overviews (`.metrics-grid`)**: Renders quick-glance status indicators:
  * **Total Expenses**: Sum of all recorded equipment, materials, and labor costs (highlighted in **Vibrant Orange**).
  * **Total Invoiced**: Total amount billed to the customer (highlighted in **Deep Indigo Blue**).
  * **Net Profit**: Auto-calculated statement (`Total Invoiced - Total Expenses`), highlighting green for positive profit and red for active overruns.

---

## 🛠️ Key Features

### 1. Expense Sourcing & Logs
* **Add Expense Modal**: Log transaction details:
  * **Category**: Materials, Labor, Equipment, or Miscellaneous.
  * **Amount**: Financial cost parameters in rupees.
  * **Description**: Detailed vendor data, invoice item description, or location parameters.
  * **Receipt Upload Interface**: Image dropzone to upload receipt photos directly (simplifying daily logs from the hardware store).

### 2. Invoices & Quotations Generator
* **Create Invoice Modal**: Inputs for *Amount* and *Work Stage* (e.g. *"Slab Completion Payment"*).
* **Payment Status Toggle**: Displays a status badge (*Paid / Unpaid*). Interactive state triggers dynamic DB updates toggling status values directly.

---

## 🔌 API Endpoints Integration

### Budget API
* **GET `/api/projects/:projectId/budget`**: Pulls financial statements (nested list of expenses and invoices).

### Expenses API
* **POST `/api/projects/:projectId/expenses`**: Creates a new expense log.
  * Payload:
    ```json
    {
      "category": "Materials",
      "amount": 45000,
      "description": "50 Cement Bags from UltraTech dealer",
      "receiptUrl": ""
    }
    ```

### Invoices API
* **POST `/api/projects/:projectId/invoices`**: Creates a billing record.
* **PUT `/api/invoices/:invoiceId/status`**: Updates status between `Paid` and `Unpaid`.
