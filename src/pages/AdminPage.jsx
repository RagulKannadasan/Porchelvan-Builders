import React, { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminPanel from '../components/AdminPanel';
import Projects from '../components/Projects';
import './AdminPage.css';

const AdminPage = () => {
  const [selected, setSelected] = useState('users');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (selected) {
      case 'users':
        return <AdminPanel />;
      case 'projects':
        return <Projects />;
      default:
        return <AdminPanel />;
    }
  };

  return (
    <div className="admin-page">
      <button className={`sidebar-toggle ${isSidebarOpen ? 'open' : ''}`} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </button>
      <AdminSidebar onSelect={setSelected} isOpen={isSidebarOpen} />
      <div className={`admin-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminPage;
