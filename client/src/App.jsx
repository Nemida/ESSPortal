import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts & Route Protection
import ProtectedLayout from './components/ProtectedLayout';

// All Pages
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import AboutUsPage from './pages/AboutUsPage';
import ResearchAreasPage from './pages/ResearchAreasPage';
import PublicationsPage from './pages/PublicationsPage';
import UpcomingEventsPage from './pages/UpcomingEventsPage';
import ContactUsPage from './pages/ContactUsPage';
import ServicesPage from './pages/ServicesPage';
import FormsPage from './pages/FormsPage';
import AssetsPage from './pages/AssetsPage';
import GrievancePage from './pages/GrievancePage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import UserManagementPage from './pages/UserManagementPage';
import AssetManagementPage from './pages/AssetManagementPage';
import AdminGrievancesPage from './pages/AdminGrievancesPage';

function App() {
  return (
    <Routes>

      <Route path="/login" element={<LoginPage />} />

      {/* logged in user*/}
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/research" element={<ResearchAreasPage />} />
        <Route path="/publications" element={<PublicationsPage />} />
        <Route path="/events" element={<UpcomingEventsPage />} />
        <Route path="/contact" element={<ContactUsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/forms" element={<FormsPage />} />
        <Route path="/assets" element={<AssetsPage />} />
        <Route path="/grievance" element={<GrievancePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        
        {/*admin*/}
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/users" element={<UserManagementPage />} />
        <Route path="/admin/assets" element={<AssetManagementPage />} />
        <Route path="/admin/grievances" element={<AdminGrievancesPage />} />
      </Route>
    </Routes>
  );
}

export default App;