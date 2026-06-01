import React, { useState, useEffect } from 'react';
import { DollarSign, Search, Filter, ArrowUpRight, ArrowDownRight, TrendingUp, Calendar, CreditCard, ChevronRight, FileText } from 'lucide-react';
import API_BASE_URL from '../../utils/api';

const Transactions = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState('All');
  const [selectedType, setSelectedType] = useState('All'); // All, Inflow, Outflow
  const [selectedStatus, setSelectedStatus] = useState('All'); // All, Paid, Unpaid (only for invoices)

  // Details Modal
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedProject, selectedType, selectedStatus, allTransactions]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch all projects
      const projRes = await fetch(`${API_BASE_URL}/api/projects`);
      if (!projRes.ok) throw new Error("Failed to fetch projects");
      const projList = await projRes.json();
      setProjects(projList);

      // 2. Fetch budget (expenses & invoices) for every project concurrently
      const transactionPromises = projList.map(async (project) => {
        try {
          const budgetRes = await fetch(`${API_BASE_URL}/api/projects/${project._id}/budget`);
          if (budgetRes.ok) {
            const { expenses, invoices } = await budgetRes.json();
            
            // Format expenses (outflow)
            const formattedExpenses = (expenses || []).map(exp => ({
              id: exp._id,
              date: exp.date,
              description: exp.description || 'Business Expense',
              category: exp.category || 'Materials',
              amount: exp.amount || 0,
              type: 'Outflow', // Expense
              projectTitle: project.title,
              projectId: project._id,
              status: 'Completed',
              raw: exp
            }));

            // Format invoices (inflow)
            const formattedInvoices = (invoices || []).map(inv => ({
              id: inv._id,
              date: inv.date,
              description: inv.description || 'Client Invoice',
              category: 'Client Payment',
              amount: inv.amount || 0,
              type: 'Inflow', // Income
              projectTitle: project.title,
              projectId: project._id,
              status: inv.status || 'Unpaid',
              raw: inv
            }));

            return [...formattedExpenses, ...formattedInvoices];
          }
          return [];
        } catch (e) {
          console.error(`Failed to fetch budget for project ${project.title}:`, e);
          return [];
        }
      });

      const results = await Promise.all(transactionPromises);
      const consolidated = results.flat().sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setAllTransactions(consolidated);
    } catch (err) {
      console.error("Error consolidating transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let temp = [...allTransactions];

    // 1. Text Search
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      temp = temp.filter(t => 
        t.description.toLowerCase().includes(lower) || 
        t.category.toLowerCase().includes(lower) ||
        t.projectTitle.toLowerCase().includes(lower) ||
        t.amount.toString().includes(lower)
      );
    }

    // 2. Project Filter
    if (selectedProject !== 'All') {
      temp = temp.filter(t => t.projectId === selectedProject);
    }

    // 3. Type Filter
    if (selectedType !== 'All') {
      temp = temp.filter(t => t.type === selectedType);
    }

    // 4. Status Filter
    if (selectedStatus !== 'All') {
      temp = temp.filter(t => t.status === selectedStatus);
    }

    setFilteredTransactions(temp);
  };

  // Metric Computations
  const totalInflow = allTransactions
    .filter(t => t.type === 'Inflow')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalOutflow = allTransactions
    .filter(t => t.type === 'Outflow')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netCashflow = totalInflow - totalOutflow;

  const getStatusBadge = (t) => {
    if (t.type === 'Outflow') {
      return <span className="status-pill status-completed">Completed</span>;
    }
    return t.status === 'Paid' 
      ? <span className="status-pill status-paid">Paid</span>
      : <span className="status-pill status-unpaid">Unpaid</span>;
  };

  return (
    <div className="transactions-page">
      {/* Header Segment */}
      <div className="transactions-header">
        <div>
          <h1>Financial Ledger & Transactions</h1>
          <p className="text-muted">Consolidated audit log of all project invoices and operating expenses across Porchelvan Builders.</p>
        </div>
        <button className="btn btn-outline" onClick={fetchData} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh Ledger'}
        </button>
      </div>

      {/* Loading Overlay */}
      {loading ? (
        <div className="admin-loading-state" style={{ height: '350px' }}>
          <div className="admin-spinner"></div>
          <h3 style={{ margin: '0' }}>Consolidating Financial Ledger...</h3>
          <p className="text-muted" style={{ margin: '0' }}>Fetching cashflow statements from all ongoing construction sites.</p>
        </div>
      ) : (
        <>
          {/* Visual Financial Summary Cards */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon inflow-icon">
                <ArrowUpRight size={24} />
              </div>
              <div className="metric-info">
                <p className="text-muted">Total Revenue (Inflow)</p>
                <h2>₹{totalInflow.toLocaleString()}</h2>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon outflow-icon">
                <ArrowDownRight size={24} />
              </div>
              <div className="metric-info">
                <p className="text-muted">Operating Costs (Outflow)</p>
                <h2>₹{totalOutflow.toLocaleString()}</h2>
              </div>
            </div>

            <div className="metric-card net-card">
              <div className="metric-icon net-icon" style={{ 
                backgroundColor: netCashflow >= 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                color: netCashflow >= 0 ? '#22c55e' : '#ef4444'
              }}>
                <TrendingUp size={24} style={{ transform: netCashflow < 0 ? 'rotate(90deg)' : 'none' }} />
              </div>
              <div className="metric-info">
                <p className="text-muted">Net Cash Position</p>
                <h2 style={{ color: netCashflow >= 0 ? '#22c55e' : '#ef4444' }}>
                  {netCashflow < 0 ? '-' : ''}₹{Math.abs(netCashflow).toLocaleString()}
                </h2>
              </div>
            </div>
          </div>

          {/* Filtering Section Card */}
          <div className="card filters-card" style={{ marginBottom: '2rem' }}>
            <div className="filters-grid">
              {/* Search */}
              <div className="filter-item">
                <label>Search Ledger</label>
                <div className="search-input-wrapper">
                  <Search size={18} className="search-icon" />
                  <input 
                    type="text" 
                    placeholder="Search by description, category..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} 
                  />
                </div>
              </div>

              {/* Project filter */}
              <div className="filter-item">
                <label>Construction Site</label>
                <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
                  <option value="All">All Projects</option>
                  {projects.map(p => (
                    <option key={p._id} value={p._id}>{p.title}</option>
                  ))}
                </select>
              </div>

              {/* Type Filter */}
              <div className="filter-item">
                <label>Transaction Type</label>
                <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                  <option value="All">All Types</option>
                  <option value="Inflow">Inflow (Invoices)</option>
                  <option value="Outflow">Outflow (Expenses)</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="filter-item">
                <label>Invoice Status</label>
                <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                  <option value="All">All Statuses</option>
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
              </div>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="card ledger-card">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Consolidated Ledger ({filteredTransactions.length} items)</h3>
              <span className="text-muted" style={{ fontSize: '0.85rem' }}>Ordered chronologically</span>
            </div>

            <div className="ledger-table-container">
              {filteredTransactions.length === 0 ? (
                <div className="empty-ledger-state">
                  <CreditCard size={40} style={{ color: 'var(--admin-text-muted)', marginBottom: '1rem' }} />
                  <h4>No Transactions Found</h4>
                  <p className="text-muted">Adjust your filtering parameters or select a different project.</p>
                </div>
              ) : (
                <table className="ledger-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Project Site</th>
                      <th>Description</th>
                      <th>Category / Status</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="ledger-row">
                        <td className="date-cell">
                          <Calendar size={14} className="calendar-icon" />
                          <span>{new Date(tx.date).toLocaleDateString()}</span>
                        </td>
                        <td className="project-cell">
                          <strong>{tx.projectTitle}</strong>
                        </td>
                        <td className="desc-cell">
                          {tx.description}
                        </td>
                        <td className="cat-cell">
                          <span className="category-tag">{tx.category}</span>
                          {getStatusBadge(tx)}
                        </td>
                        <td className="type-cell">
                          <span className={`type-badge ${tx.type === 'Inflow' ? 'badge-inflow' : 'badge-outflow'}`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="amount-cell">
                          <span className={tx.type === 'Inflow' ? 'text-inflow' : 'text-outflow'}>
                            {tx.type === 'Inflow' ? '+' : '-'} ₹{(tx.amount).toLocaleString()}
                          </span>
                        </td>
                        <td className="actions-cell">
                          <button className="btn btn-icon-sm" onClick={() => setSelectedTransaction(tx)}>
                            <ChevronRight size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}

      {/* Details View Modal */}
      {selectedTransaction && (
        <div className="modal-overlay" onClick={() => setSelectedTransaction(null)}>
          <div className="modal transaction-detail-modal animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Transaction Details</h2>
              <button className="btn-icon" onClick={() => setSelectedTransaction(null)}>&times;</button>
            </div>
            
            <div className="modal-body transaction-details-body">
              <div className="receipt-header">
                <div className={`receipt-icon ${selectedTransaction.type === 'Inflow' ? 'bg-inflow' : 'bg-outflow'}`}>
                  {selectedTransaction.type === 'Inflow' ? <ArrowUpRight size={28} /> : <ArrowDownRight size={28} />}
                </div>
                <h3>{selectedTransaction.type === 'Inflow' ? 'Revenue Invoice' : 'Debit Outflow'}</h3>
                <h1 className={selectedTransaction.type === 'Inflow' ? 'text-inflow font-bold' : 'text-outflow font-bold'} style={{ margin: '0.5rem 0' }}>
                  {selectedTransaction.type === 'Inflow' ? '+' : '-'} ₹{(selectedTransaction.amount).toLocaleString()}
                </h1>
                <span className="text-muted" style={{ fontSize: '0.8rem' }}>Transaction ID: {selectedTransaction.id}</span>
              </div>

              <div className="detail-rows-container">
                <div className="detail-row">
                  <span className="detail-label">Date Logged</span>
                  <span className="detail-value">{new Date(selectedTransaction.date).toLocaleString()}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Construction Site</span>
                  <span className="detail-value font-bold">{selectedTransaction.projectTitle}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Description / Stage</span>
                  <span className="detail-value">{selectedTransaction.description}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Classification</span>
                  <span className="detail-value">
                    <span className="category-tag">{selectedTransaction.category}</span>
                  </span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Ledger Type</span>
                  <span className="detail-value">
                    <span className={`type-badge ${selectedTransaction.type === 'Inflow' ? 'badge-inflow' : 'badge-outflow'}`}>
                      {selectedTransaction.type === 'Inflow' ? 'Income Credit' : 'Capital Expense'}
                    </span>
                  </span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Operation Status</span>
                  <span className="detail-value">
                    {getStatusBadge(selectedTransaction)}
                  </span>
                </div>
              </div>

              {selectedTransaction.type === 'Outflow' && (
                <div className="receipt-attachment-pane">
                  <FileText size={20} className="receipt-doc-icon" />
                  <div>
                    <span className="font-bold" style={{ fontSize: '0.85rem', display: 'block' }}>Receipt Attachment</span>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                      {selectedTransaction.raw.receiptUrl ? selectedTransaction.raw.receiptUrl : 'No receipt image uploaded.'}
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => setSelectedTransaction(null)}>
                Close Ledger Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styled Component CSS Sheet */}
      <style>{`
        .transactions-page {
          display: flex;
          flex-direction: column;
        }

        .transactions-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .transactions-header h1 {
          margin: 0 0 0.25rem 0;
        }

        .ledger-loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 350px;
          background-color: var(--admin-surface);
          border: 1px dashed var(--admin-border);
          border-radius: 12px;
          box-shadow: var(--card-shadow);
        }

        .spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Summary Cards Grid */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .metric-card {
          background-color: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          box-shadow: var(--card-shadow);
          transition: transform 0.2s ease;
        }

        .metric-card:hover {
          transform: translateY(-2px);
        }

        .metric-icon {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .inflow-icon {
          background-color: rgba(74, 20, 140, 0.1);
          color: var(--color-indigo, #4a148c);
        }
        
        .outflow-icon {
          background-color: rgba(241, 90, 36, 0.1);
          color: var(--brand-orange, #f97316);
        }

        .metric-info {
          display: flex;
          flex-direction: column;
        }

        .metric-info p {
          margin: 0 0 0.15rem 0;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .metric-info h2 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 800;
        }

        /* Filter Segment Layout */
        .filters-card {
          padding: 1.5rem;
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
        }

        .filter-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .filter-item label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--admin-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          color: var(--admin-text-muted);
        }

        .search-input-wrapper input {
          width: 100%;
          padding: 0.55rem 0.55rem 0.55rem 2.25rem;
          border: 1px solid var(--admin-border);
          border-radius: 8px;
          background-color: var(--admin-bg);
          color: var(--admin-text);
          font-size: 0.85rem;
          transition: all 0.2s ease;
        }

        .search-input-wrapper input:focus {
          border-color: var(--brand-orange);
          outline: none;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }

        .filter-item select {
          padding: 0.55rem;
          border: 1px solid var(--admin-border);
          border-radius: 8px;
          background-color: var(--admin-bg);
          color: var(--admin-text);
          font-size: 0.85rem;
          transition: border-color 0.2s;
          cursor: pointer;
        }

        .filter-item select:focus {
          border-color: var(--brand-orange);
          outline: none;
        }

        /* Ledger Table Segment */
        .ledger-card {
          box-shadow: var(--card-shadow);
          overflow: hidden;
        }

        .ledger-table-container {
          overflow-x: auto;
          width: 100%;
        }

        .empty-ledger-state {
          padding: 4rem 2rem;
          text-align: center;
          color: var(--admin-text-muted);
        }

        .ledger-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .ledger-table th {
          background-color: var(--admin-hover);
          color: var(--admin-text-muted);
          font-weight: 700;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--admin-border);
        }

        .ledger-table td {
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--admin-border);
          font-size: 0.85rem;
        }

        .ledger-row {
          transition: background-color 0.15s ease;
        }

        .ledger-row:hover {
          background-color: var(--admin-hover);
        }

        .date-cell {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--admin-text-muted);
        }

        .calendar-icon {
          flex-shrink: 0;
        }

        .category-tag {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.15rem 0.5rem;
          background-color: var(--admin-bg);
          border: 1px solid var(--admin-border);
          border-radius: 4px;
          margin-right: 0.5rem;
          display: inline-block;
        }

        /* Badges styling */
        .type-badge {
          font-size: 0.7rem;
          font-weight: 800;
          padding: 0.2rem 0.55rem;
          border-radius: 4px;
          letter-spacing: 0.3px;
          text-transform: uppercase;
          display: inline-block;
        }

        .badge-inflow {
          background-color: rgba(74, 20, 140, 0.08);
          color: var(--color-indigo, #4a148c);
          border: 1px solid rgba(74, 20, 140, 0.12);
        }

        .badge-outflow {
          background-color: rgba(241, 90, 36, 0.08);
          color: var(--brand-orange, #f97316);
          border: 1px solid rgba(241, 90, 36, 0.12);
        }

        /* Status Pills styling */
        .status-pill {
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.15rem 0.45rem;
          border-radius: 50px;
          display: inline-block;
        }

        .status-completed {
          background-color: rgba(100, 116, 139, 0.1);
          color: #64748b;
        }

        .status-paid {
          background-color: rgba(34, 197, 94, 0.1);
          color: #22c55e;
        }

        .status-unpaid {
          background-color: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        /* Amounts Colors */
        .text-inflow {
          color: var(--color-indigo, #4a148c);
          font-weight: 700;
        }

        .text-outflow {
          color: var(--brand-orange, #f97316);
          font-weight: 700;
        }

        .btn-icon-sm {
          background: none;
          border: none;
          color: var(--admin-text-muted);
          padding: 0.25rem;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
        }

        .btn-icon-sm:hover {
          background-color: var(--admin-border);
          color: var(--admin-text);
        }

        /* Details View Modal */
        .transaction-detail-modal {
          max-width: 480px;
          padding: 1.75rem;
        }

        .receipt-header {
          text-align: center;
          padding: 1.5rem 0;
          border-bottom: 1px solid var(--admin-border);
          margin-bottom: 1.5rem;
        }

        .receipt-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem auto;
        }

        .bg-inflow {
          background-color: rgba(74, 20, 140, 0.1);
          color: var(--color-indigo, #4a148c);
        }

        .bg-outflow {
          background-color: rgba(241, 90, 36, 0.1);
          color: var(--brand-orange, #f97316);
        }

        .receipt-header h3 {
          margin: 0;
          font-size: 0.95rem;
          color: var(--admin-text-muted);
          font-weight: 600;
        }

        .detail-rows-container {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          margin-bottom: 1.5rem;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
        }

        .detail-label {
          color: var(--admin-text-muted);
          font-weight: 500;
        }

        .detail-value {
          color: var(--admin-text);
          font-weight: 600;
          text-align: right;
        }

        .receipt-attachment-pane {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background-color: var(--admin-bg);
          border: 1px solid var(--admin-border);
          border-radius: 8px;
          padding: 0.75rem 1rem;
        }

        .receipt-doc-icon {
          color: var(--brand-orange);
          flex-shrink: 0;
        }

        @media (max-width: 992px) {
          .metrics-grid {
            grid-template-columns: 1fr;
          }
          .filters-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Transactions;
