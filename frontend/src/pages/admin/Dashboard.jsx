import React, { useState, useEffect } from 'react';
import { Activity, Users, FileText, AlertTriangle, RefreshCw, Database, Layers, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    activeProjects: 0,
    totalWorkers: 0,
    pendingInvoices: 0,
    openIssues: 0
  });

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setStats({
      activeProjects: 4,
      totalWorkers: 124,
      pendingInvoices: 7,
      openIssues: 2
    });
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  return (
    <div className="minimal-dashboard animate-fade-in">
      
      {/* HEADER SECTION */}
      <header className="dashboard-header animate-fade-in-up">
        <div className="header-meta">
          <span className="meta-dot"></span>
          <span className="meta-text">SYSTEM MONITOR</span>
        </div>
        <div className="header-main">
          <h1>Overview</h1>
          <p className="subtitle">Real-time status of construction operations, crew resources, and storage metrics.</p>
        </div>
      </header>

      {/* STATS MATRIX */}
      <section className="stats-matrix animate-fade-in-up delay-100">
        <StatItem 
          label="Active Projects" 
          value={stats.activeProjects} 
          sub="On-schedule"
        />
        <StatItem 
          label="Crew Members" 
          value={stats.totalWorkers} 
          sub="On-site today"
        />
        <StatItem 
          label="Pending Invoices" 
          value={stats.pendingInvoices} 
          sub="Awaiting review"
        />
        <StatItem 
          label="Open Issues" 
          value={stats.openIssues} 
          sub="Requires attention"
          isAlert={stats.openIssues > 0}
        />
      </section>

      {/* DETAILED INSIGHTS */}
      <div className="dashboard-grid animate-fade-in-up delay-200">
        
        {/* Left Column */}
        <div className="grid-column">
          
          {/* Designation Mix Widget */}
          <div className="minimal-card">
            <div className="card-header">
              <h3>Designation Mix</h3>
              <span className="card-subtitle">Active crew classification</span>
            </div>
            <div className="card-body">
              <div className="mix-list">
                <MinimalProgressRow label="Supervisors" count={8} percentage={53} />
                <MinimalProgressRow label="Masons" count={76} percentage={76} />
                <MinimalProgressRow label="Laborers" count={40} percentage={40} />
              </div>
            </div>
          </div>

          {/* High Priority Logs Widget */}
          <div className="minimal-card">
            <div className="card-header">
              <h3>Recent Project Logs</h3>
              <span className="card-subtitle">Active site metrics</span>
            </div>
            <div className="card-body">
              <div className="log-list">
                <LogItem project="Skyline Residences" site="Vandalur" workers={28} status="Active" />
                <LogItem project="Tech Hub Office" site="OMR" workers={42} status="Active" />
                <LogItem project="Heritage Villa" site="ECR" workers={15} status="Stable" />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="grid-column">
          
          {/* Storage Optimization Widget */}
          <div className="minimal-card">
            <div className="card-header">
              <div className="header-with-action">
                <div>
                  <h3>Storage Status</h3>
                  <span className="card-subtitle">System database metric</span>
                </div>
                <button 
                  onClick={handleRefresh} 
                  className={`refresh-btn-minimal ${refreshing ? 'rotating' : ''}`}
                >
                  <RefreshCw size={14} />
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="storage-hero">
                <span className="storage-num">0.12 MB</span>
                <span className="storage-limit">of 512 MB utilized</span>
              </div>
              <div className="storage-bar-minimal">
                <div className="storage-bar-fill" style={{ width: '0.05%' }}></div>
              </div>
              <div className="storage-details">
                <StorageDetailItem label="Daily Logs" size="0.06 MB" />
                <StorageDetailItem label="Expense Receipts" size="0.04 MB" />
                <StorageDetailItem label="System Database" size="0.02 MB" />
              </div>
            </div>
          </div>

          {/* 7D Weekly Operations Graph */}
          <div className="minimal-card">
            <div className="card-header">
              <h3>7D Activity</h3>
              <span className="card-subtitle">Weekly log submissions</span>
            </div>
            <div className="card-body">
              <div className="weekly-chart">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
                  const heights = [60, 80, 45, 95, 70, 25, 10];
                  return (
                    <div key={idx} className="chart-col">
                      <div className="bar-track">
                        <div className="bar-fill" style={{ height: `${heights[idx]}%` }}></div>
                      </div>
                      <span className="day-label">{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

      </div>

      <style>{`
        /* 
          MINIMALIST MODERN UI DASHBOARD
          High-end typography, clean spacing, borderless card designs
        */
        .minimal-dashboard {
          display: flex;
          flex-direction: column;
          gap: 3rem;
          font-family: 'Inter', sans-serif;
          color: var(--admin-text);
        }

        /* Header styling */
        .dashboard-header {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .header-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .meta-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--brand-indigo);
        }

        .meta-text {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: var(--admin-text-muted);
          text-transform: uppercase;
        }

        .dashboard-header h1 {
          font-size: 2.25rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin: 0;
          color: var(--admin-text);
        }

        .subtitle {
          font-size: 0.95rem;
          color: var(--admin-text-muted);
          margin: 0.25rem 0 0 0;
          line-height: 1.5;
        }

        /* Stat items (Spacious, Minimal cardless style) */
        .stats-matrix {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          border-bottom: 1px solid var(--admin-border);
          padding-bottom: 2.5rem;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .stat-item-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--admin-text-muted);
          letter-spacing: -0.01em;
        }

        .stat-item-value {
          font-size: 2.75rem;
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.04em;
          color: var(--admin-text);
        }

        .stat-item-value.alert {
          color: var(--brand-orange);
        }

        .stat-item-sub {
          font-size: 0.75rem;
          color: var(--admin-text-muted);
          font-weight: 500;
        }

        /* Modern spacious grid */
        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
        }

        @media (max-width: 992px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }

        .grid-column {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        /* Premium Minimalist Cards */
        .minimal-card {
          background-color: var(--admin-surface);
          border-radius: 12px;
          border: 1px solid var(--admin-border);
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .card-header {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .card-header h3 {
          font-size: 1rem;
          font-weight: 700;
          color: var(--admin-text);
          margin: 0;
          letter-spacing: -0.02em;
        }

        .card-subtitle {
          font-size: 0.75rem;
          color: var(--admin-text-muted);
          font-weight: 500;
        }

        .header-with-action {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .refresh-btn-minimal {
          background: none;
          border: none;
          color: var(--admin-text-muted);
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s, color 0.2s;
        }

        .refresh-btn-minimal:hover {
          background-color: var(--admin-bg);
          color: var(--admin-text);
        }

        .refresh-btn-minimal.rotating svg {
          animation: spin 0.6s linear infinite;
        }

        /* Progress List (Designation Mix) */
        .mix-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .min-progress-row {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .min-progress-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .min-progress-lbl {
          color: var(--admin-text);
        }

        .min-progress-val {
          color: var(--admin-text-muted);
        }

        .min-progress-track {
          height: 4px;
          background-color: var(--admin-bg);
          border-radius: 50px;
          overflow: hidden;
        }

        .min-progress-fill {
          height: 100%;
          border-radius: 50px;
          background-color: var(--brand-indigo);
          transition: width 0.6s ease;
        }

        /* Clean Log Lists */
        .log-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .log-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--admin-border);
          padding-bottom: 1rem;
        }

        .log-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .log-info {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .log-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--admin-text);
        }

        .log-desc {
          font-size: 0.75rem;
          color: var(--admin-text-muted);
          font-weight: 500;
        }

        .log-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .log-tag {
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--admin-text-muted);
        }

        .log-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #10B981;
        }

        /* Storage Management Minimal Widget */
        .storage-hero {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
          margin-bottom: 0.25rem;
        }

        .storage-num {
          font-size: 2rem;
          font-weight: 800;
          color: var(--admin-text);
          letter-spacing: -0.02em;
        }

        .storage-limit {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--admin-text-muted);
        }

        .storage-bar-minimal {
          height: 6px;
          background-color: var(--admin-bg);
          border-radius: 50px;
          overflow: hidden;
        }

        .storage-bar-fill {
          height: 100%;
          background-color: var(--brand-orange);
          border-radius: 50px;
        }

        .storage-details {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .storage-detail-item {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          font-weight: 600;
          border-bottom: 1px solid var(--admin-bg);
          padding-bottom: 0.75rem;
        }

        .storage-detail-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .storage-dt-lbl {
          color: var(--admin-text);
        }

        .storage-dt-val {
          color: var(--admin-text-muted);
        }

        /* 7D Weekly Operations Graph Minimal */
        .weekly-chart {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          height: 120px;
          padding-top: 1rem;
        }

        .chart-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          width: 10%;
        }

        .bar-track {
          height: 90px;
          width: 4px;
          background-color: var(--admin-bg);
          border-radius: 50px;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
        }

        .bar-fill {
          width: 100%;
          border-radius: 50px;
          background-color: var(--brand-indigo);
          transition: height 0.5s ease;
        }

        .day-label {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--admin-text-muted);
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const StatItem = ({ label, value, sub, isAlert }) => (
  <div className="stat-item">
    <span className="stat-item-label">{label}</span>
    <span className={`stat-item-value ${isAlert ? 'alert' : ''}`}>{value}</span>
    <span className="stat-item-sub">{sub}</span>
  </div>
);

const MinimalProgressRow = ({ label, count, percentage }) => (
  <div className="min-progress-row">
    <div className="min-progress-meta">
      <span className="min-progress-lbl">{label}</span>
      <span className="min-progress-val">{count} members</span>
    </div>
    <div className="min-progress-track">
      <div className="min-progress-fill" style={{ width: `${percentage}%` }}></div>
    </div>
  </div>
);

const LogItem = ({ project, site, workers, status }) => (
  <div className="log-row">
    <div className="log-info">
      <span className="log-title">{project}</span>
      <span className="log-desc">{site} Location</span>
    </div>
    <div className="log-meta">
      <span className="log-tag">{workers} members</span>
      <span className="log-dot"></span>
    </div>
  </div>
);

const StorageDetailItem = ({ label, size }) => (
  <div className="storage-detail-item">
    <span className="storage-dt-lbl">{label}</span>
    <span className="storage-dt-val">{size}</span>
  </div>
);

export default Dashboard;
