import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, LayoutDashboard, HardHat, DollarSign, Users, Package, Calendar, Settings, Home, ShieldAlert, User, MessageSquare, CreditCard, LogOut, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../index.css';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Client Access', path: '/admin/client-access', icon: <UserCheck size={20} /> },
    { name: 'Projects & Diaries', path: '/admin/projects', icon: <HardHat size={20} /> },
    { name: 'Budget & Invoices', path: '/admin/budget', icon: <DollarSign size={20} /> },
    { name: 'Transactions Log', path: '/admin/transactions', icon: <CreditCard size={20} /> },
    { name: 'Crew & HR', path: '/admin/crew', icon: <Users size={20} /> },
    { name: 'Inventory', path: '/admin/inventory', icon: <Package size={20} /> },
    { name: 'Scheduling', path: '/admin/scheduling', icon: <Calendar size={20} /> },
    { name: 'Issues & Vault', path: '/admin/issues', icon: <ShieldAlert size={20} /> },
    { name: 'Client Messages', path: '/admin/messages', icon: <MessageSquare size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="admin-container">
      {/* Mobile Header with Hamburger */}
      <div className="admin-mobile-header">
        <button onClick={() => setSidebarOpen(true)} className="hamburger-btn">
          <Menu size={24} />
        </button>
        <div className="mobile-brand">
          <div className="logo-mark-sm">PB</div>
          <h2>Admin Portal</h2>
        </div>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div className="admin-sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-logo-section">
            <span className="logo-text" style={{ letterSpacing: '-0.3px' }}>Porchelvan Builders</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="close-btn-mobile">
            <X size={24} />
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="admin-nav">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <div className="nav-icon-wrapper">{item.icon}</div>
              <div className="nav-text-wrapper">
                <span className="nav-item-en">{item.name}</span>
              </div>
            </Link>
          ))}

          <div className="admin-nav-divider"></div>

          <Link to="/" className="admin-nav-item public-site-link">
            <div className="nav-icon-wrapper"><Home size={20} /></div>
            <div className="nav-text-wrapper">
              <span className="nav-item-en">Back to Public Site</span>
            </div>
          </Link>

          <button onClick={logout} className="admin-nav-item public-site-link" style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', padding: '0.65rem 1.25rem', marginTop: 'auto' }}>
            <div className="nav-icon-wrapper"><LogOut size={20} color="#ef4444" /></div>
            <div className="nav-text-wrapper">
              <span className="nav-item-en" style={{ color: '#ef4444', fontWeight: 600 }}>Log Out</span>
            </div>
          </button>
        </nav>


      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <div className="admin-content-wrapper animate-fade-in">
          <Outlet />
        </div>
      </main>

      <style>{`
        /* 
          PREMIUM ADMIN PORTAL DESIGN SYSTEM
          Inspired by Modern Dashboard Color Science & Layouts
        */
        :root {
          --admin-bg: #F8FAFC;         
          --admin-surface: #FFFFFF;    
          --admin-border: #E2E8F0;     
          --admin-text: #0F172A;       
          --admin-text-muted: #64748B; 
          --admin-hover: #F1F5F9;      
          --brand-orange: #F97316;     
          --brand-orange-light: rgba(249,115,22,0.1);
          --gradient-brand: var(--brand-orange);
          --card-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.04), 0 2px 8px -1px rgba(15, 23, 42, 0.02);
        }

        [data-theme='dark'] {
          --admin-bg: #000000;         
          --admin-surface: #111111;    
          --admin-border: #1A1A1A;     
          --admin-text: #E2E8F0;       
          --admin-text-muted: rgba(226,232,240,0.5); 
          --admin-hover: #161616;      
          --brand-orange-light: rgba(249,115,22,0.15);
          --card-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.3);
        }

        .admin-container {
          display: flex;
          height: 100vh;
          background-color: var(--admin-bg);
          color: var(--admin-text);
          font-family: 'Inter', sans-serif;
          overflow: hidden;
          transition: background-color 0.3s, color 0.3s;
        }

        /* Mobile Header */
        .admin-mobile-header {
          display: none;
          align-items: center;
          padding: 0.75rem 1.5rem;
          background-color: var(--admin-surface);
          border-bottom: 1px solid var(--admin-border);
          z-index: 40;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .mobile-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-left: 0.5rem;
        }

        .logo-mark-sm {
          background: var(--brand-orange);
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.9rem;
        }

        .admin-mobile-header h2 {
          font-size: 1.1rem;
          font-weight: 800;
          margin: 0;
          letter-spacing: -0.3px;
        }

        .hamburger-btn {
          background: none;
          border: none;
          color: var(--admin-text);
          cursor: pointer;
          display: flex;
          padding: 0.5rem;
          margin-left: -0.5rem;
        }

        /* Sidebar */
        .admin-sidebar {
          width: 280px;
          background-color: var(--admin-surface);
          border-right: 1px solid var(--admin-border);
          display: flex;
          flex-direction: column;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 50;
        }

        .admin-sidebar-header {
          height: 76px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.5rem;
          border-bottom: 1px solid var(--admin-border);
        }

        .admin-logo-section {
          display: flex;
          align-items: center;
        }

        .logo-text {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--admin-text);
          line-height: 1.2;
        }

        .close-btn-mobile {
          display: none;
          background: none;
          border: none;
          color: var(--admin-text);
          cursor: pointer;
          padding: 0.5rem;
        }

        /* Profile Section */
        .admin-profile-section {
          padding: 1.25rem 1.25rem 0.5rem 1.25rem;
          border-bottom: 1px solid var(--admin-border);
        }

        .admin-profile-card {
          background-color: var(--admin-bg);
          border: 1px solid var(--admin-border);
          border-radius: 12px;
          padding: 1rem;
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.02);
        }

        .profile-header-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .profile-avatar {
          width: 44px;
          height: 44px;
          background: var(--brand-orange);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.95rem;
          box-shadow: 0 4px 8px rgba(249, 115, 22, 0.15);
        }

        .profile-text-info {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 0;
        }

        .profile-text-info h4 {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--admin-text);
          margin: 0 0 0.15rem 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .profile-email {
          font-size: 0.7rem;
          color: var(--admin-text-muted);
          margin-bottom: 0.4rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .profile-role-badge {
          align-self: flex-start;
          font-size: 0.65rem;
          font-weight: 800;
          background-color: var(--brand-orange-light);
          color: var(--brand-orange);
          padding: 0.15rem 0.5rem;
          border-radius: 50px;
          letter-spacing: 0.5px;
          border: 1px solid rgba(249, 115, 22, 0.15);
        }

        /* Navigation Links */
        .admin-nav {
          padding: 1.25rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          flex: 1;
          overflow-y: auto;
        }

        .admin-nav-item {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.65rem 1.25rem;
          border-radius: 50px;
          color: var(--admin-text-muted);
          text-decoration: none;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .nav-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background-color: transparent;
          transition: all 0.25s ease;
          flex-shrink: 0;
        }

        .nav-text-wrapper {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .nav-item-en {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--admin-text-muted);
          transition: color 0.25s ease;
        }

        /* Hover States */
        .admin-nav-item:hover {
          background-color: var(--admin-hover);
        }
        
        .admin-nav-item:hover .nav-item-en {
          color: var(--admin-text);
        }

        /* Active Selection */
        .admin-nav-item.active {
          background-color: var(--brand-orange);
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.15);
        }

        .admin-nav-item.active .nav-icon-wrapper {
          color: white;
        }

        .admin-nav-item.active .nav-item-en {
          color: white;
          font-weight: 700;
        }

        /* Left Accent Removed for Pill Style */

        .admin-nav-divider {
          height: 1px;
          background-color: var(--admin-border);
          margin: 0.75rem 0.5rem;
        }

        .public-site-link:hover {
          background-color: rgba(249, 115, 22, 0.08);
        }
        .public-site-link:hover .nav-item-en {
          color: var(--brand-orange);
        }
        .public-site-link:hover .nav-icon-wrapper {
          color: var(--brand-orange);
        }



        /* Main Content */
        .admin-main {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        .admin-content-wrapper {
          padding: 2rem 2.5rem;
          max-width: 1280px;
          width: 100%;
          margin: 0 auto;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .admin-container {
            flex-direction: column;
          }
          
          .admin-mobile-header {
            display: flex;
            flex-shrink: 0;
          }

          .admin-sidebar {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            transform: translateX(-100%);
            box-shadow: 0 0 25px rgba(0,0,0,0.15);
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
            background-color: rgba(9, 13, 26, 0.6);
            backdrop-filter: blur(4px);
            z-index: 40;
          }

          .admin-main {
            margin-top: 0;
          }
          
          .admin-content-wrapper {
            padding: 1.5rem 1rem;
          }
        }

        /* Shared Loading State */
        .admin-loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 350px;
          color: var(--admin-text-muted);
          gap: 1.25rem;
          animation: fadeIn 0.4s ease-out;
        }

        .admin-spinner {
          width: 42px;
          height: 42px;
          border: 3px solid var(--admin-border);
          border-top-color: var(--brand-orange);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .btn-spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.4);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          vertical-align: middle;
          margin-right: 0.5rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
