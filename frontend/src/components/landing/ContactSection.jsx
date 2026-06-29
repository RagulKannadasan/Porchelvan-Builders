import React, { useState } from 'react';
import { MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import API_BASE_URL from '../../utils/api';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', projectType: 'residential', message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed to submit');
      setSubmitStatus('success');
      setFormData({ firstName: '', lastName: '', email: '', phone: '', projectType: 'residential', message: '' });
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (err) {
      setSubmitStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="lp-contact-sec">
      <div className="lp-container">
        <div className="lp-contact-grid">
          <div className="lp-contact-info">
            <span className="lp-sec-tag">Contact Us</span>
            <h2 className="lp-about-h2" style={{ marginBottom: '1.5rem' }}>Ready to build something lasting?</h2>
            <p className="lp-sec-sub">Tell us about your project. Our team will respond within 24 hours.</p>

            <div className="lp-contact-item">
              <div className="lp-contact-icon"><Phone size={24} /></div>
              <div>
                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Call Us Directly</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>+91 97510 61442</div>
              </div>
            </div>
            <div className="lp-contact-item">
              <div className="lp-contact-icon"><Mail size={24} /></div>
              <div>
                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Email Enquiries</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>porchelvanbuilders.er@gmail.com</div>
              </div>
            </div>
            <div className="lp-contact-item">
              <div className="lp-contact-icon"><MapPin size={24} /></div>
              <div>
                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Head Office</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Orathanadu, Thanjavur - 614625</div>
              </div>
            </div>
          </div>

          <form className="lp-contact-form" onSubmit={handleSubmit}>
            <div className="lp-form-row">
              <div className="lp-form-group">
                <label>First Name</label>
                <input type="text" placeholder="John" required value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
              </div>
              <div className="lp-form-group">
                <label>Last Name</label>
                <input type="text" placeholder="Doe" required value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
              </div>
            </div>
            <div className="lp-form-row">
              <div className="lp-form-group">
                <label>Email Address</label>
                <input type="email" placeholder="john@example.com" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div className="lp-form-group">
                <label>Phone Number</label>
                <input type="tel" placeholder="+91" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
              </div>
            </div>
            <div className="lp-form-group" style={{ marginBottom: '1.5rem' }}>
              <label>Project Type</label>
              <select value={formData.projectType} onChange={e => setFormData({ ...formData, projectType: e.target.value })}>
                <option value="residential">Residential / Custom Home</option>
                <option value="commercial">Commercial Space</option>
                <option value="renovation">Renovation</option>
                <option value="other">Other Inquiry</option>
              </select>
            </div>
            <div className="lp-form-group" style={{ marginBottom: '1.5rem' }}>
              <label>Message</label>
              <textarea rows={4} placeholder="Tell us about your project requirements..." required value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}></textarea>
            </div>

            {submitStatus === 'success' && <div style={{ color: '#10B981', fontSize: '0.9rem', fontWeight: '600', padding: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '4px', marginBottom: '1rem' }}>Thank you! Your inquiry has been submitted.</div>}
            {submitStatus === 'error' && <div style={{ color: '#EF4444', fontSize: '0.9rem', fontWeight: '600', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '4px', marginBottom: '1rem' }}>Failed to send. Please try again.</div>}

            <button type="submit" className="lp-btn-pill" disabled={submitting} style={{ opacity: submitting ? 0.7 : 1, width: '100%', justifyContent: 'center' }}>
              {submitting ? 'Sending...' : 'Post Message'} {!submitting && <ArrowRight size={16} />}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
