import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, HardHat, Calendar, FileText, AlertTriangle, Users, Clock } from 'lucide-react';
import API_BASE_URL from '../../utils/api';

const ClientDashboard = () => {
    const { user, logout } = useAuth();
    const [project, setProject] = useState(null);
    const [diaries, setDiaries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user?.assignedProject) {
            fetchProjectData(user.assignedProject);
        } else {
            setIsLoading(false);
        }
    }, [user]);

    const fetchProjectData = async (projectId) => {
        setIsLoading(true);
        try {
            const [projectRes, diariesRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/projects`),
                fetch(`${API_BASE_URL}/api/projects/${projectId}/diaries`)
            ]);
            
            if (projectRes.ok) {
                const projectsList = await projectRes.json();
                const myProject = projectsList.find(p => (p.id || p._id) === projectId);
                setProject(myProject);
            }
            if (diariesRes.ok) {
                setDiaries(await diariesRes.json());
            }
        } catch (err) {
            console.error("Failed to fetch project data", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="client-dashboard-container">
            <header className="client-header">
                <div className="client-brand">
                    <div className="brand-logo">PB</div>
                    <div>
                        <h1>Porchelvan Builders</h1>
                        <p className="subtitle">Client Portal</p>
                    </div>
                </div>
                <div className="client-user-actions">
                    <span className="user-email">{user?.email}</span>
                    <button onClick={logout} className="logout-btn">
                        <LogOut size={16} /> <span className="hide-mobile">Log Out</span>
                    </button>
                </div>
            </header>
            
            <main className="client-main">
                {isLoading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                    </div>
                ) : !user?.assignedProject ? (
                    <div className="card pending-card animate-fade-in">
                        <Clock size={48} className="pending-icon" />
                        <h2>Pending Admin Confirmation</h2>
                        <p>
                            Your account has been successfully created, but you haven't been assigned to a project yet. 
                            Please wait for the site administrator to review your account and link it to your construction project.
                        </p>
                        <p className="help-text">If you believe this is an error, please contact our support team.</p>
                    </div>
                ) : project ? (
                    <div className="project-view animate-fade-in">
                        {/* Project Header Card */}
                        <div className="card project-header-card">
                            <div className="project-title-row">
                                <h2>{project.title}</h2>
                                <span className={`status-badge status-${project.status.toLowerCase()}`}>
                                    {project.status}
                                </span>
                            </div>
                            <p className="project-desc">{project.description}</p>
                        </div>

                        {/* Diaries Section */}
                        <div className="diaries-section">
                            <h3 className="section-title">Project Progress Logs</h3>
                            
                            {diaries.length === 0 ? (
                                <div className="card empty-diaries">
                                    <FileText size={40} className="empty-icon" />
                                    <p>No daily logs have been recorded for this project yet.</p>
                                </div>
                            ) : (
                                <div className="diaries-grid">
                                    {diaries.map(d => (
                                        <div key={d.id || d._id} className="card diary-card">
                                            <div className="diary-header">
                                                <div className="diary-date">
                                                    <Calendar size={18} className="date-icon" />
                                                    {new Date(d.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                </div>
                                                <div className="diary-weather">
                                                    🌤️ {d.weather || 'Unknown'}
                                                </div>
                                            </div>
                                            <div className="diary-content">
                                                <div className="content-block">
                                                    <h4><FileText size={14} /> Work Completed</h4>
                                                    <p>{d.workCompleted}</p>
                                                </div>
                                                {d.issues && (
                                                    <div className="content-block issues-block">
                                                        <h4><AlertTriangle size={14} /> Issues / Delays</h4>
                                                        <p>{d.issues}</p>
                                                    </div>
                                                )}
                                                <div className="content-block">
                                                    <h4><Users size={14} /> Workforce</h4>
                                                    <p>{d.workersPresent} active personnel on site</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="card error-state">Project details could not be loaded.</div>
                )}
            </main>

            <style>{`
                .client-dashboard-container {
                    min-height: 100vh;
                    background-color: #f8fafc;
                    display: flex;
                    flex-direction: column;
                    font-family: 'Inter', sans-serif;
                }

                .client-header {
                    background-color: white;
                    border-bottom: 1px solid #e2e8f0;
                    padding: 1rem 2rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    position: sticky;
                    top: 0;
                    z-index: 50;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.02);
                }

                .client-brand {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .brand-logo {
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, #F97316 0%, #EA580C 100%);
                    color: white;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 800;
                    font-size: 1.1rem;
                }

                .client-brand h1 {
                    margin: 0;
                    font-size: 1.25rem;
                    font-weight: 800;
                    color: #0f172a;
                    letter-spacing: -0.5px;
                }

                .subtitle {
                    margin: 0;
                    font-size: 0.8rem;
                    color: #64748b;
                    font-weight: 500;
                }

                .client-user-actions {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }

                .user-email {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: #475569;
                }

                .logout-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: #f1f5f9;
                    border: 1px solid #e2e8f0;
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    color: #64748b;
                    font-size: 0.85rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .logout-btn:hover {
                    background: #fef2f2;
                    border-color: #fca5a5;
                    color: #ef4444;
                }

                .client-main {
                    flex: 1;
                    padding: 2rem;
                    max-width: 1100px;
                    margin: 0 auto;
                    width: 100%;
                }

                .card {
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
                    border: 1px solid #e2e8f0;
                    padding: 2rem;
                }

                .pending-card {
                    text-align: center;
                    max-width: 600px;
                    margin: 4rem auto;
                    padding: 3rem 2rem;
                }

                .pending-icon {
                    color: #F97316;
                    opacity: 0.8;
                    margin-bottom: 1.5rem;
                }

                .pending-card h2 {
                    font-size: 1.75rem;
                    color: #0f172a;
                    margin-bottom: 1rem;
                }

                .pending-card p {
                    color: #475569;
                    line-height: 1.7;
                    margin-bottom: 2rem;
                }

                .help-text {
                    font-size: 0.85rem !important;
                    color: #94a3b8 !important;
                    margin-bottom: 0 !important;
                }

                .project-header-card {
                    margin-bottom: 2rem;
                    background: linear-gradient(to right, white, #fafafa);
                }

                .project-title-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                .project-title-row h2 {
                    font-size: 2rem;
                    color: #0f172a;
                    margin: 0;
                    letter-spacing: -0.5px;
                }

                .status-badge {
                    padding: 0.35rem 1rem;
                    border-radius: 50px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .status-ongoing { background: #ffedd5; color: #ea580c; border: 1px solid #fed7aa; }
                .status-completed { background: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0; }
                .status-planned { background: #e0f2fe; color: #0284c7; border: 1px solid #bae6fd; }

                .project-desc {
                    color: #475569;
                    font-size: 1.1rem;
                    line-height: 1.6;
                }

                .section-title {
                    font-size: 1.5rem;
                    color: #0f172a;
                    margin-bottom: 1.5rem;
                }

                .diaries-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .diary-card {
                    padding: 0;
                    overflow: hidden;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }

                .diary-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                }

                .diary-header {
                    background: #f8fafc;
                    padding: 1rem 1.5rem;
                    border-bottom: 1px solid #e2e8f0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .diary-date {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-weight: 700;
                    color: #1e293b;
                }

                .date-icon {
                    color: #F97316;
                }

                .diary-weather {
                    font-size: 0.85rem;
                    font-weight: 600;
                    background: white;
                    padding: 0.25rem 0.75rem;
                    border-radius: 50px;
                    border: 1px solid #e2e8f0;
                    color: #64748b;
                }

                .diary-content {
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                }

                .content-block h4 {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    color: #94a3b8;
                    margin: 0 0 0.5rem 0;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .content-block p {
                    color: #334155;
                    margin: 0;
                    line-height: 1.6;
                }

                .issues-block h4 {
                    color: #f87171;
                }

                .empty-diaries {
                    text-align: center;
                    padding: 4rem 2rem;
                    color: #64748b;
                }

                .empty-icon {
                    color: #F97316;
                    opacity: 0.4;
                    margin-bottom: 1rem;
                }

                .loading-state {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 300px;
                }

                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid #e2e8f0;
                    border-top-color: #F97316;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                .animate-fade-in {
                    animation: fadeIn 0.5s ease-out;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @media (max-width: 768px) {
                    .hide-mobile { display: none; }
                    .client-header { padding: 1rem; }
                    .client-main { padding: 1rem; }
                    .project-title-row { flex-direction: column; align-items: flex-start; }
                }
            `}</style>
        </div>
    );
};

export default ClientDashboard;
