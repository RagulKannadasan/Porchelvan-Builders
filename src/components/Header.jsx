import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-container">
          <img src="/logo.png" alt="Porchelvan Builders" className="logo" />
          <div className="header-text">
            <h1>Porchelvan Builders</h1>
            <span>Quality Assured</span>
          </div>
        </div>
        <nav className="nav">
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            <span className="sr-only">Toggle menu</span>
            <div className={`hamburger ${menuOpen ? 'is-active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
          <ul className={`nav-menu ${menuOpen ? 'is-open' : ''}`}>
            <li><NavLink to="/" exact activeClassName="active">Home</NavLink></li>
            <li><NavLink to="/about" activeClassName="active">About</NavLink></li>
            <li><NavLink to="/services" activeClassName="active">Services</NavLink></li>
            <li><NavLink to="/gallery" activeClassName="active">Gallery</NavLink></li>
            <li><NavLink to="/contact" activeClassName="active">Contact</NavLink></li>
            <li><NavLink to="/register" activeClassName="active">Register</NavLink></li>
            <li><NavLink to="/admin" activeClassName="active">Admin</NavLink></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
