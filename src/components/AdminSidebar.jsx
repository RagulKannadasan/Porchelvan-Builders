import React from 'react';
import './AdminSidebar.css';

const AdminSidebar = ({ onSelect }) => {
  return (
    <div className="admin-sidebar">
      <ul>
        <li onClick={() => onSelect('users')}>Users</li>
        <li onClick={() => onSelect('projects')}>Projects</li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
