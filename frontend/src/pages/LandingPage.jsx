import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, Phone, Mail, ArrowRight,
  HardHat, Star, ChevronRight, Menu, X, Users, Building, Activity, Package
} from 'lucide-react';
import API_BASE_URL from '../utils/api';

// I will reuse existing images from the assets folder.
import architectureImg from '../assets/images/external/architecture-drawing-building..png';
import workerImg from '../assets/images/external/architectural-engineering-cons.png';
import civilImg from '../assets/images/external/architectural-engineering-civi.png';
import machineryImg from '../assets/images/external/architectural-engineering-roya.png';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', projectType: 'residential', message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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

  const css = `
    .lp-page { font-family: 'Inter', sans-serif; background: #f8fafc; color: #0f172a; overflow-x: hidden; }
    .lp-page *, .lp-page *::before, .lp-page *::after { box-sizing: border-box; margin: 0; padding: 0; }
    .lp-page a { text-decoration: none; }
    
    /* Variables matching Retonix template */
    .lp-page {
      --primary: #FDBA12; /* Vibrant Yellow */
      --primary-hover: #E5A810;
      --dark-bg: #0B1120; /* Deep Navy */
      --dark-card: #1E293B;
      --text-dark: #0f172a;
      --text-light: #f8fafc;
      --text-muted: #64748b;
      --text-muted-light: #94a3b8;
    }

    .lp-container { max-width: 1280px; margin: 0 auto; padding: 0 2rem; position: relative; }

    /* --- NAV --- */
    .lp-nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      padding: 1.5rem 0; transition: all 0.3s ease;
    }
    .lp-nav.scrolled {
      background: rgba(248, 250, 252, 0.9);
      backdrop-filter: blur(10px);
      padding: 1rem 0;
      border-bottom: 1px solid rgba(0,0,0,0.05);
    }
    .lp-nav-inner { display: flex; align-items: center; justify-content: space-between; height: auto !important; }
    .lp-logo {
      font-family: 'Outfit', 'Space Grotesk', sans-serif; font-weight: 700;
      font-size: 1.5rem; color: var(--text-dark) !important; text-decoration: none;
      display: flex; align-items: center; gap: 0.2rem; margin-bottom: 0 !important; height: auto !important; line-height: 1.2;
    }
    .lp-logo span { color: var(--primary); }
    .lp-nav-links { display: flex; gap: 2.5rem; list-style: none; align-items: center; flex-direction: row !important; position: static !important; background: transparent !important; width: auto !important; box-shadow: none !important; transform: none !important; }
    .lp-nav-links a {
      color: var(--text-dark) !important; text-decoration: none; font-size: 0.9rem !important;
      font-weight: 500 !important; transition: color 0.2s; border: none !important; padding: 0 !important; width: auto !important;
    }
    .lp-nav-links a:hover { color: var(--primary) !important; }
    
    .lp-btn-pill {
      background: var(--primary) !important; color: #000 !important;
      padding: 0.75rem 1.75rem !important; border-radius: 99px !important;
      font-weight: 600 !important; font-size: 0.9rem !important; text-decoration: none;
      border: none !important; cursor: pointer; display: inline-flex; align-items: center; gap: 0.5rem;
      transition: all 0.3s !important; margin: 0 !important; transform: none;
    }
    .lp-btn-pill:hover { background: var(--primary-hover) !important; transform: translateY(-2px) !important; box-shadow: none !important; }

    /* --- HERO --- */
    .lp-hero {
      padding: 10rem 0 6rem; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      position: relative; overflow: hidden; height: auto !important; display: block !important;
    }
    .lp-hero h1 {
      font-family: 'Outfit', 'Space Grotesk', sans-serif;
      font-size: clamp(3rem, 6vw, 5.5rem) !important; font-weight: 700 !important;
      line-height: 1.1 !important; color: var(--text-dark) !important; max-width: 800px;
      margin-bottom: 1.5rem !important;
    }
    .lp-hero p {
      font-size: 1.1rem !important; color: var(--text-muted) !important; max-width: 500px;
      line-height: 1.6 !important; margin-bottom: 2.5rem !important; opacity: 1 !important; font-weight: 400 !important;
    }

    .lp-hero-badge {
      width: 120px; height: 120px; background: var(--primary);
      border-radius: 50%; display: flex; align-items: center; justify-content: center;
      font-weight: 700; text-align: center; font-size: 0.85rem; color: #000;
      animation: spin 20s linear infinite; box-shadow: 0 10px 30px rgba(253,186,18,0.4);
    }
    @keyframes spin { 100% { transform: rotate(360deg); } }

    /* --- ABOUT & STATS --- */
    .lp-about-sec { padding: 6rem 0; background: #fff; }
    .lp-about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
    
    .lp-sec-tag { font-size: 0.85rem; font-weight: 600; color: var(--primary); text-transform: uppercase; margin-bottom: 0.5rem; display: block; }
    .lp-sec-sub { font-size: 1rem; color: var(--text-muted); margin-bottom: 2rem; }
    .lp-about-h2 { font-family: 'Outfit', sans-serif; font-size: 2.25rem !important; font-weight: 700 !important; line-height: 1.3 !important; color: var(--text-dark) !important; margin-bottom: 3rem !important; }
    
    .lp-about-image { border-radius: 24px; overflow: hidden; position: relative; }
    .lp-about-image img { width: 100%; height: 100%; object-fit: cover; display: block; filter: none !important; }
    .lp-about-circle {
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
      width: 100px; height: 100px; background: var(--primary); border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; color: #000;
    }

    .lp-stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .lp-stat-card {
      background: #f8fafc !important; border: 1px solid #e2e8f0 !important; border-radius: 16px !important;
      padding: 2rem !important; display: flex !important; flex-direction: column !important; gap: 0.5rem !important;
      transform: none !important; box-shadow: none !important; transition: transform 0.2s !important;
    }
    .lp-stat-card:hover { transform: translateY(-4px) !important; box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important; }
    .lp-stat-val { font-family: 'Outfit', sans-serif; font-size: 2.5rem; font-weight: 700; color: var(--text-dark); display: flex; align-items: center; justify-content: space-between; }
    .lp-stat-icon { color: var(--text-dark); }
    .lp-stat-title { font-weight: 600; font-size: 1rem; color: var(--text-dark); margin: 0; }
    .lp-stat-desc { font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; }

    /* --- SERVICES (Dark Section) --- */
    .lp-services-sec { padding: 8rem 0; background: var(--dark-bg); color: var(--text-light); }
    .lp-services-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 4rem; }
    .lp-services-header .lp-left { max-width: 500px; }
    .lp-services-header .lp-left p { color: var(--text-muted-light); line-height: 1.6; margin-top: 1rem; margin-bottom: 0; }
    
    .lp-service-list { display: flex; flex-direction: column; gap: 2rem; }
    .lp-service-item {
      display: flex; justify-content: space-between; align-items: center;
      padding-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .lp-service-item:last-child { border-bottom: none; }
    
    .lp-service-info { display: flex; gap: 3rem; flex: 1; }
    .lp-service-num { font-size: 0.9rem; color: var(--primary); font-weight: 600; }
    .lp-service-text h3 { font-family: 'Outfit', sans-serif; font-size: 2rem !important; font-weight: 600 !important; margin-bottom: 1rem !important; max-width: 400px; color: var(--text-light) !important; }
    .lp-service-text p { color: var(--text-muted-light) !important; font-size: 0.9rem !important; max-width: 350px; line-height: 1.6 !important; margin-bottom: 1rem !important; opacity: 1 !important; font-weight: 400 !important; }
    .lp-service-tag { font-size: 1rem; font-weight: 500; color: var(--text-light); }
    
    .lp-service-img { width: 350px; height: 220px; border-radius: 16px; overflow: hidden; position: relative; }
    .lp-service-img img { width: 100%; height: 100%; object-fit: cover; filter: none !important; transition: none !important; }
    .lp-service-img:hover img { filter: none !important; }
    .lp-service-img-btn {
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
      width: 80px; height: 80px; background: var(--primary); border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.8rem; font-weight: 600; color: #000; text-align: center; opacity: 0; transition: opacity 0.3s;
    }
    .lp-service-img:hover .lp-service-img-btn { opacity: 1; }

    /* --- 3D DEMO / MOCKUP SECTION --- */
    .lp-demo-sec { padding: 6rem 0; background: #fff; overflow: hidden; display: none; /* Hidden since it's moved to hero */ }
    
    /* --- FOOTER & CONTACT --- */
    .lp-contact-sec { padding: 6rem 0; background: #f8fafc; }
    .lp-contact-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 4rem; }
    .lp-contact-info { padding: 2rem 0; }
    .lp-contact-item { display: flex; gap: 1rem; margin-bottom: 2rem; }
    .lp-contact-icon { width: 48px; height: 48px; background: rgba(253,186,18,0.1); color: var(--primary); border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .lp-contact-form { background: white !important; padding: 3rem !important; border-radius: 16px !important; border: 1px solid #e2e8f0 !important; box-shadow: 0 10px 30px rgba(0,0,0,0.03) !important; flex-direction: column !important; gap: 0 !important; }
    .lp-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }
    .lp-form-group { margin-bottom: 0 !important; }
    .lp-form-group label { display: block; font-size: 0.8rem !important; font-weight: 600 !important; text-transform: uppercase !important; margin-bottom: 0.5rem !important; color: var(--text-muted) !important; letter-spacing: normal !important; }
    .lp-form-group input, .lp-form-group select, .lp-form-group textarea { width: 100% !important; padding: 0.8rem 1rem !important; border: 1px solid #cbd5e1 !important; border-radius: 8px !important; font-family: inherit !important; background: white !important; color: var(--text-dark) !important; margin-bottom: 0 !important; outline: none !important; }
    .lp-form-group input:focus, .lp-form-group select:focus, .lp-form-group textarea:focus { border-color: var(--primary) !important; box-shadow: none !important; }
    
    .lp-footer { background: var(--dark-bg) !important; color: white !important; padding: 4rem 0 2rem !important; border: none !important; }
    .lp-footer .lp-logo { color: white !important; }
    .lp-foot-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 3rem; margin-bottom: 3rem; }
    .lp-foot-col h4 { font-size: 0.9rem !important; font-weight: 600 !important; margin-bottom: 1.5rem !important; color: var(--primary) !important; }
    .lp-foot-col ul { list-style: none !important; display: block !important; padding: 0 !important; margin: 0 !important; gap: 0 !important; flex-direction: column !important; }
    .lp-foot-col ul li { margin-bottom: 0.8rem !important; flex: none !important; }
    .lp-foot-col ul a { color: var(--text-muted-light) !important; text-decoration: none !important; transition: color 0.2s !important; display: inline !important; padding: 0 !important; border: none !important; font-size: 0.9rem !important; background: transparent !important; }
    .lp-foot-col ul a:hover { color: white !important; box-shadow: none !important; background: transparent !important; }
    .lp-foot-bottom { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2rem; display: flex; justify-content: space-between; color: var(--text-muted-light); font-size: 0.9rem; align-items: center; }

    /* --- RESPONSIVE --- */
    @media (max-width: 1024px) {
      .lp-about-grid, .lp-stats-grid, .lp-contact-grid { grid-template-columns: 1fr; }
      .lp-service-item { flex-direction: column; gap: 2rem; align-items: flex-start; }
      .lp-service-img { width: 100%; }
      .lp-foot-grid { grid-template-columns: 1fr 1fr; }
    }
    @media (max-width: 768px) {
      .lp-nav-links, .lp-nav-btn { display: none !important; }
      .lp-hero { padding: 8rem 0 4rem; }
      .lp-hero h1 { font-size: 2.5rem !important; }
      .lp-hero-float-card, .lp-hero-badge { display: none; }
      .lp-foot-grid { grid-template-columns: 1fr; }
      .lp-form-row { grid-template-columns: 1fr; }
    }
  `;

  return (
    <div className="lp-page">
      <style>{css}</style>

      <nav className={`lp-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="lp-container lp-nav-inner">
          <Link to="/" className="lp-logo">
            Porchelvan<span>|</span>Builders
          </Link>
          <ul className="lp-nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#demo">Plans</a></li>
          </ul>
          <a href="#contact" className="lp-btn-pill lp-nav-btn">
            Discuss Project <ArrowRight size={16} />
          </a>
        </div>
      </nav>

      <section id="home" className="lp-hero">
        <div className="lp-container">
          <h1>Redefining Modern Construction</h1>
          <p>Blending Cutting-Edge Technology with Timeless Craftsmanship to Deliver Exceptional Construction Solutions.</p>
          <a href="#contact" className="lp-btn-pill">
            Discuss Project <ArrowRight size={16} />
          </a>
        </div>
      </section>

      <section id="about" className="lp-about-sec">
        <div className="lp-container">
          <div className="lp-about-grid">
            <div className="lp-about-image">
              <img src={workerImg} alt="Scaffolding" />
              <div className="lp-about-circle">Projects</div>
            </div>
            <div className="lp-about-content">
              <span className="lp-sec-tag">About Us</span>
              <p className="lp-sec-sub">Innovative Solutions for Modern Construction</p>
              <h2 className="lp-about-h2">Committed to Redefining Construction Standards with Innovation, Expertise, and Unwavering Dedication to Excellence</h2>

              <div className="lp-stats-grid">
                <div className="lp-stat-card">
                  <div className="lp-stat-val">5K+ <Users className="lp-stat-icon" size={28} /></div>
                  <h3 className="lp-stat-title">Projects Completed</h3>
                  <div className="lp-stat-desc">Delivering excellence in every build, every time.</div>
                </div>
                <div className="lp-stat-card">
                  <div className="lp-stat-val">250+ <HardHat className="lp-stat-icon" size={28} /></div>
                  <h3 className="lp-stat-title">Skilled Professionals</h3>
                  <div className="lp-stat-desc">Experts driven by precision, passion, and experience.</div>
                </div>
                <div className="lp-stat-card">
                  <div className="lp-stat-val">35+ <Activity className="lp-stat-icon" size={28} /></div>
                  <h3 className="lp-stat-title">Industry Excellence</h3>
                  <div className="lp-stat-desc">Leading with innovative solutions that set standards.</div>
                </div>
                <div className="lp-stat-card">
                  <div className="lp-stat-val">1M+ <Package className="lp-stat-icon" size={28} /></div>
                  <h3 className="lp-stat-title">Tons of Materials</h3>
                  <div className="lp-stat-desc">Providing quality resources to meet all project needs.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="lp-services-sec">
        <div className="lp-container">
          <div className="lp-services-header">
            <div className="lp-left">
              <span className="lp-sec-tag">Our Services</span>
              <p>Porchelvan Builders delivers innovative, quality construction tailored to your vision with a focus on sustainability and excellence.</p>
            </div>
            <a href="#contact" className="lp-btn-pill">
              Explore More <ArrowRight size={16} />
            </a>
          </div>

          <div className="lp-service-list">
            <div className="lp-service-item">
              <div className="lp-service-info">
                <div className="lp-service-num">01</div>
                <div className="lp-service-text">
                  <h3>Architectural Design Services</h3>
                  <p>Our expert team creates modern, functional, and visually captivating architectural designs. We blend creativity with technical precision.</p>
                  <div className="lp-service-tag">Innovative designs</div>
                </div>
              </div>
              <div className="lp-service-img">
                <img src={architectureImg} alt="Architectural Design" />
                <div className="lp-service-img-btn">Read More</div>
              </div>
            </div>

            <div className="lp-service-item">
              <div className="lp-service-info">
                <div className="lp-service-num">02</div>
                <div className="lp-service-text">
                  <h3>Construction Management Services</h3>
                  <p>From start to finish, we handle every aspect of your project with unmatched efficiency. Our services include scheduling, budgeting, and on-site coordination.</p>
                  <div className="lp-service-tag">Efficient management</div>
                </div>
              </div>
              <div className="lp-service-img">
                <img src={machineryImg} alt="Construction Management" />
                <div className="lp-service-img-btn">Read More</div>
              </div>
            </div>

            <div className="lp-service-item">
              <div className="lp-service-info">
                <div className="lp-service-num">03</div>
                <div className="lp-service-text">
                  <h3>Advanced Structural Engineering Expertise</h3>
                  <p>Delivering robust and reliable structural solutions with cutting-edge technology to ensure safety, durability, and efficiency in every build.</p>
                  <div className="lp-service-tag">Strong frameworks</div>
                </div>
              </div>
              <div className="lp-service-img">
                <img src={civilImg} alt="Structural Engineering" />
                <div className="lp-service-img-btn">Read More</div>
              </div>
            </div>
          </div>
        </div>
      </section>



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

      <footer className="lp-footer">
        <div className="lp-container">
          <div className="lp-foot-grid">
            <div className="lp-foot-col">
              <Link to="/" className="lp-logo" style={{ color: 'white', marginBottom: '1.5rem', display: 'inline-block' }}>
                Porchelvan<span style={{ color: 'var(--primary)' }}>|</span>Builders
              </Link>
              <p style={{ color: 'var(--text-muted-light)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Founded by Er. J. Arulmozhiselvan B.E., building the finest structures with projects across the Delta region.
              </p>
            </div>
            <div className="lp-foot-col">
              <h4>Capabilities</h4>
              <ul>
                <li><a href="#">Architectural Design</a></li>
                <li><a href="#">Structural Engineering</a></li>
                <li><a href="#">General Contracting</a></li>
                <li><a href="#">Sustainability</a></li>
              </ul>
            </div>
            <div className="lp-foot-col">
              <h4>Company</h4>
              <ul>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Our Team</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Projects</a></li>
              </ul>
            </div>
            <div className="lp-foot-col">
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="lp-foot-bottom">
            <p>© 2024 Porchelvan Builders Inc. All rights reserved.</p>
            <Link to="/admin" style={{ color: 'var(--text-muted-light)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HardHat size={16} /> Admin Portal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
