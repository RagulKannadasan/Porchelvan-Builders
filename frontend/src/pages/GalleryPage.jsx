import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
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

const allImages = [
  { id: 1, category: 'Residential', src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800', alt: 'Heritage Villa' },
  { id: 2, category: 'Commercial', src: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800', alt: 'Tech Hub Office' },
  { id: 3, category: 'Interior', src: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800', alt: 'Modern Living Room' },
  { id: 4, category: 'Residential', src: 'https://images.unsplash.com/photo-1541888086225-f6404f456108?q=80&w=800', alt: 'Skyline Residences' },
  { id: 5, category: 'Commercial', src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800', alt: 'Zenith Mall' },
  { id: 6, category: 'Interior', src: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800', alt: 'Luxury Kitchen' },
  { id: 7, category: 'Residential', src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800', alt: 'Suburban House' },
  { id: 8, category: 'Commercial', src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800', alt: 'Corporate Lobby' },
];

function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Residential', 'Commercial', 'Interior'];

  const filteredImages = activeCategory === 'All' 
    ? allImages 
    : allImages.filter(img => img.category === activeCategory);

  return (
    <div className="new-landing-wrapper">
      <Navbar />

      {/* HERO SECTION FOR GALLERY */}
      <section className="gallery-hero">
        <div className="gallery-hero-overlay"></div>
        <div className="hero-content">
          <h1>Our Work</h1>
          <p>A showcase of our finest projects across residential, commercial, and interior spaces.</p>
        </div>
      </section>

      {/* GALLERY GRID */}
      <section className="gallery-page-section">
        <div className="container">
          {/* Category Filters */}
          <div className="gallery-filters">
            {categories.map(cat => (
              <button 
                key={cat} 
                className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Masonry Layout */}
          <div className="gallery-grid">
            {filteredImages.map(img => (
              <div key={img.id} className="gallery-item">
                <img src={img.src} alt={img.alt} loading="lazy" />
                <div className="gallery-overlay">
                  <span className="gallery-category">{img.category}</span>
                  <h3 className="gallery-title">{img.alt}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer-section">
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
            <Link to="/">Home</Link>
            <a href="/#projects">Our Portfolio</a>
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
        /* Reuse styles from LandingPage */
        :root {
          --primary-navy: #0F172A;
          --accent-orange: #F97316;
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
          background: rgba(15, 23, 42, 0.8);
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

        .mobile-toggle { background: none; border: none; color: var(--accent-orange); cursor: pointer; }
        @media (min-width: 900px) { .mobile-toggle { display: none; } }

        /* MOBILE MENU */
        .mobile-menu-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 200; display: flex; justify-content: flex-end; }
        .mobile-menu { background: white; width: 300px; height: 100%; padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; }
        .mobile-menu a { font-size: 1.25rem; text-decoration: none; color: var(--primary-navy); font-weight: 600; }
        .close-menu { align-self: flex-end; background: none; border: none; cursor: pointer; color: var(--primary-navy); }

        /* GALLERY HERO */
        .gallery-hero {
          height: 40vh;
          min-height: 300px;
          background: url('https://images.unsplash.com/photo-1541888086225-f6404f456108?q=80&w=1600') center/cover no-repeat;
          position: relative;
          display: flex; align-items: center; justify-content: center; text-align: center;
        }
        .gallery-hero-overlay { position: absolute; inset: 0; background: rgba(15, 23, 42, 0.75); }
        .gallery-hero .hero-content { position: relative; z-index: 10; padding: 0 2rem; margin-top: 4rem; }
        .gallery-hero h1 { color: white; font-size: 3rem; margin-bottom: 1rem; }
        .gallery-hero p { color: #CBD5E1; font-size: 1.2rem; }

        /* GALLERY SECTION */
        .gallery-page-section {
          padding: 4rem 0;
          background: var(--bg-light);
          min-height: 50vh;
        }

        .gallery-filters {
          display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; margin-bottom: 3rem;
        }
        .filter-btn {
          background: white; border: 1px solid #E2E8F0; padding: 0.75rem 2rem; border-radius: 50px; font-weight: 600; color: var(--text-gray); cursor: pointer; transition: 0.2s;
        }
        .filter-btn:hover { border-color: var(--primary-navy); color: var(--primary-navy); }
        .filter-btn.active { background: var(--primary-navy); color: white; border-color: var(--primary-navy); }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .gallery-item {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
        }
        
        .gallery-item img {
          width: 100%;
          height: 300px;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }
        
        .gallery-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 1.5rem;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .gallery-item:hover img { transform: scale(1.05); }
        .gallery-item:hover .gallery-overlay { opacity: 1; }

        .gallery-category {
          color: var(--accent-orange);
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 0.25rem;
        }
        
        .gallery-title {
          color: white;
          font-size: 1.2rem;
          margin: 0;
        }

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

export default GalleryPage;
