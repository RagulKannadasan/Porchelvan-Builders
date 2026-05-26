import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import GalleryPage from './pages/GalleryPage';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
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
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
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
  );
}

export default App;
