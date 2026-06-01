import React, { useState, useEffect } from 'react';
import { DollarSign, FileText, ArrowUpRight, ArrowDownRight, TrendingUp, Plus, X, Upload } from 'lucide-react';
import API_BASE_URL from '../../utils/api';

const Budget = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [budgetData, setBudgetData] = useState({ expenses: [], invoices: [] });
  const [isBudgetLoading, setIsBudgetLoading] = useState(false);
  const [isSubmittingExpense, setIsSubmittingExpense] = useState(false);
  const [isSubmittingInvoice, setIsSubmittingInvoice] = useState(false);
  
  // Modals
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // Forms
  const [newExpense, setNewExpense] = useState({ category: 'Materials', amount: '', description: '', receiptUrl: '' });
  const [newInvoice, setNewInvoice] = useState({ amount: '', description: '', status: 'Unpaid' });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/projects`);
      if (res.ok) setProjects(await res.json());
    } catch (err) {} finally {
      setIsLoading(false);
    }
  };

  const fetchBudgetData = async (projectId) => {
    setIsBudgetLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/projects/${projectId}/budget`);
      if (res.ok) {
        setBudgetData(await res.json());
      }
    } catch (err) {} finally {
      setIsBudgetLoading(false);
    }
  };

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    fetchBudgetData(project._id);
  };

  const handleCreateExpense = async (e) => {
    e.preventDefault();
    setIsSubmittingExpense(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/projects/${selectedProject._id}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExpense)
      });
      if (res.ok) {
        setIsExpenseModalOpen(false);
        setNewExpense({ category: 'Materials', amount: '', description: '', receiptUrl: '' });
        fetchBudgetData(selectedProject._id);
      }
    } catch (err) {} finally {
      setIsSubmittingExpense(false);
    }
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    setIsSubmittingInvoice(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/projects/${selectedProject._id}/invoices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInvoice)
      });
      if (res.ok) {
        setIsInvoiceModalOpen(false);
        setNewInvoice({ amount: '', description: '', status: 'Unpaid' });
        fetchBudgetData(selectedProject._id);
      }
    } catch (err) {} finally {
      setIsSubmittingInvoice(false);
    }
  };

  const handleToggleInvoiceStatus = async (invoice) => {
    const newStatus = invoice.status === 'Paid' ? 'Unpaid' : 'Paid';
    try {
      const res = await fetch(`${API_BASE_URL}/api/invoices/${invoice._id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchBudgetData(selectedProject._id);
      }
    } catch (err) {}
  };

  const totalExpenses = budgetData.expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalInvoices = budgetData.invoices.reduce((acc, curr) => acc + curr.amount, 0);
  const profit = totalInvoices - totalExpenses;
  const paidInvoices = budgetData.invoices.filter(i => i.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="admin-budget">
      <div className="budget-header">
        <div>
          <h1>Budget & Invoices</h1>
          <p className="text-muted">Track costs, expenses, and overall project profitability.</p>
        </div>
      </div>

      <div className="budget-layout">
        {/* Sidebar for Projects */}
        <div className="projects-sidebar card">
          <div className="card-header">
            <h3>Select Project</h3>
          </div>
          <div className="project-list">
            {isLoading ? (
              <div className="admin-loading-state" style={{ height: '200px' }}>
                <div className="admin-spinner" style={{ width: '30px', height: '30px' }}></div>
              </div>
            ) : projects.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>No projects</div>
            ) : (
              projects.map(p => (
              <div 
                key={p._id} 
                className={`project-item ${selectedProject?._id === p._id ? 'selected' : ''}`}
                onClick={() => handleSelectProject(p)}
              >
                <strong>{p.title}</strong>
              </div>
              ))
            )}
          </div>
        </div>

        {/* Main Budget Dashboard */}
        <div className="budget-dashboard">
          {selectedProject ? (
            <>
              {/* Summary Metrics */}
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-icon" style={{ backgroundColor: 'rgba(241, 90, 36, 0.1)', color: 'var(--color-orange)' }}>
                    <ArrowDownRight size={24} />
                  </div>
                  <div>
                    <p className="text-muted">Total Expenses</p>
                    <h2>₹{totalExpenses.toLocaleString()}</h2>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon" style={{ backgroundColor: 'rgba(74, 20, 140, 0.1)', color: 'var(--color-indigo)' }}>
                    <ArrowUpRight size={24} />
                  </div>
                  <div>
                    <p className="text-muted">Total Invoiced</p>
                    <h2>₹{totalInvoices.toLocaleString()}</h2>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon" style={{ backgroundColor: profit >= 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: profit >= 0 ? '#22c55e' : '#ef4444' }}>
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <p className="text-muted">Net Profit</p>
                    <h2 style={{ color: profit >= 0 ? '#22c55e' : '#ef4444' }}>₹{profit.toLocaleString()}</h2>
                  </div>
                </div>
              </div>

              <div className="budget-lists">
                {/* Expenses List */}
                <div className="card">
                  <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>Expenses</h3>
                    <button className="btn btn-outline btn-sm" onClick={() => setIsExpenseModalOpen(true)}>
                      <Plus size={16} /> Add Expense
                    </button>
                  </div>
                  <div className="list-body">
                    {isBudgetLoading ? (
                      <div className="admin-loading-state" style={{ height: '150px' }}>
                        <div className="admin-spinner" style={{ width: '30px', height: '30px' }}></div>
                      </div>
                    ) : budgetData.expenses.length === 0 ? <p className="text-muted text-center" style={{padding: '2rem'}}>No expenses logged.</p> : (
                      <table className="budget-table">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {budgetData.expenses.map(e => (
                            <tr key={e._id}>
                              <td>{new Date(e.date).toLocaleDateString()}</td>
                              <td><span className="badge-outline">{e.category}</span></td>
                              <td>{e.description}</td>
                              <td style={{ color: 'var(--color-orange)', fontWeight: 'bold' }}>- ₹{e.amount.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

                {/* Invoices List */}
                <div className="card">
                  <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>Invoices & Quotations</h3>
                    <button className="btn btn-primary btn-sm" onClick={() => setIsInvoiceModalOpen(true)}>
                      <FileText size={16} style={{marginRight: '0.25rem'}} /> Create Invoice
                    </button>
                  </div>
                  <div className="list-body">
                    {isBudgetLoading ? (
                      <div className="admin-loading-state" style={{ height: '150px' }}>
                        <div className="admin-spinner" style={{ width: '30px', height: '30px' }}></div>
                      </div>
                    ) : budgetData.invoices.length === 0 ? <p className="text-muted text-center" style={{padding: '2rem'}}>No invoices created.</p> : (
                      <table className="budget-table">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {budgetData.invoices.map(i => (
                            <tr key={i._id}>
                              <td>{new Date(i.date).toLocaleDateString()}</td>
                              <td>{i.description}</td>
                              <td>
                                <button 
                                  className={`status-btn ${i.status === 'Paid' ? 'paid' : 'unpaid'}`}
                                  onClick={() => handleToggleInvoiceStatus(i)}
                                >
                                  {i.status}
                                </button>
                              </td>
                              <td style={{ color: 'var(--color-indigo)', fontWeight: 'bold' }}>+ ₹{i.amount.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <DollarSign size={48} />
              <h3>Select a Project</h3>
              <p className="text-muted">Choose a project from the left to view its financials.</p>
            </div>
          )}
        </div>
      </div>

      {/* Expense Modal */}
      {isExpenseModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Log New Expense</h2>
              <button onClick={() => setIsExpenseModalOpen(false)} className="btn-icon"><X/></button>
            </div>
            <form onSubmit={handleCreateExpense}>
              <div className="form-group">
                <label>Category</label>
                <select required value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value})}>
                  <option value="Materials">Materials</option>
                  <option value="Labor">Labor</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Miscellaneous">Miscellaneous</option>
                </select>
              </div>
              <div className="form-group">
                <label>Amount (₹)</label>
                <input required type="number" value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: Number(e.target.value)})} />
              </div>
              <div className="form-group">
                <label>Description (Hardware store, Contractor info)</label>
                <input required type="text" value={newExpense.description} onChange={e => setNewExpense({...newExpense, description: e.target.value})} />
              </div>
              <div className="form-group" style={{ border: '1px dashed var(--admin-border)', padding: '1.5rem', textAlign: 'center', borderRadius: '4px', cursor: 'pointer', backgroundColor: 'var(--admin-bg)' }}>
                <Upload size={24} style={{ color: 'var(--admin-text-muted)', marginBottom: '0.5rem' }} />
                <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem' }}>Upload Receipt (Feature coming soon)</p>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }} disabled={isSubmittingExpense}>
                {isSubmittingExpense ? <><span className="btn-spinner"></span> Logging...</> : 'Log Expense'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {isInvoiceModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Create Invoice</h2>
              <button onClick={() => setIsInvoiceModalOpen(false)} className="btn-icon"><X/></button>
            </div>
            <form onSubmit={handleCreateInvoice}>
              <div className="form-group">
                <label>Amount (₹)</label>
                <input required type="number" value={newInvoice.amount} onChange={e => setNewInvoice({...newInvoice, amount: Number(e.target.value)})} />
              </div>
              <div className="form-group">
                <label>Description / Stage of Work</label>
                <input required type="text" placeholder="e.g. Foundation Completion Payment" value={newInvoice.description} onChange={e => setNewInvoice({...newInvoice, description: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Initial Status</label>
                <select required value={newInvoice.status} onChange={e => setNewInvoice({...newInvoice, status: e.target.value})}>
                  <option value="Unpaid">Unpaid</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }} disabled={isSubmittingInvoice}>
                {isSubmittingInvoice ? <><span className="btn-spinner"></span> Generating...</> : 'Generate Invoice'}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .budget-header {
          margin-bottom: 2rem;
        }
        .budget-layout {
          display: grid;
          grid-template-columns: 250px 1fr;
          gap: 2rem;
        }
        .project-list {
          display: flex;
          flex-direction: column;
        }
        .project-item {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--admin-border);
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .project-item:hover {
          background-color: var(--admin-hover);
        }
        .project-item.selected {
          border-left: 4px solid var(--color-indigo);
          background-color: var(--admin-hover);
          color: var(--color-indigo);
        }
        
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        .metric-card {
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: 8px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .metric-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .budget-lists {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        
        .budget-table {
          width: 100%;
          border-collapse: collapse;
        }
        .budget-table th, .budget-table td {
          padding: 1rem 1.5rem;
          text-align: left;
          border-bottom: 1px solid var(--admin-border);
        }
        .budget-table th {
          font-weight: 600;
          color: var(--admin-text-muted);
          background-color: var(--admin-hover);
        }
        
        .badge-outline {
          border: 1px solid var(--admin-border);
          padding: 0.2rem 0.6rem;
          border-radius: 50px;
          font-size: 0.8rem;
          background: var(--admin-bg);
        }

        .status-btn {
          border: none;
          padding: 0.3rem 0.8rem;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: bold;
          cursor: pointer;
        }
        .status-btn.paid {
          background-color: rgba(34, 197, 94, 0.1);
          color: #22c55e;
        }
        .status-btn.unpaid {
          background-color: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }
        
        .btn-sm {
          padding: 0.4rem 0.8rem;
          font-size: 0.85rem;
          display: inline-flex;
          align-items: center;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 400px;
          background: var(--admin-surface);
          border: 1px dashed var(--admin-border);
          border-radius: 8px;
          color: var(--admin-text-muted);
        }

        @media (max-width: 992px) {
          .budget-layout {
            grid-template-columns: 1fr;
          }
          .metrics-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Budget;
