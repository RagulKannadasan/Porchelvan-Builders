import React, { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminPanel from '../components/AdminPanel';
import Projects from '../components/Projects';
import './AdminPage.css';

const AdminPage = () => {
  const [selected, setSelected] = useState('users');

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
      <AdminSidebar onSelect={setSelected} />
      <div className="admin-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminPage;
