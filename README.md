# Employee Self-Service (ESS) Portal

A comprehensive web-based portal designed for internal organization management. This system streamlines employee services including leave management, IT asset tracking, grievance redressal, and internal communications.

![Status](https://img.shields.io/badge/Status-In%20Development-orange)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)

https://github.com/user-attachments/assets/83f2357e-a46c-485c-a66f-85d386e99d39



## Features

* **Role-Based Access Control**
  * **Admin Dashboard:** Full system administration with user management, grievance inbox, and form submission reviews.
  * **Employee Access:** Personal profile management, form submissions, and asset viewing.

* **Form Management**
  * Digital submission system for various organizational forms.
  * Form tracking with submission status.
  * Admin review and approval workflow.

* **Asset Management**
  * Track IT assets including hardware and software licenses.
  * Asset allocation and assignment history.
  * Employee asset viewing via `/my` endpoint for personal assets.

* **Information Hub**
  * **Announcements:** Organization-wide announcements management.
  * **Events:** Event calendar and event details.
  * **Publications:** Research publications repository.
  * **Key Moments:** Image gallery for organizational highlights.

* **Grievance Redressal**
  * Secure grievance submission system.
  * Admin grievance inbox for review and resolution.

* **Project Tracking**
  * Overview of active research projects.
  * Project status management.

* **AI Assistant**
  * Integrated AI chat functionality.
  * Grievance analysis (admin only).
  * Form field suggestions.
  * Dashboard insights generation.

* **Real-Time Chat**
  * Team communication feature.

## Tech Stack

* **Frontend:** React with Vite
* **Styling:** Tailwind CSS with PostCSS
* **Backend:** Node.js with Express
* **Database:** PostgreSQL
* **Authentication:** JWT (JSON Web Tokens)
* **AI Integration:** Hugging Face API (Llama 3)
* **Deployment:** Vercel (client) / Render (server)

## Getting Started

### Prerequisites

* Node.js (v16 or higher)
* npm or yarn
* PostgreSQL database (local or hosted)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/ess-portal.git
    cd ess-portal
    ```

2.  **Install dependencies**
    ```bash
    # Install client dependencies
    cd client && npm install

    # Install server dependencies
    cd ../server && npm install
    ```

3.  **Configure Environment Variables**

    **Server (`server/.env`):**
    ```env
    NODE_ENV=development
    DATABASE_URL=postgresql://username:password@localhost:5432/ess_portal
    JWT_SECRET=your_jwt_secret_key
    CLIENT_ORIGIN=http://localhost:5173
    HF_API_KEY=your_huggingface_api_key
    ```

    **Client (`client/.env`):**
    ```env
    VITE_API_URL=http://localhost:5000
    ```

4.  **Start the development servers**
    ```bash
    # Start the backend server (from server directory)
    npm start

    # Start the frontend (from client directory, in a new terminal)
    npm run dev
    ```

### Deployment Configuration

**Vercel (Frontend):**
- Set the project root directory to `client`
- Add environment variable:
  - `VITE_API_URL` = Your Render backend URL (e.g., `https://your-app.onrender.com`)

**Render (Backend):**
- Set the root directory to `server`
- Add environment variables:
  - `NODE_ENV` = `production`
  - `DATABASE_URL` = Your PostgreSQL connection string(transaction pooler)
  - `JWT_SECRET` = Your secure JWT secret
  - `CLIENT_ORIGIN` = Your Vercel frontend URL (e.g., `https://your-app.vercel.app`)
  - `HF_API_KEY` = Your Hugging Face API key for AI features

> **Note:** Password hashing can be done using `hashGenerator.js` in the server directory. All seeded users have the password "password".

### 🗄️ Database Setup

To make the app function, you must populate your Supabase database with the required tables and sample data.

1.  Go to your Supabase Dashboard.
2.  Navigate to the **SQL Editor**.
3.  Copy and paste the schema and seed data below to create users, assets, forms, and events.

<details>
<summary><strong>👇 Click here to view the SQL Seed Script</strong></summary>

```sql
-- 1. Users (every user has password "password". Use bycrypt.js to generate a hash for a different password)
INSERT INTO users (user_id, email, password_hash, first_name, last_name, role, job_title, department) VALUES
(1, 'admin@drdo.gov.in', '$2b$10$pqVbOXDc4C3z7QtRbVMmc.PiulNIUs4R2ZEenqMOZkCTFgAX8YNCK', 'Admin', 'User', 'admin', 'System Administrator', 'IT Department'),
(2, 'john.doe@drdo.gov.in', '$2b$10$pqVbOXDc4C3z7QtRbVMmc.PiulNIUs4R2ZEenqMOZkCTFgAX8YNCK', 'John', 'Doe', 'employee', 'Senior Scientist', 'Research & Development'),
(3, 'priya.sharma@drdo.gov.in', '$2b$10$pqVbOXDc4C3z7QtRbVMmc.PiulNIUs4R2ZEenqMOZkCTFgAX8YNCK', 'Priya', 'Sharma', 'employee', 'Research Engineer', 'Electronics Division'),
(4, 'amit.kumar@drdo.gov.in', '$2b$10$pqVbOXDc4C3z7QtRbVMmc.PiulNIUs4R2ZEenqMOZkCTFgAX8YNCK', 'Amit', 'Kumar', 'employee', 'Project Lead', 'Defence Systems'),
(5, 'sneha.patel@drdo.gov.in', '$2b$10$pqVbOXDc4C3z7QtRbVMmc.PiulNIUs4R2ZEenqMOZkCTFgAX8YNCK', 'Sneha', 'Patel', 'employee', 'Software Developer', 'IT Department');

-- 2. Forms Configuration
INSERT INTO forms (form_id, title, description, category, version, last_updated, search_tags, badge_text, badge_color, component_name) VALUES
(1, 'Annual Leave Request', 'Request for annual/earned leave', 'Leave Management', '1.0', '2025-12-01', 'leave vacation time-off annual', 'Popular', 'green', 'AnnualLeaveRequest'),
(2, 'IT Support Request', 'Submit IT support tickets and issues', 'IT Services', '2.1', '2025-11-15', 'IT support help desk technical', 'New', 'blue', 'ITSupportRequestForm'),
(3, 'Travel Reimbursement', 'Claim travel expenses and reimbursements', 'Finance', '1.5', '2025-10-20', 'travel expense reimbursement claim', NULL, NULL, 'TravelReimbursementForm'),
(4, 'Equipment Request', 'Request new office equipment or supplies', 'Procurement', '1.0', '2025-09-10', 'equipment supplies office', NULL, NULL, NULL),
(5, 'Training Request', 'Apply for training programs and workshops', 'HR', '1.2', '2025-11-01', 'training learning development workshop', 'Updated', 'orange', NULL);

-- 3. IT Assets Inventory
INSERT INTO it_assets (asset_id, asset_name, asset_type, license_key, purchase_date, expiry_date, status) VALUES
(1, 'Dell Latitude 5520', 'Laptop', NULL, '2024-01-15', NULL, 'Allocated'),
(2, 'Dell Latitude 5520', 'Laptop', NULL, '2024-01-15', NULL, 'Available'),
(3, 'HP LaserJet Pro M404dn', 'Printer', NULL, '2023-06-20', NULL, 'Allocated'),
(4, 'Microsoft Office 365', 'Software License', 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX', '2025-01-01', '2026-01-01', 'Allocated'),
(5, 'Adobe Creative Cloud', 'Software License', 'YYYYY-YYYYY-YYYYY-YYYYY-YYYYY', '2025-03-01', '2026-03-01', 'Available'),
(6, 'Cisco IP Phone 8845', 'Phone', NULL, '2023-09-10', NULL, 'Allocated'),
(7, 'Dell UltraSharp U2722D', 'Monitor', NULL, '2024-02-20', NULL, 'Available'),
(8, 'Logitech MX Keys', 'Keyboard', NULL, '2024-05-15', NULL, 'Available');

-- 4. Projects
INSERT INTO projects (project_name, description, status) VALUES
('Project Agni', 'Development of advanced ballistic missile systems', 'Active'),
('Project Akash', 'Surface-to-air missile defense system development', 'Active'),
('Autonomous Vehicle Research', 'Research on autonomous navigation systems for defence vehicles', 'In Progress'),
('Cyber Security Initiative', 'Development of advanced cyber security frameworks', 'Active'),
('Radar Systems Upgrade', 'Modernization of existing radar infrastructure', 'Completed');

-- 5. Events
INSERT INTO events (day, month, title, description, event_date) VALUES
('15', 'Feb', 'Annual Science Day', 'Celebration of National Science Day with exhibitions and lectures', '2026-02-15'),
('26', 'Jan', 'Republic Day Celebration', 'Annual Republic Day celebration at DRDO headquarters', '2026-01-26'),
('10', 'Mar', 'Tech Innovation Summit', 'Annual technology innovation summit showcasing new developments', '2026-03-10'),
('05', 'Apr', 'Cybersecurity Workshop', 'Workshop on latest cybersecurity threats and countermeasures', '2026-04-05'),
('20', 'Feb', 'Research Paper Presentation', 'Internal research paper presentation by scientists', '2026-02-20');

-- 6. Publications
INSERT INTO publications (type, title, meta, description, pdf_link) VALUES
('Research Paper', 'Advances in Radar Signal Processing', 'Dr. A. Kumar et al. | 2025', 'A comprehensive study on modern radar signal processing techniques and their applications in defence systems.', '/publications/radar-signal-processing.pdf'),
('Technical Report', 'Autonomous Systems Integration Framework', 'Defence Research Team | 2025', 'Framework for integrating autonomous systems in military applications.', '/publications/autonomous-framework.pdf'),
('Journal Article', 'Machine Learning in Defence Applications', 'Dr. P. Sharma | 2024', 'Survey of machine learning techniques applicable to defence sector.', '/publications/ml-defence.pdf'),
('White Paper', 'Cybersecurity Best Practices', 'IT Security Division | 2025', 'Guidelines and best practices for maintaining cybersecurity in defence organizations.', '/publications/cybersecurity-guide.pdf');

-- 7. Announcements
INSERT INTO announcements (date, title, description) VALUES
('January 30, 2026', 'System Maintenance Notice', 'The ESS Portal will undergo scheduled maintenance on February 1st from 10 PM to 2 AM.'),
('January 25, 2026', 'New Leave Policy Update', 'Please review the updated leave policy effective from February 1, 2026.'),
('January 20, 2026', 'IT Security Training', 'Mandatory IT security awareness training scheduled for all employees next week.'),
('January 15, 2026', 'Annual Performance Review', 'Annual performance review cycle begins on February 1st. Please update your goals.');

-- 8. Key Moments
INSERT INTO key_moments (image_url, alt_text) VALUES
('1.jpg', 'Scientists working in laboratory'),
('2.jpg', 'Defence technology exhibition'),
('3.png', 'Research team meeting');

-- 9. Asset Allocations
INSERT INTO asset_allocations (asset_id, user_id, assigned_date, returned_date, is_active) VALUES
(1, 2, '2024-01-20', NULL, true),
(3, 3, '2023-07-01', NULL, true),
(4, 2, '2025-01-05', NULL, true),
(4, 4, '2025-01-05', NULL, true),
(6, 4, '2023-09-15', NULL, true);

-- 10. Grievances
INSERT INTO grievances (user_id, grievance_subject, grievance_details, status, submitted_at) VALUES
(2, 'Office AC Not Working', 'The air conditioning unit in Room 204 has not been functioning properly for the past week.', 'submitted', '2026-01-28 10:30:00+05:30'),
(3, 'Parking Space Issue', 'Requested parking space has been allocated to another employee without prior notice.', 'in_progress', '2026-01-25 14:15:00+05:30'),
(4, 'Software License Delay', 'Waiting for Adobe Creative Cloud license for over 3 weeks now.', 'resolved', '2026-01-15 09:00:00+05:30');

-- 11. Form Submissions
INSERT INTO form_submissions (form_id, user_id, status, submission_data, submitted_at) VALUES
(1, 2, 'approved', '{"leave_type": "Annual Leave", "start_date": "2026-02-10", "end_date": "2026-02-14", "reason": "Family vacation", "days": 5}', '2026-01-20 11:00:00+05:30'),
(2, 3, 'submitted', '{"issue_type": "Hardware", "description": "Laptop keyboard not working", "priority": "Medium"}', '2026-01-28 15:30:00+05:30'),
(3, 4, 'pending', '{"trip_date": "2026-01-10", "destination": "Mumbai", "purpose": "Conference", "amount": 15000}', '2026-01-25 10:00:00+05:30');
```

