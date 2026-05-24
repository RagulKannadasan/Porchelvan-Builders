import React, { useState, useEffect } from 'react';
import { Activity, Users, FileText, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    activeProjects: 0,
    totalWorkers: 0,
    pendingInvoices: 0,
    openIssues: 0
  });

  useEffect(() => {
    // In a real app, fetch from backend API
    // For now, mock data
    setStats({
      activeProjects: 4,
      totalWorkers: 124,
      pendingInvoices: 7,
      openIssues: 2
    });
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p className="text-muted">Welcome back. Here is what's happening across your projects today.</p>
      </div>

      <div className="stats-grid">
        <StatCard 
          title="Active Projects" 
          value={stats.activeProjects} 
          icon={<Activity size={24} />} 
        />
        <StatCard 
          title="Total Workers on Site" 
          value={stats.totalWorkers} 
          icon={<Users size={24} />} 
        />
        <StatCard 
          title="Pending Invoices" 
          value={stats.pendingInvoices} 
          icon={<FileText size={24} />} 
        />
        <StatCard 
          title="Open Issues" 
          value={stats.openIssues} 
          icon={<AlertTriangle size={24} />} 
        />
      </div>

      <div className="dashboard-content">
        <div className="card">
          <div className="card-header">
            <h3>Recent Site Diaries</h3>
          </div>
          <div className="card-body">
            <ul className="activity-list">
              <li>
                <div className="activity-dot"></div>
                <div className="activity-content">
                  <p><strong>Skyline Residences</strong> - Foundation concrete pouring completed.</p>
                  <span className="text-muted">Today, 10:30 AM • Weather: Sunny 75°F</span>
                </div>
              </li>
              <li>
                <div className="activity-dot"></div>
                <div className="activity-content">
                  <p><strong>Tech Hub Office</strong> - Steel beams delivery received.</p>
                  <span className="text-muted">Yesterday, 4:15 PM • Weather: Cloudy 68°F</span>
                </div>
              </li>
              <li>
                <div className="activity-dot"></div>
                <div className="activity-content">
                  <p><strong>Heritage Villa</strong> - Electrical wiring inspection passed.</p>
                  <span className="text-muted">Yesterday, 2:00 PM • Weather: Partly Cloudy 70°F</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Low Inventory Alerts</h3>
          </div>
          <div className="card-body">
            <div className="alert-item">
              <AlertTriangle size={16} />
              <span>Cement Bags (Type 1) - Only 40 left in Central Storage.</span>
            </div>
            <div className="alert-item">
              <AlertTriangle size={16} />
              <span>Steel Rebar (12mm) - Below 15% minimum threshold.</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-header {
          margin-bottom: 2.5rem;
        }

        .dashboard-header h1 {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
        }

        .text-muted {
          color: var(--admin-text-muted);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .stat-card {
          background-color: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: 8px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
        }

        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          color: var(--admin-text-muted);
        }

        .stat-header h3 {
          font-size: 0.9rem;
          font-weight: 600;
          margin: 0;
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 800;
          margin: 0;
        }

        .dashboard-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
        }

        .card {
          background-color: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: 8px;
        }

        .card-header {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--admin-border);
        }

        .card-header h3 {
          font-size: 1.1rem;
          margin: 0;
        }

        .card-body {
          padding: 1.5rem;
        }

        /* Activity List */
        .activity-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .activity-list li {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .activity-list li:last-child {
          margin-bottom: 0;
        }

        .activity-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: var(--admin-active-bg);
          margin-top: 5px;
          flex-shrink: 0;
        }

        .activity-content p {
          margin: 0 0 0.25rem 0;
          font-size: 0.95rem;
        }

        .activity-content span {
          font-size: 0.85rem;
        }

        /* Alerts */
        .alert-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 1rem;
          border: 1px solid var(--admin-border);
          border-radius: 6px;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .alert-item:last-child {
          margin-bottom: 0;
        }

        @media (max-width: 992px) {
          .dashboard-content {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="stat-card">
    <div className="stat-header">
      <h3>{title}</h3>
      {icon}
    </div>
    <p className="stat-value">{value}</p>
  </div>
);

export default Dashboard;
