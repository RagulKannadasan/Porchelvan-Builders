import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Projects from './pages/admin/Projects';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          {/* Add more admin routes here later */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
