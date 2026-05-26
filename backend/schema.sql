-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist to allow clean reinstall
DROP TABLE IF EXISTS inquiries CASCADE;
DROP TABLE IF EXISTS vault_documents CASCADE;
DROP TABLE IF EXISTS issues CASCADE;
DROP TABLE IF EXISTS schedule_events CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS crew CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS site_diaries CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

-- 1. Projects Table
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  status text CHECK (status IN ('Ongoing', 'Upcoming', 'Completed')) DEFAULT 'Upcoming',
  "imageUrl" text,
  location text,
  "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
  "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);

-- 2. Site Diaries Table
CREATE TABLE site_diaries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "projectId" uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  date timestamp with time zone DEFAULT now() NOT NULL,
  weather text,
  "workCompleted" text,
  issues text,
  "workersPresent" integer DEFAULT 0,
  "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
  "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);

-- 3. Expenses Table
CREATE TABLE expenses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "projectId" uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  date timestamp with time zone DEFAULT now() NOT NULL,
  category text NOT NULL,
  amount double precision DEFAULT 0.0 NOT NULL CHECK (amount >= 0),
  description text,
  "receiptUrl" text,
  "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
  "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);

-- 4. Invoices Table
CREATE TABLE invoices (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "projectId" uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  date timestamp with time zone DEFAULT now() NOT NULL,
  amount double precision DEFAULT 0.0 NOT NULL CHECK (amount >= 0),
  status text CHECK (status IN ('Paid', 'Unpaid')) DEFAULT 'Unpaid',
  description text,
  "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
  "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);

-- 5. Crew Table
CREATE TABLE crew (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  role text,
  phone text,
  "currentProject" uuid REFERENCES projects(id) ON DELETE SET NULL,
  "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
  "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);

-- 6. Inventory Table
CREATE TABLE inventory (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  type text CHECK (type IN ('Equipment', 'Material')) NOT NULL,
  status text CHECK (status IN ('Available', 'In Use', 'Maintenance')) DEFAULT 'Available',
  quantity integer DEFAULT 0,
  "minQuantity" integer DEFAULT 0,
  unit text,
  "currentLocation" uuid REFERENCES projects(id) ON DELETE SET NULL,
  "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
  "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);

-- 7. Schedule Events Table
CREATE TABLE schedule_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  "resourceType" text CHECK ("resourceType" IN ('Crew', 'Equipment')) NOT NULL,
  "resourceId" uuid NOT NULL,
  "projectId" uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  "startDate" timestamp with time zone NOT NULL,
  "endDate" timestamp with time zone NOT NULL,
  notes text,
  "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
  "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);

-- 8. Issues Table
CREATE TABLE issues (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  "projectId" uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  status text CHECK (status IN ('Open', 'In Progress', 'Resolved')) DEFAULT 'Open',
  priority text CHECK (priority IN ('Low', 'Medium', 'High')) DEFAULT 'Medium',
  "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
  "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);

-- 9. Vault Documents Table
CREATE TABLE vault_documents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  "projectId" uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  url text NOT NULL,
  type text CHECK (type IN ('Blueprint', 'Permit', 'Contract', 'Other')) DEFAULT 'Other',
  "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
  "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);

-- 10. CRM Inquiries Table
CREATE TABLE inquiries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "firstName" text,
  "lastName" text,
  email text,
  phone text,
  "projectType" text,
  message text,
  status text CHECK (status IN ('New', 'Contacted', 'Archived')) DEFAULT 'New',
  "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
  "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);

-- Indexing foreign keys to maximize query performance under high load
CREATE INDEX idx_diaries_project ON site_diaries("projectId");
CREATE INDEX idx_expenses_project ON expenses("projectId");
CREATE INDEX idx_invoices_project ON invoices("projectId");
CREATE INDEX idx_crew_project ON crew("currentProject");
CREATE INDEX idx_inventory_location ON inventory("currentLocation");
CREATE INDEX idx_schedule_project ON schedule_events("projectId");
CREATE INDEX idx_issues_project ON issues("projectId");
CREATE INDEX idx_vault_project ON vault_documents("projectId");
