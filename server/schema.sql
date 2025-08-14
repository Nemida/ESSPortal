-- Drop existing tables in reverse order of dependency to ensure a clean setup
DROP TABLE IF EXISTS asset_allocations, form_submissions, grievances, key_moments, announcements, publications, events, projects, it_assets, users, forms CASCADE;

-- Stores user accounts and roles (employee/admin)
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'employee',
    job_title VARCHAR(100),
    department VARCHAR(100)
);

-- Stores metadata for the forms in the Employee Forms Portal
CREATE TABLE forms (
    form_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    version VARCHAR(20),
    last_updated DATE,
    search_tags TEXT,
    badge_text VARCHAR(50),
    badge_color VARCHAR(50),
    component_name VARCHAR(255)
);

-- Tracks each form submitted by a user
CREATE TABLE form_submissions (
    submission_id SERIAL PRIMARY KEY,
    form_id INTEGER REFERENCES forms(form_id),
    user_id INTEGER REFERENCES users(user_id),
    status VARCHAR(50) DEFAULT 'submitted',
    submission_data JSONB NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Stores information about IT assets
CREATE TABLE it_assets (
    asset_id SERIAL PRIMARY KEY,
    asset_name VARCHAR(255) NOT NULL,
    asset_type VARCHAR(100) NOT NULL,
    license_key VARCHAR(255) NULL,
    purchase_date DATE,
    expiry_date DATE,
    status VARCHAR(50) DEFAULT 'Available'
);

-- Tracks the assignment history of IT assets to users
CREATE TABLE asset_allocations (
    allocation_id SERIAL PRIMARY KEY,
    asset_id INTEGER REFERENCES it_assets(asset_id),
    user_id INTEGER REFERENCES users(user_id),
    assigned_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    returned_date TIMESTAMP WITH TIME ZONE NULL,
    is_active BOOLEAN DEFAULT true
);

-- Securely stores employee grievance submissions
CREATE TABLE grievances (
    grievance_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    grievance_subject VARCHAR(255) NOT NULL,
    grievance_details TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'submitted',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Stores major projects for the research page
CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(100)
);

-- Stores events for the events page and homepage
CREATE TABLE events (
    event_id SERIAL PRIMARY KEY,
    day VARCHAR(10),
    month VARCHAR(10),
    title VARCHAR(255),
    description TEXT,
    event_date DATE
);

-- Stores publications for the publications page and homepage
CREATE TABLE publications (
    publication_id SERIAL PRIMARY KEY,
    type VARCHAR(100),
    title VARCHAR(255),
    meta VARCHAR(255),
    description TEXT,
    pdf_link VARCHAR(255)
);

-- Stores announcements for the homepage and admin dashboard
CREATE TABLE announcements (
    announcement_id SERIAL PRIMARY KEY,
    date VARCHAR(100),
    title VARCHAR(255),
    description TEXT
);

-- Stores image URLs for the homepage's "Key Moments" gallery
CREATE TABLE key_moments (
    image_id SERIAL PRIMARY KEY,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(255)
);