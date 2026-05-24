import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, LayoutDashboard, HardHat, DollarSign, Users, Package, Calendar, Settings, Home, ShieldAlert } from 'lucide-react';
import '../index.css';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Projects & Diaries', path: '/admin/projects', icon: <HardHat size={20} /> },
    { name: 'Budget & Invoices', path: '/admin/budget', icon: <DollarSign size={20} /> },
    { name: 'Crew & HR', path: '/admin/crew', icon: <Users size={20} /> },
    { name: 'Inventory', path: '/admin/inventory', icon: <Package size={20} /> },
    { name: 'Scheduling', path: '/admin/scheduling', icon: <Calendar size={20} /> },
    { name: 'Issues & Vault', path: '/admin/issues', icon: <ShieldAlert size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="admin-container">
      {/* Mobile Header with Hamburger */}
      <div className="admin-mobile-header">
        <button onClick={() => setSidebarOpen(true)} className="hamburger-btn">
          <Menu size={24} />
        </button>
        <h2>Admin Portal</h2>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div className="admin-sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <h2>Internal System</h2>
          <button onClick={() => setSidebarOpen(false)} className="close-btn-mobile">
            <X size={24} />
          </button>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
          
          <div className="admin-nav-divider"></div>
          
          <Link to="/" className="admin-nav-item">
            <Home size={20} />
            <span>Back to Public Site</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <div className="admin-content-wrapper">
          <Outlet />
        </div>
      </main>

      <style>{`
        /* 
          Admin Portal Design incorporating Logo Brand Colors 
        */
        :root {
          --admin-bg: #f9f9f9;
          --admin-surface: #ffffff;
          --admin-border: #e0e0e0;
          --admin-text: #111111;
          --admin-text-muted: #666666;
          --admin-hover: #f1f1f1;
        }

        [data-theme='dark'] {
          --admin-bg: #0a0a0a;
          --admin-surface: #141414;
          --admin-border: #2a2a2a;
          --admin-text: #ffffff;
          --admin-text-muted: #a0a0a0;
          --admin-hover: #1f1f1f;
        }

        .admin-container {
          display: flex;
          height: 100vh;
          background-color: var(--admin-bg);
          color: var(--admin-text);
          font-family: 'Inter', sans-serif;
          overflow: hidden;
        }

        /* Mobile Header */
        .admin-mobile-header {
          display: none;
          align-items: center;
          padding: 1rem;
          background-color: var(--admin-surface);
          border-bottom: 1px solid var(--admin-border);
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 40;
        }

        .hamburger-btn {
          background: none;
          border: none;
          color: var(--admin-text);
          cursor: pointer;
          margin-right: 1rem;
          display: flex;
        }

        /* Sidebar */
        .admin-sidebar {
          width: 260px;
          background-color: var(--admin-surface);
          border-right: 1px solid var(--admin-border);
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease;
          z-index: 50;
        }

        .admin-sidebar-header {
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.5rem;
          border-bottom: 1px solid var(--admin-border);
        }

        .admin-sidebar-header h2 {
          font-size: 1.25rem;
          font-weight: 800;
          margin: 0;
          letter-spacing: -0.5px;
        }

        .close-btn-mobile {
          display: none;
          background: none;
          border: none;
          color: var(--admin-text);
          cursor: pointer;
        }

        .admin-nav {
          padding: 1.5rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          flex: 1;
          overflow-y: auto;
        }

        .admin-nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 6px;
          color: var(--admin-text-muted);
          text-decoration: none;
          font-weight: 500;
          font-size: 0.95rem;
          transition: all 0.2s ease;
        }

        .admin-nav-item:hover {
          background-color: var(--admin-hover);
          color: var(--admin-text);
        }

        .admin-nav-item.active {
          background: var(--gradient-brand);
          color: white;
          box-shadow: 0 4px 10px rgba(74, 20, 140, 0.2);
        }

        .admin-nav-divider {
          height: 1px;
          background-color: var(--admin-border);
          margin: 1rem 0;
        }

        /* Main Content */
        .admin-main {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        .admin-content-wrapper {
          padding: 2.5rem;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .admin-mobile-header {
            display: flex;
          }

          .admin-sidebar {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            transform: translateX(-100%);
          }

          .admin-sidebar.open {
            transform: translateX(0);
          }

          .close-btn-mobile {
            display: flex;
          }

          .admin-sidebar-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 40;
          }

          .admin-main {
            margin-top: 60px; /* Offset for mobile header */
          }
          
          .admin-content-wrapper {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
