import React, { useState, useEffect } from 'react';
import '../index.css';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

function LandingPage() {
  const [theme, setTheme] = useState('light');
  const [projects, setProjects] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check system preference or localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Fetch projects from backend
    fetch('http://localhost:5000/api/projects')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setProjects(data);
        } else {
          throw new Error("Data is not an array");
        }
      })
      .catch(err => {
        console.error("Could not fetch projects, using fallbacks:", err);
        setProjects([
          { _id: '1', title: 'Skyline Residences', description: 'Luxury apartment complex.', status: 'Ongoing', imageUrl: 'https://images.unsplash.com/photo-1541888086225-f6404f456108?q=80&w=600&auto=format&fit=crop' },
          { _id: '2', title: 'Tech Hub Office', description: 'Modern workspace building.', status: 'Upcoming', imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop' },
          { _id: '3', title: 'Heritage Villa', description: 'Restoration and renovation.', status: 'Completed', imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=600&auto=format&fit=crop' },
        ]);
      });
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <>
      <header className="header">
        <div className="container">
          <img src="/logo.png" alt="Porchelvan Builders Logo" className="logo" />
          
          <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={28} />
          </button>

          {/* Sidebar Overlay (Mobile) */}
          {isMobileMenuOpen && (
            <div className="mobile-sidebar-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
          )}

          <nav className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
            <div className="mobile-sidebar-header">
              <img src="/logo.png" alt="Logo" className="logo" style={{ height: '40px' }} />
              <button className="close-btn-mobile" onClick={() => setIsMobileMenuOpen(false)}>
                <X size={28} />
              </button>
            </div>
            <a href="#about" onClick={() => setIsMobileMenuOpen(false)}>About</a>
            <a href="#projects" onClick={() => setIsMobileMenuOpen(false)}>Projects</a>
            <a href="#reviews" onClick={() => setIsMobileMenuOpen(false)}>Reviews</a>
            {/* The user requested to skip the login page for now, but we add a link to the admin portal concept */}
            <Link to="/admin" className="text-gradient" onClick={() => setIsMobileMenuOpen(false)}>Admin Portal</Link>
            <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle Theme">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-bg"></div>
          <div className="container">
            <div className="hero-content">
              <h1>Building the <span className="text-gradient">Future</span>, Preserving Quality.</h1>
              <p>Porchelvan Builders specializes in high-end residential and commercial construction, bringing your visions to life with unmatched precision and minimalist elegance.</p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <a href="#projects" className="btn btn-primary">View Our Work</a>
                <a href="#contact" className="btn btn-outline">Contact Us</a>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="section" style={{ backgroundColor: 'var(--surface-color)' }}>
          <div className="container">
            <h2>About Us</h2>
            <p style={{ maxWidth: '800px', fontSize: '1.1rem' }}>
              With over two decades of experience, Porchelvan Builders stands as a pillar of reliability and excellence in the construction industry. We believe in strict adherence to quality, timely delivery, and transparent communication. 
            </p>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="section">
          <div className="container">
            <h2>Our Projects</h2>
            <div className="grid">
              {projects.map(project => (
                <div key={project._id} className="card">
                  <img src={project.imageUrl || 'https://images.unsplash.com/photo-1541888086225-f6404f456108?q=80&w=600&auto=format&fit=crop'} alt={project.title} className="card-img" />
                  <div className="card-content">
                    <span className="badge">{project.status}</span>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section id="reviews" className="section" style={{ backgroundColor: 'var(--surface-color)' }}>
          <div className="container">
            <h2>Client Reviews</h2>
            <div className="grid">
              <div className="card" style={{ padding: '2rem', border: 'none' }}>
                <p>"The minimalism and attention to detail they brought to our office space was phenomenal. Highly recommended."</p>
                <br/>
                <strong className="text-gradient">- Sarah Jenkins, Tech Corp</strong>
              </div>
              <div className="card" style={{ padding: '2rem', border: 'none' }}>
                <p>"Porchelvan Builders delivered our dream home exactly on schedule. Their transparency is unmatched."</p>
                <br/>
                <strong className="text-gradient">- Michael R.</strong>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <h4>Porchelvan Builders</h4>
            <p style={{ opacity: 0.8 }}>Quality Assured.</p>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li>123 Construction Ave, Suite 100</li>
              <li>info@porchelvanbuilders.com</li>
              <li>+1 (555) 123-4567</li>
            </ul>
          </div>
          <div>
            <h4>Links</h4>
            <ul>
              <li><a href="#about">About</a></li>
              <li><a href="#projects">Gallery</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}

export default LandingPage;
