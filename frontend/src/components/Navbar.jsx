import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getHashLink = (hash) => location.pathname === '/' ? hash : `/${hash}`;

  return (
    <>
      <header className={`new-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          <Link to="/" className="logo-section" style={{ textDecoration: 'none' }}>
            <div className="logo-mark">PB</div>
            <span className="logo-text">Porchelvan Builders</span>
          </Link>
          
          <nav className="desktop-nav">
            <a href={getHashLink('#about')}>About</a>
            <a href={getHashLink('#projects')}>Projects</a>
            <a href={getHashLink('#reviews')}>Reviews</a>
            <Link to="/gallery">Gallery</Link>
            <Link to="/admin" className="admin-link">Admin Login</Link>
          </nav>
          
          <div className="cta-section">
            <a href={getHashLink('#contact')} className="btn-quote">Get a Quote</a>
            <button className="mobile-toggle" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu">
            <button className="close-menu" onClick={() => setMobileMenuOpen(false)}>
              <X size={28}/>
            </button>
            <a href={getHashLink('#about')} onClick={() => setMobileMenuOpen(false)}>About</a>
            <a href={getHashLink('#projects')} onClick={() => setMobileMenuOpen(false)}>Projects</a>
            <a href={getHashLink('#reviews')} onClick={() => setMobileMenuOpen(false)}>Reviews</a>
            <Link to="/gallery" onClick={() => setMobileMenuOpen(false)}>Gallery</Link>
            <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>Admin Login</Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
