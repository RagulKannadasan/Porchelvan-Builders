import React, { useState, useEffect } from 'react';
import { Users, Phone, Briefcase, Plus, X, Trash2, MapPin } from 'lucide-react';
import API_BASE_URL from '../../utils/api';

const Crew = () => {
  const [crewList, setCrewList] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCrew, setNewCrew] = useState({ name: '', role: 'General Labor', phone: '', currentProject: '' });

  useEffect(() => {
    fetchCrew();
    fetchProjects();
  }, []);

  const fetchCrew = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/crew`);
      if (res.ok) setCrewList(await res.json());
    } catch (err) {}
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/projects`);
      if (res.ok) setProjects(await res.json());
    } catch (err) {}
  };

  const handleCreateCrew = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = { ...newCrew };
      if (!dataToSubmit.currentProject) delete dataToSubmit.currentProject; // Don't send empty string

      const res = await fetch(`${API_BASE_URL}/api/crew`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setNewCrew({ name: '', role: 'General Labor', phone: '', currentProject: '' });
        fetchCrew();
      }
    } catch (err) {}
  };

  const handleUpdateAssignment = async (crewId, projectId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/crew/${crewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentProject: projectId })
      });
      if (res.ok) fetchCrew();
    } catch (err) {}
  };

  const handleDeleteCrew = async (id) => {
    if (!window.confirm('Remove this person from the directory?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/crew/${id}`, { method: 'DELETE' });
      if (res.ok) fetchCrew();
    } catch (err) {}
  };

  return (
    <div className="admin-crew">
      <div className="crew-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Crew & Collaborators</h1>
          <p className="text-muted">Manage your workforce directory and track project assignments.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} style={{ marginRight: '0.5rem' }} /> Add Crew Member
        </button>
      </div>

      <div className="crew-grid">
        {crewList.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            <Users size={48} />
            <h3>No Crew Members Yet</h3>
            <p className="text-muted">Start adding your workforce to track assignments.</p>
          </div>
        ) : (
          crewList.map(member => (
            <div key={member.id || member._id} className="crew-card">
              <div className="crew-card-header">
                <div className="crew-avatar">
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div className="crew-info">
                  <h3>{member.name}</h3>
                  <span className="badge-outline">{member.role}</span>
                </div>
                <button className="btn-icon delete-btn" onClick={() => handleDeleteCrew(member.id || member._id)}>
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="crew-card-body">
                <p className="contact-info">
                  <Phone size={14} /> {member.phone || 'No phone provided'}
                </p>
                
                <div className="assignment-section">
                  <label><Briefcase size={14}/> Current Assignment</label>
                  <select 
                    value={member.currentProject?.id || member.currentProject?._id || ''} 
                    onChange={(e) => handleUpdateAssignment(member.id || member._id, e.target.value)}
                  >
                    <option value="">-- Unassigned (Bench) --</option>
                    {projects.filter(p => p.status !== 'Completed').map(p => (
                      <option key={p.id || p._id} value={p.id || p._id}>{p.title}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Crew Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add Crew Member</h2>
              <button onClick={() => setIsModalOpen(false)} className="btn-icon"><X/></button>
            </div>
            <form onSubmit={handleCreateCrew}>
              <div className="form-group">
                <label>Full Name</label>
                <input required type="text" value={newCrew.name} onChange={e => setNewCrew({...newCrew, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Primary Role</label>
                <select required value={newCrew.role} onChange={e => setNewCrew({...newCrew, role: e.target.value})}>
                  <option value="Site Manager">Site Manager</option>
                  <option value="Electrician">Electrician</option>
                  <option value="Plumber">Plumber</option>
                  <option value="Carpenter">Carpenter</option>
                  <option value="Mason">Mason</option>
                  <option value="General Labor">General Labor</option>
                  <option value="Architect">Architect</option>
                </select>
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="text" value={newCrew.phone} onChange={e => setNewCrew({...newCrew, phone: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Initial Assignment</label>
                <select value={newCrew.currentProject} onChange={e => setNewCrew({...newCrew, currentProject: e.target.value})}>
                  <option value="">-- Unassigned --</option>
                  {projects.filter(p => p.status !== 'Completed').map(p => (
                    <option key={p.id || p._id} value={p.id || p._id}>{p.title}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>Save Crew Member</button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .crew-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        .crew-card {
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: 8px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
        }
        .crew-card-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          position: relative;
        }
        .crew-avatar {
          width: 50px;
          height: 50px;
          background: var(--gradient-brand);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: bold;
        }
        .crew-info h3 {
          margin: 0 0 0.25rem 0;
          font-size: 1.1rem;
        }
        .delete-btn {
          position: absolute;
          top: 0;
          right: 0;
          color: var(--admin-text-muted);
        }
        .delete-btn:hover {
          color: #ef4444;
        }
        
        .contact-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--admin-text-muted);
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }
        
        .assignment-section {
          background: var(--admin-bg);
          padding: 1rem;
          border-radius: 6px;
          border: 1px solid var(--admin-border);
          margin-top: auto;
        }
        .assignment-section label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          font-size: 0.85rem;
          color: var(--admin-text-muted);
        }
        .assignment-section select {
          width: 100%;
          padding: 0.5rem;
          font-size: 0.9rem;
        }
        
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 300px;
          background: var(--admin-surface);
          border: 1px dashed var(--admin-border);
          border-radius: 8px;
          color: var(--admin-text-muted);
        }
      `}</style>
    </div>
  );
};

export default Crew;
