import React from 'react';
import { Routes, Route } from 'react-router-dom';


import ProtectedLayout from './components/ProtectedLayout';
import AdminRoute from './components/AdminRoute';


import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import AboutUsPage from './pages/AboutUsPage';
import ResearchAreasPage from './pages/ResearchAreasPage';
import PublicationsPage from './pages/PublicationsPage';
import UpcomingEventsPage from './pages/UpcomingEventsPage';
import ContactUsPage from './pages/ContactUsPage';
import ServicesPage from './pages/ServicesPage';
import FormsPage from './pages/FormsPage';
import FormDisplayPage from './pages/FormDisplayPage';
import AssetsPage from './pages/AssetsPage';
import GrievancePage from './pages/GrievancePage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import UserManagementPage from './pages/UserManagementPage';
import AssetManagementPage from './pages/AssetManagementPage';
import AdminGrievancesPage from './pages/AdminGrievancesPage';
import AdminSubmissionsPage from './pages/AdminSubmissionsPage';

function App() {
  return (
    <Routes>
      {/* public */}
      <Route path="/login" element={<LoginPage />} />

      {/* logged in */}
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/research" element={<ResearchAreasPage />} />
        <Route path="/publications" element={<PublicationsPage />} />
        <Route path="/events" element={<UpcomingEventsPage />} />
        <Route path="/contact" element={<ContactUsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/forms" element={<FormsPage />} />
        <Route path="/forms/:formId" element={<FormDisplayPage />} />
        <Route path="/assets" element={<AssetsPage />} />
        <Route path="/grievance" element={<GrievancePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        
        {/* admin */}
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><UserManagementPage /></AdminRoute>} />
        <Route path="/admin/assets" element={<AdminRoute><AssetManagementPage /></AdminRoute>} />
        <Route path="/admin/grievances" element={<AdminRoute><AdminGrievancesPage /></AdminRoute>} />
        <Route path="/admin/submissions" element={<AdminRoute><AdminSubmissionsPage /></AdminRoute>} />
      </Route>
    </Routes>
  );
}

export default App;