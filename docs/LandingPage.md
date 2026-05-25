# Landing Page Documentation (`LandingPage.jsx`)

The **Landing Page** is the public-facing homepage of the Porchelvan Builders web platform. It is designed to capture client attention, showcase structural expertise, display high-quality portfolios, and collect initial inquiries.

---

## 🎨 Design & Aesthetic System
The page follows a strict minimalist layout focusing heavily on whitespace, modern typography (Inter), and visual hierarchy.
* **Light/Dark Mode Toggle**: Built-in state inversion that updates background, cards, text color variables, and borders dynamically.
* **Responsive Layout**: Adheres to desktop navigation grids with clean collapsing overlays (hamburger menu) for mobile viewing.
* **Brand Accents**: Utilizes the brand logo colors (**Deep Indigo Blue** and **Vibrant Orange**) for highlights, call-to-actions (CTAs), service grids, and buttons.

---

## 🛠️ Key Features & Sections

### 1. Header & Navigation (`.nav`)
* Fixed top navbar that becomes semi-transparent with a clean blur effect (`backdrop-filter`) upon scroll.
* Logo container with custom styled typography.
* Integrated dark/light mode toggle switch.
* Mobile-responsive overlay triggered via a slide-in transition.

### 2. Hero Section (`.hero`)
* Attention-grabbing title: *"Building Homes That Last Generations"*.
* Displays business metrics such as **"28+ Years of Trust"** and **"1,200+ Happy Families"**.
* Floating visual cards displaying reviews with multi-avatar overlays.

### 3. Services Grid (`.svc-grid`)
* Displays interactive cards for the 6 core business pillars:
  1. **Custom Homes**: Bespoke residences.
  2. **Commercial Spaces**: High-impact commercial designs.
  3. **Renovation**: Expert renovations.
  4. **10-Year Warranty**: Long-term guarantees.
  5. **Smart Home Tech**: Seamless automation.
  6. **On-Time Delivery**: Track record metrics.

### 4. Projects Showcase (`.prj-grid`)
* Card-based display showing ongoing, upcoming, and completed projects:
  * *Ocean Breeze Villa* (Luxury)
  * *Jubilee Residences* (Premium)
  * *Lakeside Cottage* (Serene)
* Displays dynamic details such as Location, Price (Lakhs/Crores), Beds, Baths, and Sqft.

### 5. Step-by-Step Construction Process (`.proc-grid`)
* Visual timeline guiding prospects through the Porchelvan construction methodology:
  1. *Consultation* ➔ 2. *Blueprint & Approvals* ➔ 3. *Material Sourcing* ➔ 4. *Expert Construction* ➔ 5. *Handover & Warranty*.

### 6. Client Reviews (`.testi-grid`)
* Horizontal testimonials display with star ratings and client avatars.

### 7. Interactive Lead Capture Form (`.contact-form`)
* Features a clean, fully functional contact form to submit inquiries.
* Fields: *First Name, Last Name, Email, Phone, Project Type (Dropdown), and Message*.

---

## 🔌 API Endpoints Integration
* **POST `/api/inquiries`**: Submits user inputs to the backend database.
  * Payload:
    ```json
    {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+91 98765 43210",
      "projectType": "residential",
      "message": "Custom home design enquiry."
    }
    ```
