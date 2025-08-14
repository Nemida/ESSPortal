# DRDO Employee Self-Service (ESS) Portal

A full-stack web application designed to centralize and digitize employee services. This portal provides a modern, user-friendly interface for employees and administrators to manage forms, IT assets, and grievances securely and efficiently.

## Features

  * **User Authentication**: Secure login/sign-up system with distinct roles for **Employees** and **Admins**.
  * **Dynamic Homepage**: A public-facing homepage featuring key moments, announcements, and an overview of the organization's activities.
  * **Employee Forms Portal**: A searchable library of official forms that are auto-filled with user-specific data from the database.
  * **IT Asset Management**: A system for admins to track software and hardware assets assigned to employees, including assignment history.
  * **Grievance Submission System**: A confidential portal for employees to submit grievances, which are routed to the appropriate managers.
  * **Admin Dashboard**: A centralized control panel for administrators to manage users, announcements, events, publications, and IT assets.
  * **RESTful API**: A complete backend API built with Node.js and Express to handle all data operations.

-----

## Tech Stack

**Frontend**:

  * React
  * Vite
  * Tailwind CSS
  * Axios

**Backend**:

  * Node.js
  * Express
  * PostgreSQL
  * JWT (for authentication)
  * BcryptJS (for password hashing)

-----

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

  * [Node.js](https://nodejs.org/) (v18 or later)
  * [PostgreSQL](https://www.postgresql.org/)
  * An IDE like [VS Code](https://code.visualstudio.com/)

### 1\. Backend Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/ess-portal.git
    cd ess-portal/server
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Set up the database**:
      * Create a PostgreSQL database named `ess_db`.
      * Run the queries from the `/server/schema.sql` file in your pgAdmin Query Tool to create all the necessary tables.
4.  **Configure environment variables**:
      * Create a file named `.env` in the `/server` directory.
      * Add the following, replacing `YOUR_PASSWORD` with your PostgreSQL password:
        ```env
        DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/ess_db
        JWT_SECRET=your-super-secret-key
        PORT=5000
        ```
5.  **Start the backend server**:
    ```bash
    npm run dev
    ```
    The server should now be running on `http://localhost:5000`.

### 2\. Frontend Setup

1.  **Open a new terminal** and navigate to the client directory:
    ```bash
    cd ../client
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Start the frontend server**:
    ```bash
    npm run dev
    ```
    The application will open in your browser, usually at `http://localhost:5173`.

-----

## Usage

1.  **Create Test Users**: To log in, you must first add users to the database. Use the following SQL command in pgAdmin to create an employee and an admin user. The password for both is `password`.
    ```sql
    INSERT INTO users (first_name, last_name, email, password_hash, role) VALUES
    ('Test', 'User', 'test@drdo.com', '$2a$10$wTf2v9fA4aD4iKNYI5CgIuB3G/T5eT4Gv4D3eR2fC6B1gY0hJ4uYm', 'employee'),
    ('Admin', 'User', 'admin@drdo.com', '$2a$10$wTf2v9fA4aD4iKNYI5CgIuB3G/T5eT4Gv4D3eR2fC6B1gY0hJ4uYm', 'admin');
    ```
2.  **Log In**: Navigate to the login page and use the credentials above to access the employee portal.

-----

## Comment

This is my first full-stack-style project. I know there’s room for improvement, but I’m proud of it.

Note: When setting up Vercel and Render in a monorepo configuration, set the project root in Vercel to the client folder. Ensure that environment variables are configured to dynamically select the appropriate database URL: use your local database (localhost) in development, and use Supabase/Render in production. Also, the hashing for passwords should be done using the hashGenerator.js in server directory.
-----

