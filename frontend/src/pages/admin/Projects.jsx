import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, FileText, AlertTriangle, Users, MapPin, X } from 'lucide-react';
import API_BASE_URL from '../../utils/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [diaries, setDiaries] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Project Form State
  const [newProject, setNewProject] = useState({ title: '', description: '', status: 'Upcoming', location: '' });

  // New Diary Form State
  const [newDiary, setNewDiary] = useState({ workCompleted: '', issues: '', workersPresent: 0 });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/projects`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch projects");
    }
  };

  const fetchDiaries = async (projectId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/projects/${projectId}/diaries`);
      if (res.ok) {
        const data = await res.json();
        setDiaries(data);
      }
    } catch (err) {
      console.error("Failed to fetch diaries");
    }
  };

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    fetchDiaries(project._id);
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject)
      });
      if (res.ok) {
        fetchProjects();
        setIsModalOpen(false);
        setNewProject({ title: '', description: '', status: 'Upcoming', location: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProject = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this project and all its diaries?")) return;
    try {
      await fetch(`${API_BASE_URL}/api/projects/${id}`, { method: 'DELETE' });
      if (selectedProject && selectedProject._id === id) setSelectedProject(null);
      fetchProjects();
    } catch (err) {}
  };

  const handleCreateDiary = async (e) => {
    e.preventDefault();
    if (!selectedProject) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/projects/${selectedProject._id}/diaries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDiary)
      });
      if (res.ok) {
        fetchDiaries(selectedProject._id);
        setNewDiary({ workCompleted: '', issues: '', workersPresent: 0 });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-projects">
      <div className="projects-header">
        <div>
          <h1>Projects Management</h1>
          <p className="text-muted">Manage your construction sites and daily site diaries.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} style={{ marginRight: '0.5rem' }} /> New Project
        </button>
      </div>

      <div className="projects-layout">
        {/* Project List Column */}
        <div className="projects-list-col">
          <div className="card">
            <div className="card-header">
              <h3>All Projects</h3>
            </div>
            <div className="project-list">
              {projects.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
                  No projects found.
                </div>
              ) : (
                projects.map(p => (
                  <div 
                    key={p._id} 
                    className={`project-item ${selectedProject?._id === p._id ? 'selected' : ''}`}
                    onClick={() => handleSelectProject(p)}
                  >
                    <div className="project-item-info">
                      <h4>{p.title}</h4>
                      <span className="badge">{p.status}</span>
                    </div>
                    <button className="btn-icon" onClick={(e) => handleDeleteProject(p._id, e)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Project Details & Diaries Column */}
        <div className="project-details-col">
          {selectedProject ? (
            <>
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div className="card-body">
                  <h2>{selectedProject.title}</h2>
                  <p className="text-muted" style={{ marginBottom: '1rem' }}>{selectedProject.description}</p>
                  {selectedProject.location && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--admin-text-muted)', fontSize: '0.9rem' }}>
                      <MapPin size={16} /> {selectedProject.location}
                    </div>
                  )}
                </div>
              </div>

              <div className="card">
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>Site Diaries</h3>
                  <span className="badge">Weather API Active</span>
                </div>
                <div className="card-body" style={{ borderBottom: '1px solid var(--admin-border)' }}>
                  {/* New Diary Form */}
                  <form className="diary-form" onSubmit={handleCreateDiary}>
                    <h4>Log Today's Work</h4>
                    <div className="form-group">
                      <label>Work Completed</label>
                      <textarea 
                        required
                        value={newDiary.workCompleted}
                        onChange={e => setNewDiary({...newDiary, workCompleted: e.target.value})}
                        placeholder="What was completed today?"
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Issues / Roadblocks</label>
                        <input 
                          type="text" 
                          value={newDiary.issues}
                          onChange={e => setNewDiary({...newDiary, issues: e.target.value})}
                          placeholder="Any delays?"
                        />
                      </div>
                      <div className="form-group">
                        <label>Workers Present</label>
                        <input 
                          type="number" 
                          required
                          value={newDiary.workersPresent}
                          onChange={e => setNewDiary({...newDiary, workersPresent: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Submit Daily Log</button>
                  </form>
                </div>
                
                <div className="diaries-list">
                  {diaries.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
                      No diaries logged yet.
                    </div>
                  ) : (
                    diaries.map(d => (
                      <div key={d._id} className="diary-card">
                        <div className="diary-header">
                          <div className="diary-date">
                            <Calendar size={16} />
                            <span>{new Date(d.date).toLocaleDateString()}</span>
                          </div>
                          <div className="diary-weather">
                            🌤️ {d.weather}
                          </div>
                        </div>
                        <div className="diary-body">
                          <div className="diary-section">
                            <strong><FileText size={14}/> Work Completed:</strong>
                            <p>{d.workCompleted}</p>
                          </div>
                          {d.issues && (
                            <div className="diary-section text-danger">
                              <strong><AlertTriangle size={14}/> Issues:</strong>
                              <p>{d.issues}</p>
                            </div>
                          )}
                          <div className="diary-section">
                            <strong><Users size={14}/> Workers on Site:</strong>
                            <span>{d.workersPresent}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <HardHatIcon size={48} />
              <h3>Select a Project</h3>
              <p className="text-muted">Choose a project from the left to view details and site diaries.</p>
            </div>
          )}
        </div>
      </div>

      {/* New Project Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Create New Project</h2>
              <button onClick={() => setIsModalOpen(false)} className="btn-icon"><X/></button>
            </div>
            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label>Project Title</label>
                <input required type="text" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea required value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Location (City, Area)</label>
                <input type="text" value={newProject.location} onChange={e => setNewProject({...newProject, location: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={newProject.status} onChange={e => setNewProject({...newProject, status: e.target.value})}>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Create Project</button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .projects-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .projects-layout {
          display: grid;
          grid-template-columns: 1fr 2.5fr;
          gap: 2rem;
        }
        .project-list {
          max-height: 600px;
          overflow-y: auto;
        }
        .project-item {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--admin-border);
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: background-color 0.2s;
        }
        .project-item:hover {
          background-color: var(--admin-hover);
        }
        .project-item.selected {
          border-left: 4px solid var(--color-indigo);
          background-color: var(--admin-hover);
        }
        .project-item-info h4 {
          margin: 0 0 0.5rem 0;
        }
        .btn-icon {
          background: none;
          border: none;
          color: var(--admin-text-muted);
          cursor: pointer;
        }
        .btn-icon:hover {
          color: #ff4d4f;
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
        .empty-state h3 {
          margin-top: 1rem;
          color: var(--admin-text);
        }

        /* Forms */
        .form-group {
          margin-bottom: 1.25rem;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          font-size: 0.9rem;
        }
        input, textarea, select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--admin-border);
          border-radius: 4px;
          background: var(--admin-bg);
          color: var(--admin-text);
          font-family: inherit;
        }
        textarea {
          resize: vertical;
          min-height: 80px;
        }

        /* Diaries */
        .diaries-list {
          padding: 1.5rem;
          background-color: var(--admin-bg);
        }
        .diary-card {
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: 8px;
          padding: 1.25rem;
          margin-bottom: 1rem;
        }
        .diary-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px dashed var(--admin-border);
          font-size: 0.9rem;
          color: var(--admin-text-muted);
        }
        .diary-date, .diary-weather {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .diary-section {
          margin-bottom: 0.75rem;
          font-size: 0.95rem;
        }
        .diary-section strong {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.25rem;
        }
        .diary-section p {
          margin: 0;
          padding-left: 1.5rem;
        }
        .text-danger {
          color: #ff4d4f;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal {
          background: var(--admin-surface);
          border-radius: 8px;
          width: 100%;
          max-width: 500px;
          padding: 2rem;
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        @media (max-width: 992px) {
          .projects-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

// HardHat icon for empty state since it's not exported by default in the main component above
const HardHatIcon = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"></path>
    <path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"></path>
    <path d="M4 15v-3a6 6 0 0 1 6-6h0"></path>
    <path d="M14 6h0a6 6 0 0 1 6 6v3"></path>
  </svg>
);

export default Projects;
