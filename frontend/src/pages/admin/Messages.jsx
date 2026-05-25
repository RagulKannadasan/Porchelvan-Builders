import React, { useState, useEffect } from 'react';
import { Mail, Phone, Calendar, User, FileText, CheckCircle, Clock, Archive } from 'lucide-react';
import API_BASE_URL from '../../utils/api';

const Messages = () => {
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/inquiries`);
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      }
    } catch (err) {
      console.error("Failed to fetch inquiries");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchInquiries();
        if (selectedInquiry && selectedInquiry._id === id) {
          setSelectedInquiry({ ...selectedInquiry, status: newStatus });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'var(--brand-orange)';
      case 'Contacted': return '#10B981';
      case 'Archived': return 'var(--admin-text-muted)';
      default: return 'var(--admin-text-muted)';
    }
  };

  return (
    <div className="admin-messages">
      <div className="messages-header">
        <div>
          <h1>Client Messages & Leads</h1>
          <p className="text-muted">Manage incoming inquiries from the public website.</p>
        </div>
      </div>

      <div className="messages-layout">
        {/* Inquiries List Column */}
        <div className="messages-list-col">
          <div className="card">
            <div className="card-header">
              <h3>All Inquiries</h3>
            </div>
            <div className="inquiry-list">
              {inquiries.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
                  No messages found.
                </div>
              ) : (
                inquiries.map(iq => (
                  <div 
                    key={iq._id} 
                    className={`inquiry-item ${selectedInquiry?._id === iq._id ? 'selected' : ''}`}
                    onClick={() => setSelectedInquiry(iq)}
                  >
                    <div className="inquiry-item-info">
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{iq.firstName} {iq.lastName}</h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                          {new Date(iq.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: 'var(--admin-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {iq.projectType} - {iq.message}
                      </p>
                      <span className="status-badge" style={{ borderColor: getStatusColor(iq.status), color: getStatusColor(iq.status), backgroundColor: `${getStatusColor(iq.status)}15` }}>
                        {iq.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Inquiry Details Column */}
        <div className="message-details-col">
          {selectedInquiry ? (
            <div className="card detail-card">
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Message Details</h3>
                <div className="status-actions">
                  <select 
                    value={selectedInquiry.status} 
                    onChange={(e) => handleStatusChange(selectedInquiry._id, e.target.value)}
                    style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--admin-border)', background: 'var(--admin-bg)', color: 'var(--admin-text)' }}
                  >
                    <option value="New">Mark as New</option>
                    <option value="Contacted">Mark as Contacted</option>
                    <option value="Archived">Archive</option>
                  </select>
                </div>
              </div>
              
              <div className="card-body">
                <div className="detail-header">
                  <div className="avatar">{selectedInquiry.firstName.charAt(0)}{selectedInquiry.lastName.charAt(0)}</div>
                  <div>
                    <h2 style={{ margin: 0 }}>{selectedInquiry.firstName} {selectedInquiry.lastName}</h2>
                    <p style={{ margin: 0, color: 'var(--admin-text-muted)' }}>Submitted on {new Date(selectedInquiry.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="contact-grid">
                  <div className="contact-item">
                    <Mail size={16} />
                    <div>
                      <span>Email</span>
                      <strong>{selectedInquiry.email}</strong>
                    </div>
                  </div>
                  <div className="contact-item">
                    <Phone size={16} />
                    <div>
                      <span>Phone</span>
                      <strong>{selectedInquiry.phone}</strong>
                    </div>
                  </div>
                  <div className="contact-item">
                    <FileText size={16} />
                    <div>
                      <span>Project Type</span>
                      <strong style={{ textTransform: 'capitalize' }}>{selectedInquiry.projectType}</strong>
                    </div>
                  </div>
                </div>

                <div className="message-body">
                  <h4>Message</h4>
                  <div className="message-content">
                    {selectedInquiry.message}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <Mail size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <h3>Select a Message</h3>
              <p className="text-muted">Choose an inquiry from the left to view details.</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .messages-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .messages-layout {
          display: grid;
          grid-template-columns: 1fr 2.5fr;
          gap: 2rem;
        }
        .inquiry-list {
          max-height: 600px;
          overflow-y: auto;
        }
        .inquiry-item {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--admin-border);
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .inquiry-item:hover {
          background-color: var(--admin-hover);
        }
        .inquiry-item.selected {
          border-left: 4px solid var(--brand-orange);
          background-color: var(--admin-hover);
        }
        .status-badge {
          display: inline-block;
          padding: 0.2rem 0.6rem;
          font-size: 0.7rem;
          font-weight: 700;
          border-radius: 50px;
          border: 1px solid;
          text-transform: uppercase;
        }
        
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 500px;
          background: var(--admin-surface);
          border: 1px dashed var(--admin-border);
          border-radius: 12px;
          color: var(--admin-text-muted);
        }
        .empty-state h3 {
          color: var(--admin-text);
          margin-bottom: 0.5rem;
        }

        .card {
          background: var(--admin-surface);
          border-radius: 12px;
          border: 1px solid var(--admin-border);
          overflow: hidden;
          box-shadow: var(--card-shadow);
        }
        .card-header {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--admin-border);
          background: var(--admin-bg);
        }
        .card-header h3 {
          margin: 0;
          font-size: 1.1rem;
        }
        .card-body {
          padding: 2rem;
        }

        .detail-header {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          margin-bottom: 2rem;
        }
        .avatar {
          width: 56px;
          height: 56px;
          background: var(--brand-orange);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: var(--admin-bg);
          border-radius: 12px;
          border: 1px solid var(--admin-border);
        }
        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          color: var(--admin-text-muted);
        }
        .contact-item svg {
          margin-top: 0.1rem;
          color: var(--brand-orange);
        }
        .contact-item span {
          display: block;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.25rem;
        }
        .contact-item strong {
          display: block;
          color: var(--admin-text);
          font-size: 0.95rem;
        }

        .message-body h4 {
          margin: 0 0 1rem 0;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--admin-text-muted);
        }
        .message-content {
          padding: 1.5rem;
          background: var(--admin-bg);
          border-radius: 12px;
          border: 1px solid var(--admin-border);
          line-height: 1.6;
          white-space: pre-wrap;
          font-size: 0.95rem;
        }

        @media (max-width: 992px) {
          .messages-layout {
            grid-template-columns: 1fr;
          }
          .contact-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Messages;
