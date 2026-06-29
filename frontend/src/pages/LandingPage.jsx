import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import HeroThree from '../components/HeroThree';
import AboutSection from '../components/landing/AboutSection';
import StatsBanner from '../components/landing/StatsBanner';
import ServicesSection from '../components/landing/ServicesSection';
import ContactSection from '../components/landing/ContactSection';
import Footer from '../components/landing/Footer';
import './LandingPage.css';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="lp-page">
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

      <div id="home">
        <HeroThree />
      </div>

      <AboutSection />
      <StatsBanner />
      <ServicesSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
