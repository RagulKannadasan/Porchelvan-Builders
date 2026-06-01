import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, FileText, AlertTriangle, Users, MapPin, X, HelpCircle } from 'lucide-react';
import API_BASE_URL from '../../utils/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/projects`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch projects");
    } finally {
      setIsLoading(false);
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
    fetchDiaries(project.id || project._id);
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
      if (selectedProject && (selectedProject.id || selectedProject._id) === id) {
        setSelectedProject(null);
      }
      fetchProjects();
    } catch (err) {}
  };

  const handleCreateDiary = async (e) => {
    e.preventDefault();
    const projectId = selectedProject?.id || selectedProject?._id;
    if (!projectId) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/projects/${projectId}/diaries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDiary)
      });
      if (res.ok) {
        fetchDiaries(projectId);
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
              {isLoading ? (
                <div className="admin-loading-state">
                  <div className="admin-spinner"></div>
                  <p>Loading projects...</p>
                </div>
              ) : projects.length === 0 ? (
                <div style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
                  No projects found.
                </div>
              ) : (
                projects.map(p => {
                  const projectId = p.id || p._id;
                  const isSelected = selectedProject && (selectedProject.id || selectedProject._id) === projectId;
                  return (
                    <div 
                      key={projectId} 
                      className={`project-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectProject(p)}
                    >
                      <div className="project-item-info">
                        <h4>{p.title}</h4>
                        <span className={`badge ${(p.status || 'Upcoming').toLowerCase()}`}>{p.status}</span>
                      </div>
                      <button className="btn-icon" onClick={(e) => handleDeleteProject(projectId, e)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Project Details & Diaries Column */}
        <div className="project-details-col">
          {selectedProject ? (
            <>
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div className="card-body" style={{ padding: '1.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                    <h2 style={{ margin: 0 }}>{selectedProject.title}</h2>
                    <span className={`badge ${(selectedProject.status || 'Upcoming').toLowerCase()}`}>{selectedProject.status}</span>
                  </div>
                  <p className="text-muted" style={{ marginBottom: '1.25rem', fontSize: '0.95rem', lineHeight: '1.6' }}>{selectedProject.description}</p>
                  {selectedProject.location && (
                    <div className="project-location-pin">
                      <MapPin size={14} /> <span>{selectedProject.location}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="card">
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--admin-border)' }}>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '700' }}>Site Diaries</h3>
                  <span className="badge badge-weather">🌤️ Weather API Active</span>
                </div>
                
                <div className="card-body" style={{ borderBottom: '1px solid var(--admin-border)', padding: '1.75rem' }}>
                  {/* New Diary Form */}
                  <form className="diary-form" onSubmit={handleCreateDiary}>
                    <h4>Log Today's Work</h4>
                    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                      <label>Work Completed</label>
                      <textarea 
                        required
                        value={newDiary.workCompleted}
                        onChange={e => setNewDiary({...newDiary, workCompleted: e.target.value})}
                        placeholder="What architectural milestones or site tasks were completed today?"
                        rows={3}
                      />
                    </div>
                    <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>Issues / Roadblocks</label>
                        <input 
                          type="text" 
                          value={newDiary.issues}
                          onChange={e => setNewDiary({...newDiary, issues: e.target.value})}
                          placeholder="Log any delays, material shortages, or weather issues..."
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>Workers Present</label>
                        <input 
                          type="number" 
                          required
                          value={newDiary.workersPresent}
                          onChange={e => setNewDiary({...newDiary, workersPresent: parseInt(e.target.value) || 0})}
                          min={0}
                        />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>Submit Daily Log</button>
                  </form>
                </div>
                
                <div className="diaries-list">
                  {diaries.length === 0 ? (
                    <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--admin-text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                      <FileText size={40} style={{ opacity: 0.3, color: 'var(--brand-orange)' }} />
                      <h3>No Daily Logs Logged Yet</h3>
                      <p className="text-muted" style={{ margin: 0, maxWidth: '280px', fontSize: '0.9rem' }}>Be the first to log progress details for {selectedProject.title}.</p>
                    </div>
                  ) : (
                    diaries.map(d => {
                      const diaryId = d.id || d._id;
                      return (
                        <div key={diaryId} className="diary-card">
                          <div className="diary-header">
                            <div className="diary-date">
                              <Calendar size={16} />
                              <span>{new Date(d.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                            <div className="diary-weather">
                              🌤️ {d.weather || 'Weather unavailable'}
                            </div>
                          </div>
                          <div className="diary-body">
                            <div className="diary-section">
                              <strong><FileText size={14}/> Work Completed</strong>
                              <p>{d.workCompleted}</p>
                            </div>
                            {d.issues && (
                              <div className="diary-section text-danger">
                                <strong><AlertTriangle size={14}/> Delays & Issues</strong>
                                <p>{d.issues}</p>
                              </div>
                            )}
                            <div className="diary-section">
                              <strong><Users size={14}/> Workers on Site</strong>
                              <span className="workers-count">{d.workersPresent} active personnel</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <HardHatIcon size={56} />
              <h3>Select a Construction Project</h3>
              <p className="text-muted" style={{ maxWidth: '320px', lineHeight: '1.6' }}>Choose one of the ongoing or upcoming architectural builds from the directory side panel to view timelines, live weather forecasts, and log history.</p>
            </div>
          )}
        </div>
      </div>

      {/* New Project Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
              <h2>Create New Project</h2>
              <button onClick={() => setIsModalOpen(false)} className="btn-icon" style={{ border: 'none', background: 'none' }}><X/></button>
            </div>
            <form onSubmit={handleCreateProject}>
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label>Project Title</label>
                <input required type="text" placeholder="e.g. Porchelvan Grand Towers" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} />
              </div>
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label>Description</label>
                <textarea required placeholder="Outline specifications, client expectations, architectural design..." value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} rows={3} />
              </div>
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label>Location (City, Area)</label>
                <input type="text" placeholder="e.g. Adyar, Chennai" value={newProject.location} onChange={e => setNewProject({...newProject, location: e.target.value})} />
              </div>
              <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                <label>Status</label>
                <select value={newProject.status} onChange={e => setNewProject({...newProject, status: e.target.value})}>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>Create Project</button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .admin-projects {
          animation: fadeIn 0.4s ease-out;
          color: var(--admin-text);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .projects-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          border-bottom: 1px solid var(--admin-border);
          padding-bottom: 1.5rem;
        }

        .projects-header h1 {
          font-size: 2.2rem;
          font-weight: 800;
          margin: 0 0 0.5rem 0;
          background: linear-gradient(135deg, var(--admin-text) 0%, rgba(255,255,255,0.7) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .projects-layout {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 2rem;
          align-items: start;
        }

        /* Project Cards */
        .projects-list-col .card {
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }

        .projects-list-col .card-header {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--admin-border);
          background: rgba(255, 255, 255, 0.02);
        }

        .projects-list-col .card-header h3 {
          font-size: 1.15rem;
          font-weight: 700;
          margin: 0;
          letter-spacing: 0.5px;
          color: var(--brand-orange, #F97316);
        }

        .project-list {
          max-height: calc(100vh - 280px);
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: var(--admin-border) transparent;
        }

        /* Stylized Scrollbar */
        .project-list::-webkit-scrollbar {
          width: 5px;
        }
        .project-list::-webkit-scrollbar-thumb {
          background: var(--admin-border);
          border-radius: 4px;
        }

        .project-item {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--admin-border);
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .project-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 0;
          background: var(--brand-orange, #F97316);
          transition: width 0.25s ease;
        }

        .project-item:hover {
          background-color: rgba(249, 115, 22, 0.03);
          transform: translateX(3px);
        }

        .project-item.selected {
          background-color: rgba(249, 115, 22, 0.06);
          box-shadow: inset 2px 0 0 var(--brand-orange, #F97316);
        }

        .project-item.selected::before {
          width: 4px;
        }

        .project-item-info h4 {
          margin: 0 0 0.5rem 0;
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--admin-text);
          transition: color 0.2s ease;
        }

        .project-item:hover h4 {
          color: var(--brand-orange, #F97316);
        }

        /* Vibrant dynamic badges */
        .badge {
          display: inline-flex;
          align-items: center;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .badge.ongoing, .badge.Ongoing {
          background: rgba(249, 115, 22, 0.1);
          color: var(--brand-orange, #F97316);
          border: 1px solid rgba(249, 115, 22, 0.2);
        }

        .badge.upcoming, .badge.Upcoming {
          background: rgba(14, 165, 233, 0.1);
          color: #0EA5E9;
          border: 1px solid rgba(14, 165, 233, 0.2);
        }

        .badge.completed, .badge.Completed {
          background: rgba(16, 185, 129, 0.1);
          color: #10B981;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .badge-weather {
          background: rgba(255, 255, 255, 0.05);
          color: var(--admin-text-muted);
          border: 1px solid var(--admin-border);
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .btn-icon {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--admin-border);
          color: var(--admin-text-muted);
          cursor: pointer;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .btn-icon:hover {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.2);
          color: #EF4444;
          transform: scale(1.05);
        }

        /* Empty State */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 480px;
          background: var(--admin-surface);
          border: 2px dashed var(--admin-border);
          border-radius: 16px;
          color: var(--admin-text-muted);
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
        }

        .empty-state svg {
          stroke: var(--brand-orange, #F97316);
          margin-bottom: 1.5rem;
          filter: drop-shadow(0 0 12px rgba(249, 115, 22, 0.2));
        }

        .empty-state h3 {
          margin: 0 0 0.5rem 0;
          color: var(--admin-text);
          font-weight: 700;
          font-size: 1.3rem;
        }

        /* Project Details */
        .project-details-col .card {
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: 16px;
          box-shadow: 0 4px 25px rgba(0, 0, 0, 0.12);
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .project-details-col h2 {
          font-size: 1.8rem;
          font-weight: 800;
          margin: 0 0 0.75rem 0;
          color: var(--admin-text);
        }

        .project-location-pin {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--brand-orange, #F97316);
          font-size: 0.9rem;
          background: rgba(249, 115, 22, 0.05);
          padding: 0.4rem 0.8rem;
          border-radius: 30px;
          border: 1px solid rgba(249, 115, 22, 0.1);
        }

        /* Diary Log Form */
        .diary-form {
          padding: 1.5rem;
          background: rgba(255,255,255,0.01);
          border-radius: 12px;
        }

        .diary-form h4 {
          font-size: 1.1rem;
          font-weight: 700;
          margin: 0 0 1.25rem 0;
          color: var(--admin-text);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          font-size: 0.85rem;
          color: var(--admin-text-muted);
        }

        .form-group input, .form-group textarea, .form-group select {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid var(--admin-border);
          border-radius: 8px;
          background: rgba(0,0,0,0.2);
          color: var(--admin-text);
          font-family: inherit;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .form-group input:focus, .form-group textarea:focus, .form-group select:focus {
          outline: none;
          border-color: var(--brand-orange, #F97316);
          background: rgba(0,0,0,0.3);
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }

        /* Diary Entries Timeline */
        .diaries-list {
          padding: 2rem;
          background-color: rgba(0,0,0,0.08);
          max-height: 500px;
          overflow-y: auto;
          border-top: 1px solid var(--admin-border);
        }

        .diary-card {
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
          transition: all 0.2s ease;
          animation: slideUp 0.3s ease-out;
        }

        .diary-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.12);
          border-color: rgba(249, 115, 22, 0.15);
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .diary-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--admin-border);
          font-size: 0.85rem;
        }

        .diary-date {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--admin-text);
          font-weight: 700;
        }

        .diary-date svg {
          color: var(--brand-orange, #F97316);
        }

        .diary-weather {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--admin-border);
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          color: var(--admin-text-muted);
          font-weight: 600;
          font-size: 0.8rem;
        }

        .diary-section {
          margin-bottom: 1rem;
          font-size: 0.92rem;
        }

        .diary-section:last-child {
          margin-bottom: 0;
        }

        .diary-section strong {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.4rem;
          color: var(--admin-text);
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .diary-section strong svg {
          color: var(--brand-orange, #F97316);
        }

        .diary-section.text-danger strong svg {
          color: #EF4444;
        }

        .diary-section p {
          margin: 0;
          padding-left: 1.5rem;
          color: var(--admin-text-muted);
          line-height: 1.5;
        }

        .diary-section span.workers-count {
          padding-left: 1.5rem;
          color: var(--admin-text-muted);
          font-weight: 700;
        }

        /* Modals */
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.25s ease-out;
        }

        .modal {
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: 16px;
          width: 100%;
          max-width: 500px;
          padding: 2rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .modal-header h2 {
          font-size: 1.4rem;
          font-weight: 800;
          margin: 0;
          color: var(--admin-text);
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
