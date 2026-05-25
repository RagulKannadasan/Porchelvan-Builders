# Messages & Lead Management Page Documentation (`Messages.jsx`)

The **Messages & Leads** section acts as the primary Customer Relationship Management (CRM) hub. It aggregates prospect contact inquiries submitted via the public-facing Landing Page, allowing staff to follow up on sales leads and archive old requests.

---

## 🎨 Page Layout & Styling
* **Split Layout Matrix**: Displays all incoming messages on the left side, and detailed profiles of the selected message on the right.
* **Lead Avatar (`.avatar`)**: Modern rounded bubble with initials of the prospect (colored in **Vibrant Orange**).
* **Responsive Layout**: Side-by-side display scales smoothly to single vertical sections on mobile.

---

## 🛠️ Operations & Features

### 1. Inquiries Dashboard
* **Dynamic Pipeline badging**: Leads display custom borders and semi-transparent badges representing follow-up states:
  * **New**: Lead is unread or awaiting initial review (Vibrant Orange).
  * **Contacted**: Sales agent has reached out to the client (Green).
  * **Archived**: Completed or spam inquiries (Muted Gray).

### 2. Lead Review Card
Once an inquiry is selected:
* **Contact details grid**: Quick-access fields for *Email*, *Phone*, and *Project Type*.
* **Lead Message Container**: Clean text segment highlighting custom specifications written by the customer.
* **Pipeline Status Selector**: Dropdown to transition pipeline state, dynamically refetching lists to update the UI on successful DB commits.

---

## 🔌 API Endpoints Integration

### Inquiries API
* **GET `/api/inquiries`**: Fetches all lead inquiries logged via the website.
* **PUT `/api/inquiries/:id`**: Modifies the pipeline status of the inquiry.
  * Payload:
    ```json
    {
      "status": "Contacted"
    }
    ```
