import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import ClientDashboard from './pages/client/Dashboard';
import LandingPage from './pages/LandingPage';
import GalleryPage from './pages/GalleryPage';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ClientAccess from './pages/admin/ClientAccess';
import Projects from './pages/admin/Projects';
import Budget from './pages/admin/Budget';
import Crew from './pages/admin/Crew';
import Inventory from './pages/admin/Inventory';
import Scheduling from './pages/admin/Scheduling';
import IssuesVault from './pages/admin/IssuesVault';
import Settings from './pages/admin/Settings';
import Messages from './pages/admin/Messages';
import Transactions from './pages/admin/Transactions';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/login" element={<Login />} />
          
          {/* Client Routes */}
          <Route 
            path="/client" 
            element={
              <ProtectedRoute allowedRoles={['Client']}>
                <ClientDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Site Manager']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="client-access" element={<ClientAccess />} />
            <Route path="projects" element={<Projects />} />
          <Route path="budget" element={<Budget />} />
          <Route path="crew" element={<Crew />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="scheduling" element={<Scheduling />} />
          <Route path="issues" element={<IssuesVault />} />
          <Route path="settings" element={<Settings />} />
          <Route path="messages" element={<Messages />} />
          <Route path="transactions" element={<Transactions />} />
          {/* Add more admin routes here later */}
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
