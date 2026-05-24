# Porchelvan Builders - Project Task List

This document tracks the implementation progress of all features defined in the requirements.

## 1. Project Infrastructure
- [x] Initialize Frontend (Vite + React)
- [x] Initialize Backend (Node.js + Express)
- [x] Connect Backend to Database (MongoDB Atlas)
- [x] Basic Project Schema and API routes
- [ ] Configure Deployment for Render

## 2. Landing Page (Public Facing)
- [x] **Header**: Navigation bar with company logo
- [x] **Light/Dark Mode Toggle**: Inverts base black and white colors
- [x] **Hero Section**: Background image, tagline, and CTA
- [x] **About**: Company history and mission
- [x] **Projects Showcase**: Grid of ongoing, upcoming, and completed projects
- [x] **Client Reviews**: Testimonials section
- [x] **Footer**: Address, contact, and links
- [ ] **Gallery Page**: Dedicated separate page for full visual showcase

## 3. Design & Styling (Landing Page)
- [x] Strict minimalist aesthetic (focus on whitespace and typography)
- [x] Color Palette: Black & White base
- [x] Color Palette: Deep Indigo Blue accent (from logo)
- [x] Color Palette: Vibrant Orange accent (from logo)

## 4. Administrative Portal (Internal System)
*(Note: These features are pending development)*

- [ ] **Authentication**: Passwordless OTP login via NodeMailer
- [ ] **Role-Based Access Control (RBAC)**: Enforce Admin/Site Manager/Client permissions
- [x] **Dashboard**: Overview of key metrics
- [x] **Projects Management**: Tracking order of work
- [x] **Site Diaries (Daily Logs)**: Reports with automated Weather API integration
- [ ] **Budget**: Tracking costs and profitability
- [ ] **Automated Quotation & Invoices**: Generate PDFs automatically
- [ ] **Expense Receipt Uploads**: Image uploads for hardware store receipts
- [ ] **Collaborators**: Directory for external contractors
- [ ] **Dynamic Crew Scheduling**: Centralized calendar to prevent double-booking
- [ ] **Inventory (Equipment)**: Tracking machinery status and location
- [ ] **Inventory (Materials)**: Stock tracking with low-supply alerts
- [ ] **Worker Attendance**: Time-tracking logs
- [ ] **Workers Data**: Internal HR directory
- [ ] **Customers Data**: CRM for client info
- [ ] **Client Portal**: Restricted read-only progress tracker for clients
- [ ] **Issue Tracking**: Ticketing system for roadblocks
- [ ] **Version-Controlled Document Vault**: Centralized storage for blueprints/CADs
- [ ] **Data Management**: Export current data and import legacy data
- [ ] **Database Management**: Archiving and cleanup tools to stay under 512 MB limit

## 5. Administrative Portal Design
- [x] Base Black & White with Indigo/Orange Brand Accents
- [x] Permanent desktop sidebar
- [x] 3-line hamburger toggle menu for mobile
