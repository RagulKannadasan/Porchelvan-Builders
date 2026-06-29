import React from 'react';
import { Link } from 'react-router-dom';
import { HardHat } from 'lucide-react';

export default function Footer() {
  return (
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
          <p>© {new Date().getFullYear()} Porchelvan Builders Inc. All rights reserved.</p>
          <Link to="/admin" style={{ color: 'var(--text-muted-light)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HardHat size={16} /> Admin Portal
          </Link>
        </div>
      </div>
    </footer>
  );
}
