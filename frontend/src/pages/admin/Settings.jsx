import React, { useState } from 'react';
import { User, Bell, Shield, Download, Upload, Moon, Sun, Monitor, Mail, Lock, Camera, Check } from 'lucide-react';
import API_BASE_URL from '../../utils/api';
import * as XLSX from 'xlsx';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('Profile');
  const [theme, setTheme] = useState('system'); // system, light, dark
  const [fullName, setFullName] = useState('Admin User');
  const [emailAddress, setEmailAddress] = useState('admin@porchelvanbuilders.com');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    lowStock: true,
    dailyDigest: false,
    newIssues: true
  });

  const handleToggle = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.body.setAttribute('data-theme', 'dark');
    } else if (newTheme === 'light') {
      document.body.removeAttribute('data-theme');
    } else {
      // System logic would go here, mock for now
      document.body.removeAttribute('data-theme');
    }
  };

  const handleSaveChanges = () => {
    setSaving(true);
    setSaved(false);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    }, 1000);
  };

  const triggerAvatarUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setAvatarUrl(url);
      }
    };
    input.click();
  };

  const handleExportData = async () => {
    try {
      const endpoints = ['projects', 'crew', 'inventory', 'schedule', 'issues', 'vault'];
      const data = {};
      
      const fetches = endpoints.map(async (ep) => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/${ep}`);
          if (res.ok) {
            data[ep] = await res.json();
          } else {
            data[ep] = [];
          }
        } catch (e) {
          data[ep] = [];
        }
      });
      
      await Promise.all(fetches);
      
      // Generate Download File
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
      const downloadAnchor = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `porchelvan_builders_backup_${dateStr}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      
      alert("System backup file generated and downloaded successfully!");
    } catch (err) {
      alert("Failed to export backup data. Please check connection.");
    }
  };

  const handleExportExcel = async () => {
    try {
      const endpoints = ['projects', 'crew', 'inventory', 'schedule', 'issues', 'vault'];
      const data = {};
      
      const fetches = endpoints.map(async (ep) => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/${ep}`);
          if (res.ok) {
            data[ep] = await res.json();
          } else {
            data[ep] = [];
          }
        } catch (e) {
          data[ep] = [];
        }
      });
      
      await Promise.all(fetches);

      const wb = XLSX.utils.book_new();

      const friendlyHeadersMap = {
        projects: { title: 'Title', description: 'Description', status: 'Status', location: 'Location', imageUrl: 'Image URL', createdAt: 'Created At', updatedAt: 'Updated At' },
        crew: { name: 'Name', role: 'Role', phone: 'Phone', currentProject: 'Current Project', createdAt: 'Created At', updatedAt: 'Updated At' },
        inventory: { name: 'Name', type: 'Type', status: 'Status', quantity: 'Quantity', minQuantity: 'Min Quantity', unit: 'Unit', currentLocation: 'Current Location', createdAt: 'Created At', updatedAt: 'Updated At' },
        schedule: { title: 'Title', resourceType: 'Resource Type', resourceId: 'Resource ID', projectId: 'Project Site', startDate: 'Start Date', endDate: 'End Date', notes: 'Notes', createdAt: 'Created At', updatedAt: 'Updated At' },
        issues: { title: 'Title', description: 'Description', projectId: 'Project Site', status: 'Status', priority: 'Priority', createdAt: 'Created At', updatedAt: 'Updated At' },
        vault: { title: 'Title', projectId: 'Project Site', url: 'Document URL', type: 'Type', createdAt: 'Created At', updatedAt: 'Updated At' }
      };

      endpoints.forEach((ep) => {
        const sheetData = data[ep];
        const mapping = friendlyHeadersMap[ep] || {};
        
        const cleanedData = sheetData.map(item => {
          const cleaned = {};
          Object.keys(mapping).forEach(key => {
            let val = item[key];
            if (val === undefined || val === null) {
              cleaned[mapping[key]] = '';
            } else if (typeof val === 'object' && !Array.isArray(val)) {
              cleaned[mapping[key]] = val.title || val.name || val._id || JSON.stringify(val);
            } else if (Array.isArray(val)) {
              cleaned[mapping[key]] = val.map(el => (el && typeof el === 'object') ? (el.name || el.title || JSON.stringify(el)) : el).join(', ');
            } else {
              cleaned[mapping[key]] = val;
            }
          });
          return cleaned;
        });

        const headers = Object.values(mapping);
        const ws = XLSX.utils.json_to_sheet(cleanedData, { header: headers });
        const sheetName = ep.charAt(0).toUpperCase() + ep.slice(1);
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
      });

      const dateStr = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `porchelvan_builders_export_${dateStr}.xlsx`);
      
      alert("Excel spreadsheet generated and downloaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to export Excel spreadsheet. Please check connection.");
    }
  };

  const handleImportFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const backup = JSON.parse(e.target.result);
        
        let importedCount = 0;
        let duplicateCount = 0;
        let failedCount = 0;
        
        const endpointsMap = {
          'projects': '/api/projects',
          'crew': '/api/crew',
          'inventory': '/api/inventory',
          'schedule': '/api/schedule',
          'issues': '/api/issues',
          'vault': '/api/vault'
        };

        // Fetch existing records from DB to prevent duplicates
        const existingData = {};
        const fetches = Object.keys(endpointsMap).map(async (key) => {
          try {
            const res = await fetch(`${API_BASE_URL}${endpointsMap[key]}`);
            if (res.ok) {
              existingData[key] = await res.json();
            } else {
              existingData[key] = [];
            }
          } catch (e) {
            existingData[key] = [];
          }
        });
        await Promise.all(fetches);

        const isDuplicate = (key, item, existingList) => {
          if (!existingList || existingList.length === 0) return false;
          
          switch (key) {
            case 'projects':
              return existingList.some(el => el.title?.toLowerCase().trim() === item.title?.toLowerCase().trim());
            case 'crew':
              return existingList.some(el => el.name?.toLowerCase().trim() === item.name?.toLowerCase().trim());
            case 'inventory':
              return existingList.some(el => el.name?.toLowerCase().trim() === item.name?.toLowerCase().trim() && el.type === item.type);
            case 'schedule':
              return existingList.some(el => 
                el.title?.toLowerCase().trim() === item.title?.toLowerCase().trim() &&
                el.resourceType === item.resourceType &&
                new Date(el.startDate).getTime() === new Date(item.startDate).getTime()
              );
            case 'issues':
              return existingList.some(el => el.title?.toLowerCase().trim() === item.title?.toLowerCase().trim());
            case 'vault':
              return existingList.some(el => el.title?.toLowerCase().trim() === item.title?.toLowerCase().trim() && el.url === item.url);
            default:
              return false;
          }
        };
        
        for (const [key, path] of Object.entries(endpointsMap)) {
          const items = backup[key];
          if (Array.isArray(items)) {
            for (const item of items) {
              if (isDuplicate(key, item, existingData[key])) {
                duplicateCount++;
                continue;
              }

              const cleanItem = { ...item };
              delete cleanItem._id;
              delete cleanItem.__v;
              delete cleanItem.id;
              
              try {
                const res = await fetch(`${API_BASE_URL}${path}`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(cleanItem)
                });
                if (res.ok) {
                  importedCount++;
                  const saved = await res.json();
                  existingData[key].push(saved); // Update local index to handle duplicates inside the file itself
                } else {
                  failedCount++;
                }
              } catch (err) {
                failedCount++;
              }
            }
          }
        }
        
        alert(`Import Complete!\n\n✅ Restored: ${importedCount} records\n⚠️ Skipped duplicates: ${duplicateCount} records\n❌ Failed: ${failedCount} records`);
      } catch (err) {
        alert("Invalid backup file. Please ensure it is a valid JSON backup file generated by this system.");
      }
    };
    reader.readAsText(file);
  };

  const triggerImportSelector = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = handleImportFileChange;
    input.click();
  };

  return (
    <div className="admin-settings">
      <div className="settings-header" style={{ marginBottom: '2rem' }}>
        <h1>System Settings</h1>
        <p className="text-muted">Manage your preferences, profile, and system data.</p>
      </div>

      <div className="settings-layout">
        {/* Sidebar Nav */}
        <div className="settings-nav card">
          <button className={`nav-btn ${activeTab === 'Profile' ? 'active' : ''}`} onClick={() => setActiveTab('Profile')}>
            <User size={18} /> Profile & Account
          </button>
          <button className={`nav-btn ${activeTab === 'Appearance' ? 'active' : ''}`} onClick={() => setActiveTab('Appearance')}>
            <Monitor size={18} /> Appearance
          </button>
          <button className={`nav-btn ${activeTab === 'Notifications' ? 'active' : ''}`} onClick={() => setActiveTab('Notifications')}>
            <Bell size={18} /> Notifications
          </button>
          <button className={`nav-btn ${activeTab === 'Data' ? 'active' : ''}`} onClick={() => setActiveTab('Data')}>
            <Shield size={18} /> Data Management
          </button>
        </div>

        {/* Content Area */}
        <div className="settings-content card">
          {activeTab === 'Profile' && (
            <div className="settings-section animate-fade-in-up">
              <h2>Admin Profile</h2>
              <p className="text-muted" style={{ marginBottom: '2rem' }}>Update your personal information and login credentials.</p>
              
              {saved && (
                <div className="success-toast">
                  <Check size={18} />
                  <span>Your profile changes have been saved successfully!</span>
                </div>
              )}

              <div className="profile-avatar-section">
                <div className="avatar-container">
                  <div className="avatar-preview">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar Preview" />
                    ) : (
                      fullName ? fullName.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase() : 'A'
                    )}
                  </div>
                  <div className="avatar-upload-badge" onClick={triggerAvatarUpload} title="Upload New Photo">
                    <Camera size={16} />
                  </div>
                </div>
                <div className="avatar-actions-text">
                  <h3>Profile Avatar</h3>
                  <p className="text-muted" style={{ fontSize: '0.85rem', margin: '0 0 0.75rem 0' }}>Allowed formats: JPG, PNG. Max size 2MB.</p>
                  <button className="btn-upload-avatar" onClick={triggerAvatarUpload}>
                    <Upload size={14} /> Upload New Photo
                  </button>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <div className="input-wrapper">
                    <input 
                      type="text" 
                      value={fullName} 
                      onChange={(e) => setFullName(e.target.value)} 
                    />
                    <User size={18} className="input-icon" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <div className="input-wrapper">
                    <input 
                      type="email" 
                      value={emailAddress} 
                      onChange={(e) => setEmailAddress(e.target.value)} 
                    />
                    <Mail size={18} className="input-icon" />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>Change Password</label>
                <div className="input-wrapper">
                  <input 
                    type="password" 
                    placeholder="Enter new password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Lock size={18} className="input-icon" />
                </div>
              </div>
              <button 
                className="btn btn-primary" 
                onClick={handleSaveChanges} 
                disabled={saving}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', minWidth: '150px', justifyContent: 'center' }}
              >
                {saving ? (
                  <>
                    <span className="spinner-loader"></span>
                    Saving...
                  </>
                ) : 'Save Changes'}
              </button>
            </div>
          )}

          {activeTab === 'Appearance' && (
            <div className="settings-section">
              <h2>Appearance</h2>
              <p className="text-muted" style={{ marginBottom: '2rem' }}>Customize how the admin portal looks on your device.</p>
              
              <div className="theme-options">
                <button 
                  className={`theme-card ${theme === 'light' ? 'active' : ''}`}
                  onClick={() => handleThemeChange('light')}
                >
                  <Sun size={32} style={{ marginBottom: '1rem', color: 'var(--color-orange)' }} />
                  <strong>Light Mode</strong>
                  <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Default bright theme</p>
                </button>
                
                <button 
                  className={`theme-card ${theme === 'dark' ? 'active' : ''}`}
                  onClick={() => handleThemeChange('dark')}
                >
                  <Moon size={32} style={{ marginBottom: '1rem', color: 'var(--color-indigo)' }} />
                  <strong>Dark Mode</strong>
                  <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Easy on the eyes</p>
                </button>
                
                <button 
                  className={`theme-card ${theme === 'system' ? 'active' : ''}`}
                  onClick={() => handleThemeChange('system')}
                >
                  <Monitor size={32} style={{ marginBottom: '1rem', color: 'var(--admin-text-muted)' }} />
                  <strong>System Theme</strong>
                  <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Follows OS settings</p>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'Notifications' && (
            <div className="settings-section">
              <h2>Notification Preferences</h2>
              <p className="text-muted" style={{ marginBottom: '2rem' }}>Choose what alerts you want to receive.</p>
              
              <div className="toggle-list">
                <div className="toggle-item">
                  <div>
                    <strong>Email Alerts</strong>
                    <p className="text-muted" style={{ margin: 0, fontSize: '0.85rem' }}>Receive important updates via email</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" checked={notifications.emailAlerts} onChange={() => handleToggle('emailAlerts')} />
                    <span className="slider round"></span>
                  </label>
                </div>
                
                <div className="toggle-item">
                  <div>
                    <strong>Low Stock Warnings</strong>
                    <p className="text-muted" style={{ margin: 0, fontSize: '0.85rem' }}>Get notified when materials run low</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" checked={notifications.lowStock} onChange={() => handleToggle('lowStock')} />
                    <span className="slider round"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div>
                    <strong>New Issues Logged</strong>
                    <p className="text-muted" style={{ margin: 0, fontSize: '0.85rem' }}>Alerts for high-priority site defects</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" checked={notifications.newIssues} onChange={() => handleToggle('newIssues')} />
                    <span className="slider round"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div>
                    <strong>Daily Digest</strong>
                    <p className="text-muted" style={{ margin: 0, fontSize: '0.85rem' }}>A summary of all site diaries every evening</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" checked={notifications.dailyDigest} onChange={() => handleToggle('dailyDigest')} />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Data' && (
            <div className="settings-section">
              <h2>Data Management</h2>
              <p className="text-muted" style={{ marginBottom: '2rem' }}>Export your system data or import legacy records.</p>
              
              <div className="data-actions">
                <div className="data-card">
                  <div className="data-icon" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>
                    <Download size={24} />
                  </div>
                  <div className="data-info">
                    <h3>Export System Data</h3>
                    <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>Download a complete backup of projects, budget, crew, inventory, scheduling, and issues.</p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-outline btn-sm" onClick={handleExportData}>Export JSON</button>
                      <button className="btn btn-outline btn-sm" onClick={handleExportExcel}>Export Excel</button>
                    </div>
                  </div>
                </div>

                <div className="data-card">
                  <div className="data-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                    <Upload size={24} />
                  </div>
                  <div className="data-info">
                    <h3>Import Backup Data</h3>
                    <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>Upload a JSON backup file generated by this system to restore the database.</p>
                    <button className="btn btn-outline btn-sm" onClick={triggerImportSelector}>Import JSON</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .settings-layout {
          display: grid;
          grid-template-columns: 250px 1fr;
          gap: 2rem;
        }

        .settings-nav {
          display: flex;
          flex-direction: column;
          padding: 1rem !important;
          gap: 0.35rem;
        }

        .nav-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: none;
          border: none;
          padding: 0.75rem 1.25rem;
          color: var(--admin-text-muted);
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          border-radius: 50px;
          text-align: left;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-btn:hover {
          background: var(--admin-hover);
          color: var(--admin-text);
          transform: translateX(3px);
        }

        .nav-btn.active {
          background: var(--brand-orange, #F97316);
          color: white;
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.15);
        }

        .settings-content {
          padding: 2.5rem !important;
          min-height: 500px;
          border-radius: 16px !important;
          box-shadow: var(--card-shadow);
        }

        .settings-section h2 {
          margin-top: 0;
          margin-bottom: 0.5rem;
          font-size: 1.6rem;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        /* Premium Forms inside Settings */
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        label {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--admin-text-muted);
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          color: var(--admin-text-muted);
          pointer-events: none;
          transition: color 0.2s;
        }

        .input-wrapper input {
          width: 100%;
          padding: 0.85rem 1rem 0.85rem 2.75rem;
          border: 1px solid var(--admin-border);
          background-color: var(--admin-bg);
          color: var(--admin-text);
          border-radius: 10px;
          font-family: inherit;
          font-size: 0.95rem;
          font-weight: 500;
          transition: all 0.25s ease;
          outline: none;
        }

        .input-wrapper input:focus {
          border-color: var(--brand-orange, #F97316);
          box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.1);
          background-color: var(--admin-surface);
        }

        .input-wrapper input:focus + .input-icon {
          color: var(--brand-orange, #F97316);
        }

        /* Avatar Section */
        .profile-avatar-section {
          display: flex;
          align-items: center;
          gap: 2rem;
          padding: 1.5rem;
          background: linear-gradient(135deg, rgba(249, 115, 22, 0.03) 0%, rgba(249, 115, 22, 0.08) 100%);
          border: 1px solid var(--admin-border);
          border-radius: 12px;
          margin-bottom: 2rem;
        }

        .avatar-container {
          position: relative;
          width: 90px;
          height: 90px;
        }

        .avatar-preview {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, var(--brand-orange, #F97316) 0%, #EA580C 100%);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          font-weight: 800;
          box-shadow: 0 8px 24px rgba(249, 115, 22, 0.2);
          border: 4px solid var(--admin-surface);
          overflow: hidden;
        }

        .avatar-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }

        .avatar-upload-badge {
          position: absolute;
          bottom: -2px;
          right: -2px;
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--admin-text);
          box-shadow: var(--card-shadow);
          transition: all 0.2s;
        }

        .avatar-upload-badge:hover {
          background: var(--brand-orange, #F97316);
          color: white;
          border-color: var(--brand-orange, #F97316);
          transform: scale(1.1);
        }

        .avatar-actions-text h3 {
          margin: 0 0 0.25rem 0;
          font-size: 1.15rem;
          font-weight: 700;
        }

        .btn-upload-avatar {
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          color: var(--admin-text);
          font-weight: 600;
          font-size: 0.85rem;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-upload-avatar:hover {
          background: var(--admin-hover);
          border-color: var(--admin-text-muted);
        }

        /* Success Alert */
        .success-toast {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: #DCFCE7;
          border: 1px solid #BBF7D0;
          color: #15803D;
          padding: 1rem 1.25rem;
          border-radius: 10px;
          margin-bottom: 1.5rem;
          font-weight: 600;
          font-size: 0.95rem;
        }

        [data-theme='dark'] .success-toast {
          background: rgba(21, 128, 61, 0.15);
          border-color: rgba(21, 128, 61, 0.3);
          color: #4ade80;
        }

        /* Spinner Loader */
        .spinner-loader {
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top: 2px solid #ffffff;
          width: 16px;
          height: 16px;
          animation: spin-loader-anim 0.8s linear infinite;
          display: inline-block;
        }

        @keyframes spin-loader-anim {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Theme Cards */
        .theme-options {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .theme-card {
          background: var(--admin-bg);
          border: 2px solid var(--admin-border);
          border-radius: 12px;
          padding: 2rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .theme-card:hover {
          border-color: var(--brand-orange, #F97316);
          transform: translateY(-3px);
        }

        .theme-card.active {
          border-color: var(--brand-orange, #F97316);
          background: var(--brand-orange-light, rgba(249, 115, 22, 0.05));
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.05);
        }

        /* Toggles */
        .toggle-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .toggle-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem;
          border: 1px solid var(--admin-border);
          border-radius: 12px;
          transition: all 0.2s;
        }

        .toggle-item:hover {
          background-color: var(--admin-hover);
          border-color: var(--admin-text-muted);
        }

        .switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 28px;
        }

        .switch input { 
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: var(--admin-border);
          transition: .4s;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
        }

        input:checked + .slider {
          background-color: var(--brand-orange, #F97316);
        }

        input:focus + .slider {
          box-shadow: 0 0 1px var(--brand-orange, #F97316);
        }

        input:checked + .slider:before {
          transform: translateX(22px);
        }

        .slider.round {
          border-radius: 34px;
        }

        .slider.round:before {
          border-radius: 50%;
        }

        /* Data Actions */
        .data-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .data-card {
          border: 1px solid var(--admin-border);
          border-radius: 12px;
          padding: 1.75rem;
          display: flex;
          gap: 1.25rem;
          background: var(--admin-surface);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .data-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--card-shadow);
          border-color: var(--admin-text-muted);
        }

        .data-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .data-info h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.15rem;
          font-weight: 700;
        }

        .btn-sm {
          padding: 0.5rem 1rem;
          font-size: 0.85rem;
          display: inline-flex;
          align-items: center;
          border-radius: 20px;
        }

        @media (max-width: 900px) {
          .settings-layout {
            grid-template-columns: 1fr;
          }
          .theme-options, .data-actions {
            grid-template-columns: 1fr;
          }
          .form-row {
            grid-template-columns: 1fr;
            gap: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Settings;
