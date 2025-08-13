DROP TABLE IF EXISTS asset_allocations, form_submissions, grievances, key_moments, announcements, publications, events, projects, it_assets, users, forms CASCADE;

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

CREATE TABLE forms (
    form_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    version VARCHAR(20),
    last_updated DATE,
    search_tags TEXT,
    badge_text VARCHAR(50),
    badge_color VARCHAR(50)
);

CREATE TABLE form_submissions (
    submission_id SERIAL PRIMARY KEY,
    form_id INTEGER REFERENCES forms(form_id),
    user_id INTEGER REFERENCES users(user_id),
    status VARCHAR(50) DEFAULT 'submitted',
    submission_data JSONB NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE it_assets (
    asset_id SERIAL PRIMARY KEY,
    asset_name VARCHAR(255) NOT NULL,
    asset_type VARCHAR(100) NOT NULL,
    license_key VARCHAR(255) NULL,
    status VARCHAR(50) DEFAULT 'Available'
);

CREATE TABLE asset_allocations (
    allocation_id SERIAL PRIMARY KEY,
    asset_id INTEGER REFERENCES it_assets(asset_id),
    user_id INTEGER REFERENCES users(user_id),
    assigned_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    returned_date TIMESTAMP WITH TIME ZONE NULL,
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE grievances (
    grievance_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    grievance_subject VARCHAR(255) NOT NULL,
    grievance_details TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'submitted',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(100)
);

CREATE TABLE events (
    event_id SERIAL PRIMARY KEY,
    day VARCHAR(10),
    month VARCHAR(10),
    title VARCHAR(255),
    description TEXT,
    event_date DATE
);

CREATE TABLE publications (
    publication_id SERIAL PRIMARY KEY,
    type VARCHAR(100),
    title VARCHAR(255),
    meta VARCHAR(255),
    description TEXT,
    pdf_link VARCHAR(255)
);

CREATE TABLE announcements (
    announcement_id SERIAL PRIMARY KEY,
    date VARCHAR(100),
    title VARCHAR(255),
    description TEXT
);

CREATE TABLE key_moments (
    image_id SERIAL PRIMARY KEY,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(255)
);