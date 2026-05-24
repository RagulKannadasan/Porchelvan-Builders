import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, CheckCircle, Shield, HardHat, Ruler, Star, ArrowRight, Menu, X, Moon, Sun, User, ClipboardList } from 'lucide-react';
import Navbar from '../components/Navbar';

const InstagramIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);
const FacebookIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);
const LinkedinIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);

function LandingPage() {
  const [activeTab, setActiveTab] = useState('Ongoing');

  const projects = [
    { id: 1, title: 'Skyline Residences', status: 'Ongoing', img: 'https://images.unsplash.com/photo-1541888086225-f6404f456108?q=80&w=800', progress: 65 },
    { id: 2, title: 'Tech Hub Office', status: 'Ongoing', img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800', progress: 30 },
    { id: 3, title: 'Heritage Villa', status: 'Completed', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800' },
    { id: 4, title: 'Zenith Mall', status: 'Upcoming', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800' }
  ];

  const filteredProjects = projects.filter(p => p.status === activeTab);

  return (
    <div className="new-landing-wrapper">
      <Navbar />

      {/* HERO SECTION */}
      <section className="hero-section" id="home">
        <div className="hero-overlay"></div>
        <div className="hero-content animate-fade-in-up">
          <h1>Building the Future <br/> with Precision</h1>
          <p>Delivering trust, structural integrity, and modern engineering to every residential and commercial project we undertake.</p>
          <div className="hero-buttons">
            <a href="#projects" className="btn-primary">Explore Our Work</a>
            <a href="#contact" className="btn-secondary">Contact Us</a>
          </div>
        </div>
      </section>

      {/* ABOUT US */}
      <section className="about-section" id="about">
        <div className="container about-grid animate-fade-in-up delay-100">
          <div className="about-image-wrapper">
            <img src="https://images.unsplash.com/photo-1504307651254-35680f356f12?q=80&w=800" alt="Construction Crew" />
          </div>
          <div className="about-text">
            <h2>Constructing Trust & Quality</h2>
            <p>At Porchelvan Builders, we combine decades of legacy experience with modern building practices. Our commitment to safety and premium materials ensures every structure stands the test of time.</p>
            
            <div className="core-values">
              <div className="value-item">
                <div className="value-icon"><CheckCircle size={24}/></div>
                <div>
                  <strong>Timely Delivery</strong>
                  <span>Strict adherence to project schedules.</span>
                </div>
              </div>
              <div className="value-item">
                <div className="value-icon"><Shield size={24}/></div>
                <div>
                  <strong>Premium Materials</strong>
                  <span>No compromises on structural integrity.</span>
                </div>
              </div>
              <div className="value-item">
                <div className="value-icon"><HardHat size={24}/></div>
                <div>
                  <strong>Unmatched Safety</strong>
                  <span>Prioritizing the well-being of our crew.</span>
                </div>
              </div>
              <div className="value-item">
                <div className="value-icon"><Ruler size={24}/></div>
                <div>
                  <strong>Modern Engineering</strong>
                  <span>Utilizing cutting-edge architectural practices.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS SHOWCASE */}
      <section className="projects-section" id="projects">
        <div className="container animate-fade-in-up delay-200">
          <div className="section-header">
            <h2>Our Portfolio</h2>
            <div className="project-tabs">
              {['Ongoing', 'Upcoming', 'Completed'].map(tab => (
                <button 
                  key={tab} 
                  className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="projects-grid">
            {filteredProjects.map(project => (
              <div key={project.id} className="project-card">
                <div className="project-image" style={{ backgroundImage: `url(${project.img})` }}></div>
                <div className="project-info">
                  <h3>{project.title}</h3>
                  <span className="project-status">{project.status}</span>
                  {project.status === 'Ongoing' && (
                    <div className="progress-container">
                      <div className="progress-bar" style={{ width: `${project.progress}%` }}></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="reviews-section" id="reviews">
        <div className="container">
          <h2>Client Testimonials</h2>
          <div className="reviews-grid">
            <div className="review-card">
              <div className="stars"><Star size={16}/><Star size={16}/><Star size={16}/><Star size={16}/><Star size={16}/></div>
              <p>"The team at Porchelvan Builders turned our blueprints into reality seamlessly. Their attention to detail and modern aesthetic is unparalleled."</p>
              <strong>- Marcus T., Corporate HQ</strong>
            </div>
            <div className="review-card">
              <div className="stars"><Star size={16}/><Star size={16}/><Star size={16}/><Star size={16}/><Star size={16}/></div>
              <p>"A highly professional crew that delivered our luxury villa exactly on time. Safety and quality were evident every day on site."</p>
              <strong>- Sarah & John Davies</strong>
            </div>
            <div className="review-card">
              <div className="stars"><Star size={16}/><Star size={16}/><Star size={16}/><Star size={16}/><Star size={16}/></div>
              <p>"Outstanding structural integrity. We felt completely secure letting them handle our commercial plaza project from start to finish."</p>
              <strong>- David L., Developer</strong>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY TEASER */}
      <section className="gallery-section" id="gallery">
        <div className="container">
          <h2>Gallery Snippets</h2>
          <div className="masonry-grid">
            <img src="https://images.unsplash.com/photo-1541888086225-f6404f456108?q=80&w=400" alt="Construction site" />
            <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=400" alt="Architecture" />
            <img src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=400" alt="Workers" />
            <img src="https://images.unsplash.com/photo-1504307651254-35680f356f12?q=80&w=400" alt="Blueprint" />
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            {/* Acts as router link */}
            <Link to="/gallery" className="btn-primary" style={{ display: 'inline-flex' }}>
              View Full Gallery <ArrowRight size={18} style={{ marginLeft: '0.5rem' }}/>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer-section" id="contact">
        <div className="container footer-grid">
          <div className="footer-brand">
            <div className="logo-section" style={{ color: 'white', marginBottom: '1rem' }}>
              <div className="logo-mark">PB</div>
              <span className="logo-text">Porchelvan Builders</span>
            </div>
            <p>Building the future with precision, trust, and modern engineering.</p>
            <div className="social-icons">
              <InstagramIcon size={20}/>
              <FacebookIcon size={20}/>
              <LinkedinIcon size={20}/>
            </div>
          </div>
          
          <div className="footer-links">
            <h4>Quick Links</h4>
            <a href="#about">About Us</a>
            <a href="#projects">Our Portfolio</a>
            <a href="#reviews">Testimonials</a>
            <Link to="/admin">Admin Portal</Link>
          </div>

          <div className="footer-contact">
            <h4>Contact Details</h4>
            <div className="contact-item">
              <MapPin size={18}/> <span>123 Precision Avenue, Chennai</span>
            </div>
            <div className="contact-item">
              <Phone size={18}/> <span>+91 98765 43210</span>
            </div>
            <div className="contact-item">
              <Mail size={18}/> <span>contact@porchelvanbuilders.com</span>
            </div>
            <div className="contact-item">
              <Clock size={18}/> <span>Mon - Sat, 8:00 AM - 6:00 PM</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Porchelvan Builders. All rights reserved.</p>
        </div>
      </footer>

      <style>{`
        /* COLOR PALETTE & VARIABLES */
        :root {
          --primary-navy: #0F172A; /* Slate Gray / Navy */
          --accent-orange: #F97316; /* Safety Orange */
          --bg-white: #FFFFFF;
          --bg-light: #F8FAFC;
          --text-dark: #1E293B;
          --text-gray: #64748B;
        }

        .new-landing-wrapper {
          font-family: 'Inter', system-ui, sans-serif;
          color: var(--text-dark);
          background-color: var(--bg-white);
          overflow-x: hidden;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        /* HEADER */
        .new-header {
          position: fixed;
          top: 0; left: 0; right: 0;
          background: transparent;
          padding: 1.5rem 0;
          z-index: 100;
          transition: all 0.3s ease;
        }
        .new-header.scrolled {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          padding: 1rem 0;
        }
        .new-header.scrolled .logo-text, .new-header.scrolled .desktop-nav a, .new-header.scrolled .admin-link {
          color: var(--primary-navy);
        }

        .header-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo-section { display: flex; align-items: center; gap: 0.75rem; color: white; }
        .logo-mark {
          background: var(--accent-orange);
          color: white;
          width: 40px; height: 40px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 1.2rem;
        }
        .logo-text { font-weight: 700; font-size: 1.25rem; letter-spacing: -0.5px; transition: color 0.3s; }

        .desktop-nav { display: none; gap: 2rem; }
        @media (min-width: 900px) { .desktop-nav { display: flex; } }
        .desktop-nav a {
          color: white; text-decoration: none; font-weight: 500; transition: color 0.2s;
        }
        .desktop-nav a:hover { color: var(--accent-orange) !important; }

        .cta-section { display: flex; align-items: center; gap: 1rem; }
        .btn-quote {
          background: var(--accent-orange); color: white;
          padding: 0.75rem 1.5rem; border-radius: 6px;
          text-decoration: none; font-weight: 600;
          transition: background 0.2s;
          display: none;
        }
        @media (min-width: 768px) { .btn-quote { display: block; } }
        .btn-quote:hover { background: #ea580c; }
        
        .mobile-toggle { background: none; border: none; color: var(--accent-orange); cursor: pointer; }
        @media (min-width: 900px) { .mobile-toggle { display: none; } }

        /* MOBILE MENU */
        .mobile-menu-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 200; display: flex; justify-content: flex-end; }
        .mobile-menu { background: white; width: 300px; height: 100%; padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; }
        .mobile-menu a { font-size: 1.25rem; text-decoration: none; color: var(--primary-navy); font-weight: 600; }
        .close-menu { align-self: flex-end; background: none; border: none; cursor: pointer; color: var(--primary-navy); }

        /* HERO */
        .hero-section {
          height: 100vh;
          min-height: 600px;
          background: url('https://images.unsplash.com/photo-1541888086225-f6404f456108?q=80&w=1600') center/cover no-repeat;
          position: relative;
          display: flex; align-items: center;
        }
        .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to right, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.6)); }
        
        .hero-content { position: relative; z-index: 10; max-width: 1200px; margin: 0 auto; padding: 0 2rem; width: 100%; }
        .hero-content h1 { color: white; font-size: clamp(3rem, 6vw, 4.5rem); line-height: 1.1; margin-bottom: 1.5rem; font-weight: 800; letter-spacing: -1px; }
        .hero-content p { color: #CBD5E1; font-size: 1.2rem; max-width: 600px; margin-bottom: 2.5rem; line-height: 1.6; }
        
        .hero-buttons { display: flex; gap: 1rem; flex-wrap: wrap; }
        .btn-primary { background: var(--accent-orange); color: white; padding: 1rem 2rem; border-radius: 6px; text-decoration: none; font-weight: 600; transition: 0.2s; }
        .btn-primary:hover { background: #ea580c; transform: translateY(-2px); }
        .btn-secondary { background: transparent; color: white; padding: 1rem 2rem; border-radius: 6px; text-decoration: none; font-weight: 600; border: 2px solid white; transition: 0.2s; }
        .btn-secondary:hover { background: white; color: var(--primary-navy); transform: translateY(-2px); }

        /* ABOUT */
        .about-section { padding: 6rem 0; background: var(--bg-white); }
        .about-grid { display: grid; grid-template-columns: 1fr; gap: 4rem; align-items: center; }
        @media (min-width: 900px) { .about-grid { grid-template-columns: 1fr 1fr; } }
        
        .about-image-wrapper img { width: 100%; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
        .about-text h2 { font-size: 2.5rem; color: var(--primary-navy); margin-bottom: 1.5rem; }
        .about-text p { color: var(--text-gray); font-size: 1.1rem; line-height: 1.7; margin-bottom: 2.5rem; }
        
        .core-values { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .value-item { display: flex; gap: 1rem; align-items: flex-start; }
        .value-icon { color: var(--accent-orange); }
        .value-item strong { display: block; color: var(--primary-navy); margin-bottom: 0.25rem; }
        .value-item span { font-size: 0.85rem; color: var(--text-gray); }

        /* PROJECTS */
        .projects-section { padding: 6rem 0; background: var(--bg-light); }
        .section-header { display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: 4rem; }
        .section-header h2 { font-size: 2.5rem; color: var(--primary-navy); margin-bottom: 2rem; }
        
        .project-tabs { display: flex; gap: 1rem; background: white; padding: 0.5rem; border-radius: 50px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); flex-wrap: wrap; justify-content: center; }
        .tab-btn { background: none; border: none; padding: 0.75rem 2rem; border-radius: 50px; font-weight: 600; color: var(--text-gray); cursor: pointer; transition: 0.2s; }
        .tab-btn.active { background: var(--primary-navy); color: white; }

        .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 2rem; }
        .project-card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); transition: transform 0.3s; }
        .project-card:hover { transform: translateY(-10px); }
        .project-image { height: 250px; background-size: cover; background-position: center; transition: transform 0.5s; }
        .project-card:hover .project-image { transform: scale(1.05); }
        .project-info { padding: 1.5rem; position: relative; background: white; }
        .project-info h3 { margin: 0 0 0.5rem 0; color: var(--primary-navy); }
        .project-status { font-size: 0.85rem; font-weight: 600; color: var(--accent-orange); text-transform: uppercase; }
        .progress-container { height: 6px; background: #E2E8F0; border-radius: 10px; margin-top: 1rem; overflow: hidden; }
        .progress-bar { height: 100%; background: var(--accent-orange); border-radius: 10px; }

        /* REVIEWS */
        .reviews-section { padding: 6rem 0; background: var(--primary-navy); color: white; }
        .reviews-section h2 { text-align: center; font-size: 2.5rem; margin-bottom: 4rem; }
        .reviews-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
        .review-card { background: rgba(255,255,255,0.05); padding: 2.5rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); }
        .stars { color: var(--accent-orange); display: flex; gap: 0.25rem; margin-bottom: 1.5rem; }
        .review-card p { font-size: 1.1rem; line-height: 1.6; margin-bottom: 1.5rem; font-style: italic; }
        .review-card strong { color: var(--accent-orange); }

        /* GALLERY */
        .gallery-section { padding: 6rem 0; background: var(--bg-white); }
        .gallery-section h2 { text-align: center; font-size: 2.5rem; color: var(--primary-navy); margin-bottom: 4rem; }
        .masonry-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
        @media (min-width: 768px) { .masonry-grid { grid-template-columns: repeat(4, 1fr); } }
        .masonry-grid img { width: 100%; height: 250px; object-fit: cover; border-radius: 8px; transition: 0.3s; }
        .masonry-grid img:hover { transform: scale(1.02); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }

        /* FOOTER */
        .footer-section { background: #020617; color: #94A3B8; padding: 5rem 0 2rem 0; }
        .footer-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 3rem; margin-bottom: 4rem; }
        .footer-brand p { margin-bottom: 1.5rem; line-height: 1.6; }
        .social-icons { display: flex; gap: 1rem; color: white; }
        .social-icons svg { cursor: pointer; transition: 0.2s; }
        .social-icons svg:hover { color: var(--accent-orange); }
        
        .footer-links h4, .footer-contact h4 { color: white; font-size: 1.2rem; margin-bottom: 1.5rem; }
        .footer-links a { display: block; color: #94A3B8; text-decoration: none; margin-bottom: 0.75rem; transition: 0.2s; }
        .footer-links a:hover { color: var(--accent-orange); }
        
        .contact-item { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
        .contact-item svg { color: var(--accent-orange); flex-shrink: 0; }
        
        .footer-bottom { text-align: center; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.1); }
      `}</style>
    </div>
  );
}

export default LandingPage;
