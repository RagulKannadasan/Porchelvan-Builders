import React, { useState, useEffect } from 'react';
import { ShieldAlert, FileText, Plus, X, Trash2, MapPin, ExternalLink, Paperclip } from 'lucide-react';
import API_BASE_URL from '../../utils/api';

const IssuesVault = () => {
  const [activeTab, setActiveTab] = useState('Issues');
  const [issues, setIssues] = useState([]);
  const [vaultDocs, setVaultDocs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Forms
  const [newIssue, setNewIssue] = useState({ title: '', description: '', projectId: '', priority: 'Medium' });
  const [newDoc, setNewDoc] = useState({ title: '', projectId: '', url: '', type: 'Blueprint' });

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchIssues(), fetchVaultDocs(), fetchProjects()]);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const fetchIssues = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/issues`);
      if (res.ok) setIssues(await res.json());
    } catch (err) {}
  };

  const fetchVaultDocs = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/vault`);
      if (res.ok) setVaultDocs(await res.json());
    } catch (err) {}
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/projects`);
      if (res.ok) setProjects(await res.json());
    } catch (err) {}
  };

  const handleCreateIssue = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/issues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newIssue)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setNewIssue({ title: '', description: '', projectId: '', priority: 'Medium' });
        fetchIssues();
      }
    } catch (err) {}
  };

  const handleCreateDoc = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/vault`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDoc)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setNewDoc({ title: '', projectId: '', url: '', type: 'Blueprint' });
        fetchVaultDocs();
      }
    } catch (err) {}
  };

  const handleUpdateIssueStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/issues/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchIssues();
    } catch (err) {}
  };

  const handleDeleteIssue = async (id) => {
    if (!window.confirm("Delete this issue?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/issues/${id}`, { method: 'DELETE' });
      if (res.ok) fetchIssues();
    } catch (err) {}
  };

  const handleDeleteDoc = async (id) => {
    if (!window.confirm("Remove this document from the vault?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/vault/${id}`, { method: 'DELETE' });
      if (res.ok) fetchVaultDocs();
    } catch (err) {}
  };

  return (
    <div className="admin-issues">
      <div className="header-section">
        <div>
          <h1>Issues & Vault</h1>
          <p className="text-muted">Track site defects and securely store project documents.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} style={{ marginRight: '0.5rem' }} /> Add {activeTab === 'Issues' ? 'Issue' : 'Document'}
        </button>
      </div>

      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === 'Issues' ? 'active' : ''}`}
          onClick={() => setActiveTab('Issues')}
        >
          <ShieldAlert size={18} /> Snag List (Issues)
        </button>
        <button 
          className={`tab-btn ${activeTab === 'Vault' ? 'active' : ''}`}
          onClick={() => setActiveTab('Vault')}
        >
          <FileText size={18} /> Document Vault
        </button>
      </div>

      {activeTab === 'Issues' && (
        <div className="issues-grid">
          {isLoading ? (
            <div className="admin-loading-state" style={{ gridColumn: '1 / -1' }}>
              <div className="admin-spinner"></div>
              <p>Loading issues...</p>
            </div>
          ) : issues.length === 0 ? (
            <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
              <ShieldAlert size={48} />
              <h3>No Active Issues</h3>
              <p className="text-muted">All clear! No site defects have been logged.</p>
            </div>
          ) : (
            issues.map(issue => (
              <div key={issue._id} className="issue-card">
                <div className="issue-header">
                  <span className={`priority-badge ${issue.priority.toLowerCase()}`}>{issue.priority} Priority</span>
                  <button className="btn-icon delete-btn" onClick={() => handleDeleteIssue(issue._id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
                <h3>{issue.title}</h3>
                <p className="issue-desc">{issue.description}</p>
                <div className="issue-meta">
                  <span><MapPin size={14}/> {issue.projectId?.title || 'Unknown Site'}</span>
                </div>
                
                <div className="issue-actions">
                  <select 
                    className={`status-select ${issue.status.replace(' ', '-').toLowerCase()}`}
                    value={issue.status}
                    onChange={e => handleUpdateIssueStatus(issue._id, e.target.value)}
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'Vault' && (
        <div className="vault-grid card">
          {isLoading ? (
            <div className="admin-loading-state">
              <div className="admin-spinner"></div>
              <p>Loading documents...</p>
            </div>
          ) : vaultDocs.length === 0 ? (
            <div className="empty-state">
              <FileText size={48} />
              <h3>Vault is Empty</h3>
              <p className="text-muted">Upload blueprints, permits, and contracts to securely store them.</p>
            </div>
          ) : (
            <table className="vault-table">
              <thead>
                <tr>
                  <th>Document Title</th>
                  <th>Type</th>
                  <th>Project Site</th>
                  <th>Link</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vaultDocs.map(doc => (
                  <tr key={doc._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Paperclip size={16} style={{ color: 'var(--color-indigo)' }}/>
                        <strong>{doc.title}</strong>
                      </div>
                    </td>
                    <td><span className="badge-outline">{doc.type}</span></td>
                    <td>{doc.projectId?.title || 'General'}</td>
                    <td>
                      <a href={doc.url} target="_blank" rel="noreferrer" className="doc-link">
                        View File <ExternalLink size={14}/>
                      </a>
                    </td>
                    <td>
                      <button className="btn-icon delete-btn" onClick={() => handleDeleteDoc(doc._id)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add {activeTab === 'Issues' ? 'New Issue' : 'Document to Vault'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="btn-icon"><X/></button>
            </div>
            
            {activeTab === 'Issues' ? (
              <form onSubmit={handleCreateIssue}>
                <div className="form-group">
                  <label>Issue Title</label>
                  <input required type="text" value={newIssue.title} onChange={e => setNewIssue({...newIssue, title: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea required rows="3" value={newIssue.description} onChange={e => setNewIssue({...newIssue, description: e.target.value})}></textarea>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Priority</label>
                    <select required value={newIssue.priority} onChange={e => setNewIssue({...newIssue, priority: e.target.value})}>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Project Site</label>
                    <select required value={newIssue.projectId} onChange={e => setNewIssue({...newIssue, projectId: e.target.value})}>
                      <option value="">-- Select Project --</option>
                      {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Log Issue</button>
              </form>
            ) : (
              <form onSubmit={handleCreateDoc}>
                <div className="form-group">
                  <label>Document Title</label>
                  <input required type="text" value={newDoc.title} onChange={e => setNewDoc({...newDoc, title: e.target.value})} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Document Type</label>
                    <select required value={newDoc.type} onChange={e => setNewDoc({...newDoc, type: e.target.value})}>
                      <option value="Blueprint">Blueprint</option>
                      <option value="Permit">Permit</option>
                      <option value="Contract">Contract</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Project Site</label>
                    <select required value={newDoc.projectId} onChange={e => setNewDoc({...newDoc, projectId: e.target.value})}>
                      <option value="">-- Select Project --</option>
                      {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>File URL (Cloud storage link)</label>
                  <input required type="url" placeholder="https://..." value={newDoc.url} onChange={e => setNewDoc({...newDoc, url: e.target.value})} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Save to Vault</button>
              </form>
            )}
          </div>
        </div>
      )}

      <style>{`
        .header-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .tabs {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid var(--admin-border);
          padding-bottom: 0.5rem;
        }
        
        .tab-btn {
          background: none;
          border: none;
          color: var(--admin-text-muted);
          padding: 0.5rem 1rem;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border-bottom: 3px solid transparent;
        }
        
        .tab-btn:hover { color: var(--admin-text); }
        .tab-btn.active { color: var(--color-indigo); border-bottom: 3px solid var(--color-indigo); }

        .issues-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .issue-card {
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: 8px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
        }

        .issue-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .issue-card h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.1rem;
        }

        .issue-desc {
          color: var(--admin-text-muted);
          font-size: 0.9rem;
          margin-bottom: 1rem;
          line-height: 1.4;
          flex: 1;
        }

        .issue-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--admin-text-muted);
          font-size: 0.85rem;
          margin-bottom: 1.5rem;
        }

        .priority-badge {
          font-size: 0.75rem;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-weight: bold;
          text-transform: uppercase;
        }
        .priority-badge.high { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
        .priority-badge.medium { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        .priority-badge.low { background: rgba(34, 197, 94, 0.1); color: #22c55e; }

        .issue-actions select {
          width: 100%;
          padding: 0.5rem;
          border-radius: 4px;
          border: 1px solid var(--admin-border);
          font-weight: 500;
        }

        .status-select.open { background: rgba(239, 68, 68, 0.05); color: #ef4444; border-color: rgba(239, 68, 68, 0.2); }
        .status-select.in-progress { background: rgba(59, 130, 246, 0.05); color: #3b82f6; border-color: rgba(59, 130, 246, 0.2); }
        .status-select.resolved { background: rgba(34, 197, 94, 0.05); color: #22c55e; border-color: rgba(34, 197, 94, 0.2); }

        .vault-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .vault-table th, .vault-table td {
          padding: 1.25rem 1.5rem;
          text-align: left;
          border-bottom: 1px solid var(--admin-border);
        }
        
        .vault-table th {
          background-color: var(--admin-hover);
          color: var(--admin-text-muted);
          font-weight: 600;
        }

        .badge-outline {
          border: 1px solid var(--admin-border);
          padding: 0.2rem 0.6rem;
          border-radius: 50px;
          font-size: 0.8rem;
          background: var(--admin-bg);
        }

        .doc-link {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: var(--color-indigo);
          text-decoration: none;
          font-weight: 500;
          font-size: 0.9rem;
        }
        .doc-link:hover { text-decoration: underline; }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 300px;
          color: var(--admin-text-muted);
          padding: 2rem;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default IssuesVault;
