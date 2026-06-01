import React, { useState, useEffect } from 'react';
import { Package, Truck, AlertCircle, Plus, X, Trash2, MapPin } from 'lucide-react';
import API_BASE_URL from '../../utils/api';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Equipment'); // 'Equipment' or 'Material'
  
  const [newItem, setNewItem] = useState({ 
    name: '', 
    type: 'Equipment', 
    status: 'Available', 
    quantity: 0, 
    minQuantity: 0, 
    unit: 'pieces', 
    currentLocation: '' 
  });

  useEffect(() => {
    fetchInventory();
    fetchProjects();
  }, []);

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/inventory`);
      if (res.ok) setInventory(await res.json());
    } catch (err) {} finally {
      setIsLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/projects`);
      if (res.ok) setProjects(await res.json());
    } catch (err) {}
  };

  const handleCreateItem = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const dataToSubmit = { ...newItem };
      if (!dataToSubmit.currentLocation) delete dataToSubmit.currentLocation;

      const res = await fetch(`${API_BASE_URL}/api/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setNewItem({ name: '', type: activeTab, status: 'Available', quantity: 0, minQuantity: 0, unit: 'pieces', currentLocation: '' });
        fetchInventory();
      }
    } catch (err) {} finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateItem = async (id, updateFields) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/inventory/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateFields)
      });
      if (res.ok) fetchInventory();
    } catch (err) {}
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Remove this item from inventory?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/inventory/${id}`, { method: 'DELETE' });
      if (res.ok) fetchInventory();
    } catch (err) {}
  };

  const equipmentList = inventory.filter(i => i.type === 'Equipment');
  const materialList = inventory.filter(i => i.type === 'Material');

  return (
    <div className="admin-inventory">
      <div className="inventory-header">
        <div>
          <h1>Inventory Management</h1>
          <p className="text-muted">Track heavy equipment location and monitor material supply levels.</p>
        </div>
        <button className="btn btn-primary" onClick={() => {
          setNewItem({ ...newItem, type: activeTab });
          setIsModalOpen(true);
        }}>
          <Plus size={18} style={{ marginRight: '0.5rem' }} /> Add {activeTab}
        </button>
      </div>

      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === 'Equipment' ? 'active' : ''}`}
          onClick={() => setActiveTab('Equipment')}
        >
          <Truck size={18} /> Equipment Tracking
        </button>
        <button 
          className={`tab-btn ${activeTab === 'Material' ? 'active' : ''}`}
          onClick={() => setActiveTab('Material')}
        >
          <Package size={18} /> Material Stock
        </button>
      </div>

      {activeTab === 'Equipment' && (
        <div className="inventory-section card">
          <div className="list-body">
            {isLoading ? (
              <div className="admin-loading-state">
                <div className="admin-spinner"></div>
                <p>Loading equipment...</p>
              </div>
            ) : equipmentList.length === 0 ? <p className="empty-state">No equipment recorded.</p> : (
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>Equipment Name</th>
                    <th>Status</th>
                    <th>Current Location</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {equipmentList.map(eq => (
                    <tr key={eq._id}>
                      <td><strong>{eq.name}</strong></td>
                      <td>
                        <select 
                          className={`status-select ${eq.status.replace(' ', '-').toLowerCase()}`}
                          value={eq.status}
                          onChange={(e) => handleUpdateItem(eq._id, { status: e.target.value })}
                        >
                          <option value="Available">Available</option>
                          <option value="In Use">In Use</option>
                          <option value="Maintenance">Maintenance</option>
                        </select>
                      </td>
                      <td>
                        <select 
                          value={eq.currentLocation?._id || ''}
                          onChange={(e) => handleUpdateItem(eq._id, { currentLocation: e.target.value })}
                        >
                          <option value="">-- Warehouse / Unassigned --</option>
                          {projects.filter(p => p.status !== 'Completed').map(p => (
                            <option key={p._id} value={p._id}>{p.title}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <button className="btn-icon delete-btn" onClick={() => handleDeleteItem(eq._id)}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {activeTab === 'Material' && (
        <div className="inventory-section card">
          <div className="list-body">
            {isLoading ? (
              <div className="admin-loading-state">
                <div className="admin-spinner"></div>
                <p>Loading materials...</p>
              </div>
            ) : materialList.length === 0 ? <p className="empty-state">No materials recorded.</p> : (
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>Material Name</th>
                    <th>Stock Level</th>
                    <th>Unit</th>
                    <th>Location/Site</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {materialList.map(mat => {
                    const isLow = mat.quantity <= mat.minQuantity;
                    return (
                      <tr key={mat._id} className={isLow ? 'low-stock-row' : ''}>
                        <td>
                          <strong>{mat.name}</strong>
                          {isLow && <span className="alert-badge"><AlertCircle size={12}/> Low Stock</span>}
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <button 
                              className="qty-btn" 
                              onClick={() => handleUpdateItem(mat._id, { quantity: Math.max(0, mat.quantity - 1) })}
                            >-</button>
                            <span style={{ fontWeight: 'bold', width: '40px', textAlign: 'center', color: isLow ? '#ef4444' : 'inherit' }}>
                              {mat.quantity}
                            </span>
                            <button 
                              className="qty-btn" 
                              onClick={() => handleUpdateItem(mat._id, { quantity: mat.quantity + 1 })}
                            >+</button>
                          </div>
                        </td>
                        <td>{mat.unit}</td>
                        <td>
                          <select 
                            value={mat.currentLocation?._id || ''}
                            onChange={(e) => handleUpdateItem(mat._id, { currentLocation: e.target.value })}
                          >
                            <option value="">-- Main Warehouse --</option>
                            {projects.filter(p => p.status !== 'Completed').map(p => (
                              <option key={p._id} value={p._id}>{p.title}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <button className="btn-icon delete-btn" onClick={() => handleDeleteItem(mat._id)}>
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New {newItem.type}</h2>
              <button onClick={() => setIsModalOpen(false)} className="btn-icon"><X/></button>
            </div>
            <form onSubmit={handleCreateItem}>
              <div className="form-group">
                <label>{newItem.type} Name</label>
                <input required type="text" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
              </div>

              {newItem.type === 'Equipment' && (
                <div className="form-group">
                  <label>Initial Status</label>
                  <select required value={newItem.status} onChange={e => setNewItem({...newItem, status: e.target.value})}>
                    <option value="Available">Available</option>
                    <option value="In Use">In Use</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              )}

              {newItem.type === 'Material' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Initial Quantity</label>
                      <input required type="number" min="0" value={newItem.quantity} onChange={e => setNewItem({...newItem, quantity: Number(e.target.value)})} />
                    </div>
                    <div className="form-group">
                      <label>Unit (e.g. bags, tons)</label>
                      <input required type="text" value={newItem.unit} onChange={e => setNewItem({...newItem, unit: e.target.value})} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Alert when stock falls below</label>
                    <input required type="number" min="0" value={newItem.minQuantity} onChange={e => setNewItem({...newItem, minQuantity: Number(e.target.value)})} />
                  </div>
                </>
              )}

              <div className="form-group">
                <label>Location / Assignment</label>
                <select value={newItem.currentLocation} onChange={e => setNewItem({...newItem, currentLocation: e.target.value})}>
                  <option value="">-- Main Warehouse / Unassigned --</option>
                  {projects.filter(p => p.status !== 'Completed').map(p => (
                    <option key={p._id} value={p._id}>{p.title}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }} disabled={isSubmitting}>
                {isSubmitting ? <><span className="btn-spinner"></span> Saving...</> : `Save ${newItem.type}`}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .inventory-header {
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
        
        .tab-btn:hover {
          color: var(--admin-text);
        }
        
        .tab-btn.active {
          color: var(--color-indigo);
          border-bottom: 3px solid var(--color-indigo);
        }
        
        .inventory-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .inventory-table th, .inventory-table td {
          padding: 1.25rem 1.5rem;
          text-align: left;
          border-bottom: 1px solid var(--admin-border);
        }
        
        .inventory-table th {
          background-color: var(--admin-hover);
          color: var(--admin-text-muted);
          font-weight: 600;
        }
        
        .empty-state {
          padding: 3rem;
          text-align: center;
          color: var(--admin-text-muted);
        }
        
        .delete-btn {
          color: var(--admin-text-muted);
        }
        .delete-btn:hover {
          color: #ef4444;
        }
        
        /* Selects inside table */
        .inventory-table select {
          padding: 0.4rem;
          border: 1px solid var(--admin-border);
          border-radius: 4px;
          background: var(--admin-bg);
          color: var(--admin-text);
        }
        
        .status-select.available { border-color: #22c55e; color: #22c55e; }
        .status-select.in-use { border-color: #3b82f6; color: #3b82f6; }
        .status-select.maintenance { border-color: #f59e0b; color: #f59e0b; }
        
        /* Material Quantity Controls */
        .qty-btn {
          width: 28px;
          height: 28px;
          border-radius: 4px;
          border: 1px solid var(--admin-border);
          background: var(--admin-surface);
          color: var(--admin-text);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .qty-btn:hover {
          background: var(--admin-hover);
        }
        
        .low-stock-row {
          background-color: rgba(239, 68, 68, 0.05);
        }
        
        .alert-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          background: #ef4444;
          color: white;
          font-size: 0.7rem;
          padding: 0.2rem 0.5rem;
          border-radius: 50px;
          margin-left: 0.75rem;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default Inventory;
