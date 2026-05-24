# Porchelvan Builders - Project Outline

This document outlines the structure and required features for the Porchelvan Builders web application, based on the initial project breakdown.

## 1. Landing Page (Public Facing)
This section represents the public-facing website designed to showcase the business, attract clients, and provide essential information.

*   **Header**: The top navigation bar, typically containing the company logo (`/home/ragul/Projects/Porchelvan-Builders/logo.png`) and links to main sections.
*   **Hero Section**: The primary, attention-grabbing banner at the top of the page. This section must feature a prominent **background image**, overlaid with a tagline and a call-to-action (CTA).
*   **About**: Information regarding the company's history, mission, vision, and core values.
*   **Projects**: A showcase of the company's portfolio, categorized into:
    *   **Ongoing Projects**: Details and progress of currently active construction sites.
    *   **Upcoming Projects**: Information about planned future developments and launches.
    *   **Completed Projects**: A gallery and case studies of finished work.
*   **Reviews**: Client testimonials and feedback to build trust and credibility.
*   **Gallery**: A visual showcase of construction work, designs, and completed buildings.
    *   *Note: This is specified to be a **separate page** rather than just a section on the main landing page.*
*   **Footer**: The bottom section of every page containing essential standard information:
    *   **Address**: Physical location(s) of the business offices.
    *   **Contact**: Phone numbers, email addresses, and potentially a quick contact form.
    *   **Links**: Important secondary links (e.g., Privacy Policy, Terms of Service, Social Media profiles).

---

## 2. Login / Administrative Portal (Internal System)
This represents the secure, internal management system used by the company to run day-to-day operations. **Authentication is passwordless, utilizing OTP (One-Time Password) verification only.**
*   **Role-Based Access Control (RBAC)**: The system enforces strict permission levels (e.g., Admin, Site Manager, Client). Users only access data relevant to their specific role to ensure security and privacy.

*   **Dashboard**: The central hub presented upon login, offering an overview of key metrics, alerts, and quick links to various modules.
*   **Projects**: Comprehensive management of all construction projects.
    *   **Order of Work**: Scheduling and sequencing of project phases and specific tasks.
    *   **Site Diaries (Daily Logs)**: Standardized daily reports where foremen record completed work, site visitors, photos, and unexpected delays. **Weather conditions are automatically logged** via a third-party Weather API based on the site's location.
*   **Budget**: Financial management tools for tracking project costs, estimates, expenses, and overall profitability.
    *   **Automated Quotation & Invoices**: Generate clean, branded PDF estimates and invoices automatically from project data.
    *   **Expense Receipt Uploads**: Site managers can upload compressed photos of hardware store receipts directly to the budget module to prevent lost records.
*   **Collaborators**: A directory and management module for external contractors and specialists (e.g., electricians, plumbers, architects, etc.).
*   **Dynamic Crew Scheduling**: A centralized calendar to assign foremen and laborers to specific sites, actively preventing double-booking and ensuring optimal task delegation.
*   **Inventory**: Tracking and management of physical assets across all sites.
    *   **Equipment & Asset Tracking**: Status logs for heavy machinery and tools, including current site location, operator assignment, and upcoming maintenance dates.
    *   **Material Inventory & Alerts**: Tracking stock levels of bulk building materials (cement, steel) with automated warnings when supplies run low.
*   **Worker Attendance**: A time-tracking system for daily logging of laborer presence and hours worked.
*   **Workers Data**: An employee directory and HR database containing contact details, skills, and records for all internal workers.
*   **Customers Data**: A Customer Relationship Management (CRM) module containing client contact information, preferences, and interaction history.
    *   **Client Portal (Progress Tracker)**: A restricted, read-only view where clients can log in (via OTP) to track the progress, milestones, and photos of their specific project without seeing internal administrative data.
*   **Issue**: A ticketing or tracking system for logging, managing, and resolving problems, defects, or roadblocks encountered on projects.
*   **Version-Controlled Document Vault**: Centralized, cloud-synced storage for blueprints, permits, and CAD files so everyone builds from the newest revision.
*   **Data Management**: Integrated tools to export current system data and import old data (e.g., from legacy systems or spreadsheets) for seamless transitions and backups.
*   **Database Management (Storage Optimization)**: Built-in tools and alerts to manage database size constraints (due to the 512 MB limit). This includes features to safely archive old projects, clean up logs, and monitor overall storage usage to prevent hitting capacity limits.

---

## 3. Technology Stack
The application will be built using the MERN stack to ensure a robust, scalable, and modern architecture.

*   **Frontend**: React JS
*   **Backend**: Node.js with Express JS
*   **Database**: MongoDB
*   **Email Services**: NodeMailer (for automated emails such as sending login OTPs, notifications, and contact form submissions)
*   **Deployment / Hosting**: Render (The application must be configured and developed specifically for seamless deployment on the Render hosting platform).

---

## 4. Design Guidelines
The application must adhere to a strict minimalistic design philosophy to ensure clarity, professionalism, and ease of use.

*   **UI/UX Aesthetic**: Clean, uncluttered, and highly minimalist.
*   **Color Palette**: 
    *   **Landing Page (Public)**: Incorporates the two brand colors extracted from the company logo (**Deep Indigo Blue** and **Vibrant Orange**) for accents, gradients, and calls-to-action, set against a Black & White base.
    *   **Administrative Portal (Internal)**: Utilizes the Black & White base but now incorporates the **Deep Indigo Blue** and **Vibrant Orange** logo colors for active states and highlights, unifying the brand across both the public and internal platforms.
    *   *Note*: Across both interfaces, the focus must remain heavily on whitespace, strong typography, and a very structured layout.
*   **Theming**: Implement a **Light/Dark Mode toggle** accessible from both the public landing page and the internal portal. The core black and white base colors will seamlessly invert based on the user's preference.
*   **Responsive Navigation**: 
    *   **Desktop**: Utilize a permanent side bar for main navigation.
    *   **Mobile**: Implement a 3-line hamburger menu in the top left corner that toggles a hidden menu on and off.
