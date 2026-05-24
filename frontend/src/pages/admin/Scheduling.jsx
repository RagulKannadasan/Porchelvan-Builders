import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, X, Trash2, MapPin, Users, Truck } from 'lucide-react';
import API_BASE_URL from '../../utils/api';

const Scheduling = () => {
  const [events, setEvents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [crew, setCrew] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: '',
    resourceType: 'Crew',
    resourceId: '',
    projectId: '',
    startDate: '',
    endDate: '',
    notes: ''
  });

  useEffect(() => {
    fetchEvents();
    fetchProjects();
    fetchCrew();
    fetchEquipment();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/schedule`);
      if (res.ok) setEvents(await res.json());
    } catch (err) {}
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/projects`);
      if (res.ok) setProjects(await res.json());
    } catch (err) {}
  };

  const fetchCrew = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/crew`);
      if (res.ok) setCrew(await res.json());
    } catch (err) {}
  };

  const fetchEquipment = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/inventory`);
      if (res.ok) {
        const inv = await res.json();
        setEquipment(inv.filter(i => i.type === 'Equipment'));
      }
    } catch (err) {}
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setNewEvent({ title: '', resourceType: 'Crew', resourceId: '', projectId: '', startDate: '', endDate: '', notes: '' });
        fetchEvents();
      }
    } catch (err) {}
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Delete this scheduled event?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/schedule/${id}`, { method: 'DELETE' });
      if (res.ok) fetchEvents();
    } catch (err) {}
  };

  // Group events by month for the timeline view
  const groupedEvents = events.reduce((acc, event) => {
    const monthYear = new Date(event.startDate).toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!acc[monthYear]) acc[monthYear] = [];
    acc[monthYear].push(event);
    return acc;
  }, {});

  return (
    <div className="admin-scheduling">
      <div className="scheduling-header">
        <div>
          <h1>Centralized Scheduling</h1>
          <p className="text-muted">Plan and track crew and equipment assignments across all sites.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} style={{ marginRight: '0.5rem' }} /> New Assignment
        </button>
      </div>

      <div className="timeline-container">
        {Object.keys(groupedEvents).length === 0 ? (
          <div className="empty-state">
            <Calendar size={48} />
            <h3>No Active Schedules</h3>
            <p className="text-muted">Create an assignment to see it on the timeline.</p>
          </div>
        ) : (
          Object.keys(groupedEvents).map(month => (
            <div key={month} className="timeline-month">
              <h2 className="month-title">{month}</h2>
              <div className="timeline-events">
                {groupedEvents[month].map(ev => {
                  const sDate = new Date(ev.startDate);
                  const eDate = new Date(ev.endDate);
                  const isActive = new Date() >= sDate && new Date() <= eDate;
                  
                  return (
                    <div key={ev._id} className={`timeline-event-card ${isActive ? 'active-event' : ''}`}>
                      <div className="event-icon">
                        {ev.resourceType === 'Crew' ? <Users size={20} /> : <Truck size={20} />}
                      </div>
                      <div className="event-details">
                        <div className="event-header">
                          <h3>{ev.title}</h3>
                          <button className="btn-icon delete-btn" onClick={() => handleDeleteEvent(ev._id)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="event-meta">
                          <span><MapPin size={14} /> {ev.projectId?.title || 'Unknown Site'}</span>
                          <span>
                            <Clock size={14} /> {sDate.toLocaleDateString()} to {eDate.toLocaleDateString()}
                          </span>
                        </div>
                        {ev.notes && <p className="event-notes">{ev.notes}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Event Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Schedule Resource</h2>
              <button onClick={() => setIsModalOpen(false)} className="btn-icon"><X/></button>
            </div>
            <form onSubmit={handleCreateEvent}>
              <div className="form-group">
                <label>Assignment Title</label>
                <input required type="text" placeholder="e.g. Excavator for Foundation" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Resource Type</label>
                  <select required value={newEvent.resourceType} onChange={e => setNewEvent({...newEvent, resourceType: e.target.value, resourceId: ''})}>
                    <option value="Crew">Crew Member</option>
                    <option value="Equipment">Heavy Equipment</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Select {newEvent.resourceType}</label>
                  <select required value={newEvent.resourceId} onChange={e => setNewEvent({...newEvent, resourceId: e.target.value})}>
                    <option value="">-- Choose --</option>
                    {newEvent.resourceType === 'Crew' ? (
                      crew.map(c => <option key={c._id} value={c._id}>{c.name} ({c.role})</option>)
                    ) : (
                      equipment.map(eq => <option key={eq._id} value={eq._id}>{eq.name}</option>)
                    )}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Project Site</label>
                <select required value={newEvent.projectId} onChange={e => setNewEvent({...newEvent, projectId: e.target.value})}>
                  <option value="">-- Choose Project --</option>
                  {projects.filter(p => p.status !== 'Completed').map(p => (
                    <option key={p._id} value={p._id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input required type="date" value={newEvent.startDate} onChange={e => setNewEvent({...newEvent, startDate: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input required type="date" value={newEvent.endDate} onChange={e => setNewEvent({...newEvent, endDate: e.target.value})} />
                </div>
              </div>
              
              <div className="form-group">
                <label>Notes (Optional)</label>
                <input type="text" value={newEvent.notes} onChange={e => setNewEvent({...newEvent, notes: e.target.value})} />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>Add to Schedule</button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .scheduling-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        
        .timeline-container {
          background: var(--admin-bg);
          padding-bottom: 2rem;
        }

        .timeline-month {
          margin-bottom: 3rem;
        }

        .month-title {
          font-size: 1.25rem;
          color: var(--color-indigo);
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid var(--admin-border);
        }

        .timeline-events {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding-left: 1rem;
          border-left: 2px solid var(--admin-border);
        }

        .timeline-event-card {
          display: flex;
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: 8px;
          padding: 1.25rem;
          gap: 1.5rem;
          position: relative;
          margin-left: 1rem;
          transition: transform 0.2s;
        }

        .timeline-event-card:hover {
          transform: translateX(5px);
        }

        .timeline-event-card::before {
          content: '';
          position: absolute;
          left: -1.75rem;
          top: 1.5rem;
          width: 1rem;
          height: 2px;
          background: var(--admin-border);
        }

        .timeline-event-card.active-event {
          border-left: 4px solid var(--color-orange);
        }

        .event-icon {
          width: 48px;
          height: 48px;
          background: var(--admin-hover);
          color: var(--color-indigo);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .event-details {
          flex: 1;
        }

        .event-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .event-header h3 {
          margin: 0;
          font-size: 1.1rem;
        }

        .event-meta {
          display: flex;
          gap: 1.5rem;
          color: var(--admin-text-muted);
          font-size: 0.85rem;
          margin-bottom: 0.5rem;
        }

        .event-meta span {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .event-notes {
          margin: 0;
          font-size: 0.9rem;
          color: var(--admin-text-muted);
          font-style: italic;
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

        .delete-btn {
          color: var(--admin-text-muted);
        }
        .delete-btn:hover {
          color: #ef4444;
        }
      `}</style>
    </div>
  );
};

export default Scheduling;
