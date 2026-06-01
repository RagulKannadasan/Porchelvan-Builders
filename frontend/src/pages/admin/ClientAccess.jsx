import React, { useState, useEffect } from 'react';
import { UserCheck, Clock, ShieldAlert } from 'lucide-react';
import API_BASE_URL from '../../utils/api';

const ClientAccess = () => {
    const [clients, setClients] = useState([]);
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchClientsAndProjects();
    }, []);

    const fetchClientsAndProjects = async () => {
        setIsLoading(true);
        try {
            const [clientsRes, projectsRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/users/clients`),
                fetch(`${API_BASE_URL}/api/projects`)
            ]);
            
            if (clientsRes.ok && projectsRes.ok) {
                setClients(await clientsRes.json());
                setProjects(await projectsRes.json());
            }
        } catch (err) {
            console.error("Failed to fetch data", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAssignProject = async (clientId, projectId) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/users/clients/${clientId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ assignedProject: projectId || null })
            });
            if (res.ok) {
                fetchClientsAndProjects();
            }
        } catch (err) {
            console.error("Failed to assign project", err);
        }
    };

    return (
        <div className="admin-clients">
            <div className="clients-header">
                <div>
                    <h1>Client Access Management</h1>
                    <p className="text-muted">Review registered clients and assign them to their respective projects.</p>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h3>Registered Client Accounts</h3>
                </div>
                
                {isLoading ? (
                    <div className="admin-loading-state">
                        <div className="admin-spinner"></div>
                        <p>Loading clients...</p>
                    </div>
                ) : clients.length === 0 ? (
                    <div className="empty-state" style={{ padding: '4rem 2rem' }}>
                        <UserCheck size={48} style={{ opacity: 0.5 }} />
                        <h3>No Clients Registered Yet</h3>
                        <p className="text-muted">When clients log in for the first time via OTP, they will appear here.</p>
                    </div>
                ) : (
                    <div className="clients-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Client Email</th>
                                    <th>Registration Date</th>
                                    <th>Status</th>
                                    <th>Assigned Project</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clients.map(client => {
                                    const clientId = client.id || client._id;
                                    const isPending = !client.assignedProject;
                                    
                                    return (
                                        <tr key={clientId}>
                                            <td className="font-medium">{client.email}</td>
                                            <td>{new Date(client.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                {isPending ? (
                                                    <span className="badge badge-warning" style={{ background: 'rgba(234, 179, 8, 0.1)', color: '#EAB308', border: '1px solid rgba(234, 179, 8, 0.2)' }}>
                                                        <Clock size={12} style={{ marginRight: '4px', display: 'inline' }} /> Pending Assignment
                                                    </span>
                                                ) : (
                                                    <span className="badge badge-success" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22C55E', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                                                        <UserCheck size={12} style={{ marginRight: '4px', display: 'inline' }} /> Confirmed Access
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                <select 
                                                    className="form-select" 
                                                    value={client.assignedProject || ""} 
                                                    onChange={(e) => handleAssignProject(clientId, e.target.value)}
                                                    style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--admin-border)', width: '100%', maxWidth: '250px' }}
                                                >
                                                    <option value="">-- Revoke Access (No Project) --</option>
                                                    {projects.map(p => (
                                                        <option key={p.id || p._id} value={p.id || p._id}>{p.title}</option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <style>{`
                .admin-clients { animation: fadeIn 0.4s ease-out; }
                .clients-header {
                    margin-bottom: 2rem;
                    border-bottom: 1px solid var(--admin-border);
                    padding-bottom: 1.5rem;
                }
                .clients-header h1 {
                    font-size: 2.2rem;
                    font-weight: 800;
                    margin: 0 0 0.5rem 0;
                }
                .card {
                    background: var(--admin-surface);
                    border: 1px solid var(--admin-border);
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
                }
                .card-header {
                    padding: 1.25rem 1.5rem;
                    border-bottom: 1px solid var(--admin-border);
                    background: rgba(255, 255, 255, 0.02);
                }
                .card-header h3 {
                    margin: 0;
                    color: var(--brand-orange, #F97316);
                }
                .admin-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .admin-table th, .admin-table td {
                    padding: 1rem 1.5rem;
                    text-align: left;
                    border-bottom: 1px solid var(--admin-border);
                }
                .admin-table th {
                    font-weight: 600;
                    color: var(--admin-text-muted);
                    font-size: 0.85rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .admin-table tr:hover td {
                    background: rgba(0, 0, 0, 0.02);
                }
                .badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 0.25rem 0.75rem;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 700;
                }
            `}</style>
        </div>
    );
};

export default ClientAccess;
