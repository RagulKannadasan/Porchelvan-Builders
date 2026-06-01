# Landing Page Documentation (`LandingPage.jsx`)

The **Landing Page** is the public-facing homepage of the Porchelvan Builders web platform. It is designed to capture client attention, showcase structural expertise through dynamic animations, display high-quality portfolios, and collect initial inquiries.

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
* Logo container with custom styled typography ("Porchelvan Builders").
* Integrated dark/light mode toggle switch.
* Mobile-responsive overlay triggered via a slide-in transition.

### 2. Hero Section (`.hero`)
* Attention-grabbing title: *"Let's build your dream home together."*
* Brand Slogan integrated: *"Innovative Concepts, Creative Design, Flawless Execution."*
* Integrates a custom performant **2D SVG Construction Animation** (`ConstructionAnimation.jsx`) replacing heavy 3D dependencies for optimal mobile performance.

### 3. Services Grid (`.svc-grid`)
* Displays interactive cards for the 6 core business pillars:
  1. **Construction**: Expert residential and commercial construction.
  2. **Architect & Design**: Innovative concepts and creative design.
  3. **Interiors**: Premium interior design and execution.
  4. **Real Estate**: Trusted guidance and solutions.
  5. **Building Approval**: Hassle-free navigation of approvals.
  6. **Loan Arrangement**: Seamless financial planning assistance.

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

### 7. Interactive Lead Capture Form & Contact Info
* Displays real-world contact information:
  * Phone: +91 97510 61442, +91 97510 66222
  * Email: porchelvanbuilders.er@gmail.com
  * Address: 137, West Street, Kavarappattu, Orathanadu, Thanjavur
* Features a clean, fully functional contact form to submit inquiries.
* Fields: *First Name, Last Name, Email, Phone, Project Type (Dropdown), and Message*.

### 8. Footer (`.foot-w`)
* Professional brand closure mentioning the founder **Er. J. Arulmozhiselvan B.E.**
* Quick links to Services, Company info, and Support.
* A subtle Admin Portal entry link for staff access.

---

## 🔌 API Endpoints Integration
* **POST `/api/inquiries`**: Submits user inputs to the backend database.
  * Payload:
    ```json
    {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+91 97510 61442",
      "projectType": "residential",
      "message": "Custom home design enquiry."
    }
    ```
