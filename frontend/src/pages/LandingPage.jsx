import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, CheckCircle, Home, HardHat, Star,
  ArrowRight, Phone, Mail, Moon, Sun,
  Shield, Zap, Clock, Building, ChevronRight, Play, Menu, X
} from 'lucide-react';
import ThreeBackground from '../components/ThreeBackground';
import API_BASE_URL from '../utils/api';
import img1 from '../assets/images/img1.jpeg';
import img2 from '../assets/images/img2.jpeg';
import img3 from '../assets/images/img3.jpeg';
import img4 from '../assets/images/img4.jpeg';
import img5 from '../assets/images/img5.jpeg';
import img6 from '../assets/images/img6.jpeg';
import img7 from '../assets/images/img7.jpeg';

export default function LandingPage() {
  // Defaulting to dark mode since the 3D aesthetic is slate/gold
  const [dark, setDark] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [scrollProgress, setScrollProgress] = useState(0);

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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const total = document.body.scrollHeight - window.innerHeight;
      const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
      setScrollProgress(progress);
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

  const d = dark;

  const css = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { font-family: 'Inter', system-ui, sans-serif; }

    /* ── SCROLL BAR ── */
    #scroll-bar {
      position: fixed; left: 0; top: 0; height: 3px; width: 0%;
      background: linear-gradient(to right, #F59E0B, #FCD34D);
      z-index: 1000; transition: width 0.05s linear;
      box-shadow: 0 0 8px rgba(245,158,11,0.5);
    }

    /* ── TOKENS ── */
    .pg {
      /* Mixed color palette: Slate + Gold */
      --bg:       ${d ? '#0F172A' : '#E2E8F0'};
      --bg2:      ${d ? '#1E293B' : '#F8FAFC'};
      --bg3:      ${d ? 'rgba(30,41,59,0.7)' : 'rgba(241,245,249,0.7)'};
      --border:   ${d ? 'rgba(245,158,11,0.2)' : 'rgba(245,158,11,0.2)'}; /* Gold tinted border */
      --border-light: ${d ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.08)'};
      --text:     ${d ? '#F8FAFC' : '#0F172A'};
      --muted:    ${d ? '#94A3B8' : '#475569'};
      --accent:   #F59E0B; /* Gold */
      --accent-hover: #FCD34D;
      --card-shadow: ${d ? '0 4px 24px rgba(0,0,0,0.4)' : '0 4px 24px rgba(15,23,42,0.06)'};
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      transition: background 0.35s, color 0.35s;
    }
    
    /* Ensure content layer is above canvas */
    .content-layer {
      position: relative;
      z-index: 10;
    }

    /* ── NAV ── */
    .nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      padding: 1.5rem 0;
      transition: all 0.4s ease;
    }
    .nav.scrolled {
      background: ${d ? 'rgba(15,23,42,0.85)' : 'rgba(248,250,252,0.85)'};
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
      padding: 1rem 0;
    }
    .nav-w { max-width: 1280px; margin: 0 auto; padding: 0 2rem; display: flex; align-items: center; justify-content: space-between; }
    .logo { display: flex; align-items: center; gap: 0.65rem; text-decoration: none; }
    .logo-name {
      font-weight: 700; font-size: 1.25rem; letter-spacing: 0.08em;
      color: var(--text); font-family: 'Space Grotesk', sans-serif;
      text-transform: uppercase;
      transition: color 0.3s ease;
    }
    .logo-accent { color: var(--accent); }
    .logo:hover .logo-name { color: var(--accent); }
    
    .nav-links { display: flex; gap: 2.5rem; list-style: none; }
    .nav-links a { 
      color: var(--muted); text-decoration: none; font-size: 0.8rem; font-weight: 500; 
      letter-spacing: 0.15em; text-transform: uppercase; font-family: 'Space Grotesk', sans-serif;
      transition: all 0.3s;
    }
    .nav-links a:hover { color: var(--accent); }
    
    .nav-right { display: flex; align-items: center; gap: 1rem; }
    .theme-btn {
      width: 36px; height: 36px; border-radius: 8px;
      border: 1px solid var(--border-light); background: transparent;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: var(--muted); transition: all 0.25s;
    }
    .theme-btn:hover { color: var(--accent); border-color: var(--accent); }
    .btn-nav {
      background: var(--accent); color: #0F172A;
      padding: 0.65rem 1.5rem; border-radius: 8px;
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 600; font-size: 0.78rem; letter-spacing: 0.12em; text-transform: uppercase;
      border: none; cursor: pointer; transition: background 0.25s, transform 0.2s;
    }
    .btn-nav:hover { background: var(--accent-hover); transform: translateY(-1px); }

    /* ── HERO ── */
    .hero-wrapper { position: relative; width: 100%; min-height: 100vh; display: flex; align-items: center; overflow-x: hidden; padding-top: 80px; }
    .hero { position: relative; z-index: 2; max-width: 1280px; margin: 0 auto; width: 100%; padding: 0 2rem; pointer-events: none; }
    .hero-left { pointer-events: auto; max-width: 55vw; }
    
    .eyebrow {
      display: inline-flex; align-items: center; gap: 1rem;
      margin-bottom: 2rem;
    }
    .eyebrow-line { width: 2.5rem; height: 1px; background: var(--accent); }
    .eyebrow-text { font-family: 'Space Grotesk', sans-serif; font-size: 0.72rem; font-weight: 500; letter-spacing: 0.25em; text-transform: uppercase; color: var(--accent); }
    
    .hero-h1 {
      font-family: 'Space Grotesk', sans-serif; font-weight: 700; line-height: 0.9;
      font-size: clamp(3.5rem, 7vw, 7rem); letter-spacing: -0.02em; color: var(--text);
      margin-bottom: 2.5rem;
    }
    .hero-h1 .h-solid { display: block; }
    .hero-h1 .h-outline {
      display: block; color: transparent;
      -webkit-text-stroke: 1.5px var(--accent);
    }
    
    .hero-p { font-size: 1rem; line-height: 1.75; color: var(--muted); margin-bottom: 3rem; max-width: 38rem; }
    
    .hero-actions { display: flex; gap: 2rem; flex-wrap: wrap; align-items: center; }
    .btn-primary {
      background: var(--accent); color: #0F172A;
      padding: 1rem 2.5rem; border-radius: 8px;
      font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 0.82rem; 
      letter-spacing: 0.12em; text-transform: uppercase;
      border: none; cursor: pointer; display: flex; align-items: center; gap: 0.45rem;
      transition: all 0.25s;
    }
    .btn-primary:hover { background: var(--accent-hover); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(245,158,11,0.35); }
    
    .btn-outline {
      background: transparent; border: 1px solid var(--border-light);
      color: var(--muted); padding: 1rem 2.5rem; border-radius: 8px;
      font-family: 'Space Grotesk', sans-serif; font-weight: 500; font-size: 0.82rem; 
      letter-spacing: 0.12em; text-transform: uppercase;
      cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: all 0.25s;
    }
    .btn-outline:hover { border-color: var(--accent); color: var(--accent); }
    
    .hero-stats {
      display: flex; gap: 3rem; margin-top: 5rem; padding-top: 2.5rem; border-top: 1px solid var(--border-light);
    }
    .stat-number { font-family: 'Space Grotesk', sans-serif; font-size: 2.5rem; font-weight: 700; color: var(--text); line-height: 1; }
    .stat-number span { color: var(--accent); }
    .stat-label { font-size: 0.75rem; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; margin-top: 0.4rem; }

    /* ── SECTION SHARED ── */
    .sec { padding: 8rem 0; border-top: 1px solid var(--border-light); }
    .sec-bg-transparent { background: transparent; }
    .sec-bg-dark { background: var(--bg2); }
    
    .sec-w { max-width: 1280px; margin: 0 auto; padding: 0 2rem; position: relative; }
    
    .sec-label { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; }
    .sec-label-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); flex-shrink: 0; }
    .sec-label-text { font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 500; letter-spacing: 0.25em; text-transform: uppercase; color: var(--accent); }
    
    .sec-h2 { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: clamp(2.2rem, 4vw, 3.5rem); line-height: 1.05; letter-spacing: -0.02em; color: var(--text); }
    .sec-h2 em { font-style: normal; color: transparent; -webkit-text-stroke: 1px var(--accent); }
    
    .sec-p { color: var(--muted); line-height: 1.8; font-size: 1.05rem; margin-top: 1.5rem; max-width: 480px; }
    
    .sec-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 4rem; flex-wrap: wrap; gap: 2rem; }
    .link-more { font-family: 'Space Grotesk', sans-serif; font-size: 0.78rem; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: var(--accent); background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: gap 0.25s; }
    .link-more:hover { gap: 0.9rem; }

    /* ── SERVICES (Redesigned as Capabilities) ── */
    .svc-layout { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: 6rem; align-items: start; }
    .svc-sticky { position: sticky; top: 8rem; }
    .svc-list { display: flex; flex-direction: column; }
    .svc-item { display: flex; align-items: flex-start; gap: 2rem; padding: 2.5rem 0; border-bottom: 1px solid var(--border-light); cursor: pointer; transition: border-color 0.3s; }
    .svc-item:first-child { border-top: 1px solid var(--border-light); }
    .svc-item:hover { border-bottom-color: rgba(245,158,11,0.25); }
    .svc-num { font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; font-weight: 500; color: var(--muted); letter-spacing: 0.1em; padding-top: 0.25rem; min-width: 2.5rem; }
    .svc-body { flex: 1; }
    .svc-title { font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; font-weight: 600; color: var(--text); transition: color 0.3s; }
    .svc-item:hover .svc-title { color: var(--accent); }
    .svc-desc { font-size: 0.88rem; color: var(--muted); line-height: 1.7; margin-top: 0.5rem; max-height: 0; overflow: hidden; transition: max-height 0.4s ease; opacity: 0; }
    .svc-item:hover .svc-desc { max-height: 6rem; opacity: 1; }
    .svc-arrow { margin-left: auto; color: var(--muted); transition: color 0.3s, transform 0.3s; padding-top: 0.25rem; }
    .svc-item:hover .svc-arrow { color: var(--accent); transform: translateX(4px); }

    /* ── PROJECTS ── */
    .prj-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
    .prj-card { background: var(--bg2); border: 1px solid var(--border-light); border-radius: 16px; overflow: hidden; cursor: pointer; transition: border-color 0.3s, transform 0.35s; position: relative; }
    .prj-card:hover { border-color: rgba(245,158,11,0.4); transform: translateY(-4px); }
    .prj-card.featured { grid-column: span 2; }
    .prj-visual { width: 100%; aspect-ratio: 16/9; background: var(--bg); position: relative; overflow: hidden; }
    .prj-card.featured .prj-visual { aspect-ratio: 2/1; }
    .prj-visual img { width: 100%; height: 100%; object-fit: cover; opacity: 0.6; transition: opacity 0.4s; }
    .prj-card:hover .prj-visual img { opacity: 1; }
    
    .prj-hover-badge {
      position: absolute; top: 1rem; right: 1rem;
      background: rgba(245,158,11,0.9); color: #0F172A;
      font-family: 'Space Grotesk', sans-serif; font-size: 0.65rem; font-weight: 700;
      letter-spacing: 0.1em; text-transform: uppercase; padding: 0.35rem 0.75rem;
      border-radius: 8px; opacity: 0; transform: translateY(-4px); transition: opacity 0.25s, transform 0.25s;
    }
    .prj-card:hover .prj-hover-badge { opacity: 1; transform: translateY(0); }
    
    .prj-body { padding: 1.5rem; }
    .prj-category { font-size: 0.68rem; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent); margin-bottom: 0.5rem; }
    .prj-name { font-family: 'Space Grotesk', sans-serif; font-size: 1.05rem; font-weight: 600; color: var(--text); }
    .prj-meta { display: flex; align-items: center; gap: 1.5rem; margin-top: 0.8rem; }
    .prj-meta-item { font-size: 0.75rem; color: var(--muted); display: flex; align-items: center; gap: 0.35rem; }
    .prj-meta-dot { width: 4px; height: 4px; background: var(--muted); border-radius: 50%; }

    /* ── PROCESS ── */
    .proc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6rem; align-items: center; }
    .proc-pillars { display: flex; flex-direction: column; gap: 1.25rem; margin-top: 3rem; }
    .pillar {
      display: flex; align-items: flex-start; gap: 1.25rem; padding: 1.25rem 1.5rem;
      border: 1px solid var(--border-light); border-radius: 16px; background: var(--bg2);
      transition: border-color 0.3s, background 0.3s;
    }
    .pillar:hover { border-color: rgba(245,158,11,0.3); background: rgba(245,158,11,0.03); }
    .pillar-icon { width: 36px; height: 36px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; color: var(--accent); }
    .pillar-title { font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; font-weight: 600; color: var(--text); letter-spacing: 0.02em; }
    .pillar-desc { font-size: 0.82rem; color: var(--muted); margin-top: 0.3rem; line-height: 1.6; }
    
    .proc-visual { position: relative; height: 500px; display: flex; flex-direction: column; justify-content: center; }
    .metric-card {
      background: var(--bg2); border: 1px solid var(--border-light);
      border-radius: 16px; padding: 2rem; position: relative; overflow: hidden;
      backdrop-filter: blur(10px);
    }
    .metric-card::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
      background: linear-gradient(to right, var(--accent), transparent);
    }
    .metric-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .metric-val { font-family: 'Space Grotesk', sans-serif; font-size: 2rem; font-weight: 700; color: var(--text); }
    .metric-val span { color: var(--accent); font-size: 1.5rem;}
    .metric-desc { font-size: 0.75rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; margin-top: 0.25rem; }

    /* ── TESTIMONIALS ── */
    .testi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
    .testi-card { background: var(--bg3); border: 1px solid var(--border-light); border-radius: 16px; padding: 2rem; transition: border-color 0.2s; backdrop-filter: blur(10px); }
    .testi-card:hover { border-color: rgba(245,158,11,0.3); }
    .testi-stars { color: var(--accent); font-size: 0.8rem; letter-spacing: 2px; margin-bottom: 1rem; display: flex; }
    .testi-q { font-size: 0.9rem; color: var(--muted); line-height: 1.7; margin-bottom: 1.5rem; font-style: italic; }
    .testi-au { display: flex; align-items: center; gap: 0.75rem; }
    .testi-av { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; border: 1px solid var(--border-light); flex-shrink: 0; }
    .testi-av img { width: 100%; height: 100%; object-fit: cover; }
    .testi-name { font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; font-weight: 600; color: var(--text); }
    .testi-role { font-size: 0.75rem; color: var(--muted); }

    /* ── CONTACT ── */
    .contact-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 4rem; }
    .contact-info { background: var(--bg3); padding: 3rem; border-radius: 16px; border: 1px solid var(--border-light); height: 100%; backdrop-filter: blur(10px); }
    .contact-info-item { display: flex; gap: 1.25rem; margin-bottom: 2rem; }
    .contact-info-item:last-child { margin-bottom: 0; }
    .contact-icon { width: 48px; height: 48px; border-radius: 8px; background: rgba(245,158,11,0.1); color: var(--accent); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid rgba(245,158,11,0.2); }
    .contact-text h4 { font-family: 'Space Grotesk', sans-serif; font-size: 0.95rem; font-weight: 600; color: var(--text); margin-bottom: 0.3rem; }
    .contact-text p { font-size: 0.9rem; color: var(--muted); line-height: 1.5; }
    
    .contact-form { display: flex; flex-direction: column; gap: 1.5rem; background: var(--bg3); padding: 3rem; border-radius: 16px; border: 1px solid var(--border-light); backdrop-filter: blur(10px); }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.6rem; }
    .form-group label { font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; font-weight: 500; color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; }
    .form-group input, .form-group textarea, .form-group select { width: 100%; padding: 1rem 1.25rem; border-radius: 8px; border: 1px solid var(--border-light); background: var(--bg2); color: var(--text); font-family: inherit; font-size: 0.95rem; transition: border-color 0.2s; outline: none; }
    .form-group input:focus, .form-group textarea:focus, .form-group select:focus { border-color: var(--accent); }
    
    /* ── FOOTER ── */
    footer { border-top: 1px solid var(--border-light); padding: 4rem 0 2rem; background: var(--bg2); }
    .foot-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 3rem; margin-bottom: 3rem; }
    .foot-brand p { font-size: 0.84rem; color: var(--muted); line-height: 1.7; margin-top: 1rem; max-width: 280px; }
    .foot-col h4 { font-family: 'Space Grotesk', sans-serif; font-size: 0.72rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text); margin-bottom: 1.25rem; }
    .foot-col ul { list-style: none; display: flex; flex-direction: column; gap: 0.75rem; }
    .foot-col ul a { color: var(--muted); text-decoration: none; font-size: 0.84rem; transition: color 0.25s; }
    .foot-col ul a:hover { color: var(--accent); }
    .foot-bottom { border-top: 1px solid var(--border-light); padding-top: 1.5rem; display: flex; justify-content: space-between; align-items: center; }
    .foot-bottom p { font-size: 0.78rem; color: var(--muted); }

    /* ── RESPONSIVE ── */
    @media(max-width:1024px){
      .hero-wrapper { min-height: auto; flex-direction: column; padding-top: 120px; }
      .hero { padding-top: 0; padding-bottom: 3rem; }
      .hero-left { max-width: 100%; }
      .svc-layout { grid-template-columns: 1fr; gap: 3rem; }
      .svc-sticky { position: static; }
      .prj-grid { grid-template-columns: 1fr; }
      .prj-card.featured { grid-column: span 1; }
      .proc-grid { grid-template-columns: 1fr; gap: 3rem; }
      .foot-grid { grid-template-columns: 1fr 1fr; }
      .testi-grid { grid-template-columns: repeat(2,1fr); }
    }
    @media(max-width:768px){
      .nav-links { display:none; }
      .btn-nav { display:none; }
      .mobile-menu-btn { display: flex; align-items: center; justify-content: center; background: none; border: none; color: var(--text); cursor: pointer; padding: 0.5rem; }
      .testi-grid { grid-template-columns:1fr; }
      .contact-grid { grid-template-columns: 1fr; gap: 2.5rem; }
      .contact-info, .contact-form { padding: 2rem; }
      .form-row { grid-template-columns: 1fr; gap: 1rem; }
      .foot-grid { grid-template-columns:1fr; gap:2.5rem; }
      .foot-bottom { flex-direction: column; gap: 1.25rem; text-align: center; }
      .sec { padding: 5rem 0; }
    }

    /* ── MOBILE MENU OVERLAY ── */
    .mobile-menu-overlay-backdrop {
      position: fixed; inset: 0; background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(4px); z-index: 199;
      opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
    }
    .mobile-menu-overlay-backdrop.open { opacity: 1; pointer-events: auto; }
    .mobile-menu-overlay {
      position: fixed; top: 0; bottom: 0; left: 0; width: 280px; height: 100%;
      background: var(--bg2); border-right: 1px solid var(--border); z-index: 200;
      display: flex; flex-direction: column; padding: 1.5rem;
      transform: translateX(-100%); transition: transform 0.3s ease;
      box-shadow: 0 0 25px rgba(0,0,0,0.5);
    }
    .mobile-menu-overlay.open { transform: translateX(0); }
    .mobile-menu-top {
      display: flex; justify-content: space-between; align-items: center;
      padding-bottom: 1.25rem; border-bottom: 1px solid var(--border-light); margin-bottom: 1.5rem;
    }
    .mobile-menu-links { list-style: none; display: flex; flex-direction: column; gap: 0.5rem; }
    .mobile-menu-links li a {
      display: flex; align-items: center; gap: 0.75rem; padding: 0.85rem 1rem;
      color: var(--text); font-weight: 600; font-size: 0.92rem; text-decoration: none;
      border-radius: 16px; transition: all 0.2s;
    }
    .mobile-menu-links li a:hover {
      background: rgba(245, 158, 11, 0.1); color: var(--accent);
    }
    
    @media (max-width: 768px) {
      /* Performance optimization: Disable expensive blur filters on mobile */
      .nav.scrolled, .metric-card, .testi-card, .contact-info, .contact-form, .mobile-menu-overlay-backdrop {
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
      }
    }
  `;

  const projects = [
    { id: 1, title: 'Ocean Breeze Villa', price: '₹2.1 Cr', location: 'Thanjavur', img: img1, beds: '4 Beds', baths: '3 Baths', tag: 'Luxury', sqft: '4,200', featured: true },
    { id: 2, title: 'Jubilee Residences', price: '₹1.4 Cr', location: 'Thiruvarur', img: img2, beds: '3 Beds', baths: '2 Baths', tag: 'Premium', sqft: '3,100', featured: false },
    { id: 3, title: 'Lakeside Cottage', price: '₹85 L', location: 'Kumbakonam', img: img3, beds: '2 Beds', baths: '2 Baths', tag: 'Serene', sqft: '1,800', featured: false },
  ];

  const services = [
    { num: '01', title: 'Construction', desc: 'Expert residential and commercial construction from foundation to finish.' },
    { num: '02', title: 'Architect & Design', desc: 'Innovative concepts and creative design tailored to your vision.' },
    { num: '03', title: 'Interiors', desc: 'Premium interior design and execution for a flawless living space.' },
    { num: '04', title: 'Real Estate', desc: 'Trusted guidance and solutions for your real estate investments.' },
    { num: '05', title: 'Building Approval', desc: 'Hassle-free navigation of building approvals and legal compliance.' },
    { num: '06', title: 'Loan Arrangement', desc: 'Seamless assistance with financial planning and home loan arrangements.' },
  ];

  const testimonials = [
    { name: 'Ramesh Krishnan', role: 'Home Owner, Thanjavur', text: 'Porchelvan Builders exceeded every expectation. Our villa was delivered ahead of schedule and the craftsmanship is outstanding.', rating: 5, img: img4 },
    { name: 'Priya Subramaniam', role: 'Property Investor', text: 'I\'ve worked with many builders across Tamil Nadu. Nobody matches their attention to detail and post-handover support.', rating: 5, img: img5 },
    { name: 'Arun Mehta', role: 'Business Owner, Thiruvarur', text: 'From blueprint to key delivery — transparent, on-budget, and stress-free. Truly world-class builders.', rating: 5, img: img6 },
  ];

  return (
    <div className="pg">
      <style>{css}</style>

      {/* ── SCROLL BAR ── */}
      <div id="scroll-bar" style={{ width: `${scrollProgress}%` }}></div>

      {/* ── 3D BACKGROUND ── */}
      <ThreeBackground dark={dark} />

      <div className="content-layer">
        {/* ── NAV ── */}
        <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
          <div className="nav-w">
            {!isMobile && <div style={{width: '24px'}} />} {/* Spacer for mobile menu alignment */}
            {isMobile && (
              <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}>
                <Menu size={24} />
              </button>
            )}
            <a href="#" className="logo">
              <span className="logo-name">Porchelvan<span className="logo-accent">|</span>Builders</span>
            </a>
            <ul className="nav-links">
              {['About', 'Projects', 'Services'].map(n => <li key={n}><a href={`#${n.toLowerCase()}`}>{n}</a></li>)}
              <li><a href="#contact">Contact</a></li>
            </ul>
            <div className="nav-right">
              <button className="theme-btn" onClick={() => setDark(!dark)} title="Toggle theme">
                {dark ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <button className="btn-nav" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>Start a Project</button>
            </div>
          </div>
        </nav>

        {/* ── MOBILE MENU OVERLAY ── */}
        <div className={`mobile-menu-overlay-backdrop ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)} />
        <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-top">
            <a href="#" className="logo" onClick={() => setMobileMenuOpen(false)}>
              <span className="logo-name" style={{ fontSize: '1rem' }}>Porchelvan<span className="logo-accent">|</span>Builders</span>
            </a>
            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(false)}>
              <X size={20} />
            </button>
          </div>
          <ul className="mobile-menu-links">
            {['About', 'Projects', 'Services'].map(n => (
              <li key={n}>
                <a href={`#${n.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)}>
                  {n}
                </a>
              </li>
            ))}
            <li>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* ── HERO ── */}
        <div className="hero-wrapper" id="about">
          <div className="hero">
            <div className="hero-left">
              <div className="eyebrow">
                <div className="eyebrow-line" />
                <div className="eyebrow-text">Thanjavur's Premier Builder</div>
              </div>
              <h1 className="hero-h1">
                <span className="h-solid">LET'S BUILD</span>
                <span className="h-outline">YOUR</span>
                <span className="h-solid">DREAM HOME</span>
              </h1>
              <p className="hero-p">
                From our roots in Thanjavur, Porchelvan Builders is the Delta region's most trusted name in residential and commercial construction — delivering innovative concepts, creative design, and flawless execution.
              </p>
              <div className="hero-actions">
                <button className="btn-primary" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>View Our Work</button>
                <button className="btn-outline" onClick={() => document.getElementById('process')?.scrollIntoView({ behavior: 'smooth' })}>Our Process</button>
              </div>
              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-number">340<span>+</span></div>
                  <div className="stat-label">Projects Built</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">28<span>M</span></div>
                  <div className="stat-label">sq ft Constructed</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">94<span>%</span></div>
                  <div className="stat-label">Client Retention</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── PROJECTS ── */}
        <section id="projects" className="sec sec-bg-transparent">
          <div className="sec-w">
            <div className="sec-header">
              <div>
                <div className="sec-label">
                  <div className="sec-label-dot" />
                  <span className="sec-label-text">Portfolio</span>
                </div>
                <h2 className="sec-h2">Our <em>finest</em><br />work.</h2>
              </div>
              <button className="link-more">All Projects <ArrowRight size={15} /></button>
            </div>
            <div className="prj-grid">
              {projects.map(p => (
                <div key={p.id} className={`prj-card ${p.featured ? 'featured' : ''}`}>
                  <div className="prj-visual">
                    <img src={p.img} alt={p.title} />
                    <div className="prj-hover-badge">View Case Study</div>
                  </div>
                  <div className="prj-body">
                    <div className="prj-category">{p.price}</div>
                    <div className="prj-name">{p.title}</div>
                    <div className="prj-meta">
                      <span className="prj-meta-item">{p.beds} · {p.baths}</span>
                      <span className="prj-meta-dot" />
                      <span className="prj-meta-item">{p.sqft} sq ft</span>
                      <span className="prj-meta-dot" />
                      <span className="prj-meta-item">{p.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SERVICES (Capabilities) ── */}
        <section id="services" className="sec sec-bg-transparent">
          <div className="sec-w">
            <div className="svc-layout">
              <div className="svc-sticky">
                <div className="sec-label">
                  <div className="sec-label-dot" />
                  <span className="sec-label-text">What We Do</span>
                </div>
                <h2 className="sec-h2">Every service<br /><em>you need to build.</em></h2>
                <p className="sec-p">
                  From the first sketch to the final handover, we cover every discipline required
                  to deliver your dream project on time and on budget.
                </p>
              </div>
              <div className="svc-list">
                {services.map((s, i) => (
                  <div key={i} className="svc-item">
                    <div className="svc-num">{s.num}</div>
                    <div className="svc-body">
                      <div className="svc-title">{s.title}</div>
                      <div className="svc-desc">{s.desc}</div>
                    </div>
                    <div className="svc-arrow">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── PROCESS (Pillars) ── */}
        <section id="process" className="sec sec-bg-transparent">
          <div className="sec-w">
            <div className="proc-grid">
              <div>
                <div className="sec-label">
                  <div className="sec-label-dot" />
                  <span className="sec-label-text">Our Process</span>
                </div>
                <h2 className="sec-h2">Built right,<br /><em>every time.</em></h2>
                <div className="proc-pillars">
                  <div className="pillar">
                    <div className="pillar-icon"><Shield size={22} strokeWidth={1.5} /></div>
                    <div>
                      <div className="pillar-title">Blueprint & Approvals</div>
                      <div className="pillar-desc">Detailed architectural plans and full handling of all municipal permits.</div>
                    </div>
                  </div>
                  <div className="pillar">
                    <div className="pillar-icon"><Zap size={22} strokeWidth={1.5} /></div>
                    <div>
                      <div className="pillar-title">Expert Construction</div>
                      <div className="pillar-desc">Premium-grade materials from certified vendors — zero quality compromise.</div>
                    </div>
                  </div>
                  <div className="pillar">
                    <div className="pillar-icon"><Building size={22} strokeWidth={1.5} /></div>
                    <div>
                      <div className="pillar-title">Handover & Warranty</div>
                      <div className="pillar-desc">Full inspection, snag clearance, and 10-year structural warranty.</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="proc-visual">
                <div className="metric-card">
                  <div className="metric-row">
                    <div>
                      <div className="metric-val">30<span>yr</span></div>
                      <div className="metric-desc">in practice</div>
                    </div>
                    <div>
                      <div className="metric-val">4<span>x</span></div>
                      <div className="metric-desc">AIA award winner</div>
                    </div>
                    <div>
                      <div className="metric-val">17<span>+</span></div>
                      <div className="metric-desc">districts</div>
                    </div>
                    <div>
                      <div className="metric-val">Zero<span>CO₂</span></div>
                      <div className="metric-desc">target by 2030</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="sec sec-bg-transparent">
          <div className="sec-w">
            <div className="sec-header" style={{ marginBottom: '3rem' }}>
              <div>
                <div className="sec-label">
                  <div className="sec-label-dot" />
                  <span className="sec-label-text">Testimonials</span>
                </div>
                <h2 className="sec-h2">Words From<br /><em>Happy Owners</em></h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', fontWeight: 600, fontSize: '0.9rem', fontFamily: 'Space Grotesk, sans-serif' }}>
                <Star size={16} fill="var(--accent)" /> 4.9 / 5 Average
              </div>
            </div>
            <div className="testi-grid">
              {testimonials.map((t, i) => (
                <div key={i} className="testi-card">
                  <div className="testi-stars">
                    {[...Array(t.rating)].map((_, j) => <Star key={j} size={14} fill="currentColor" style={{ marginRight: '2px' }}/>)}
                  </div>
                  <p className="testi-q">"{t.text}"</p>
                  <div className="testi-au">
                    <div className="testi-av"><img src={t.img} alt={t.name} /></div>
                    <div>
                      <div className="testi-name">{t.name}</div>
                      <div className="testi-role">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section id="contact" className="sec sec-bg-transparent">
          <div className="sec-w">
            <div className="sec-label" style={{ justifyContent: 'center' }}>
              <div className="sec-label-dot" />
              <span className="sec-label-text">Get in Touch</span>
            </div>
            <h2 className="sec-h2" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Ready to build<br /><em>something lasting?</em></h2>
            <p className="sec-p" style={{ textAlign: 'center', margin: '0 auto 4rem', maxWidth: '600px' }}>
              Tell us about your project. Our team will respond within 24 hours
              with an initial feasibility assessment, at no cost.
            </p>

            <div className="contact-grid">
              <div className="contact-info">
                <div className="contact-info-item">
                  <div className="contact-icon"><Phone size={20} /></div>
                  <div className="contact-text">
                    <h4>Call Us Directly</h4>
                    <p>+91 97510 61442<br />Mon-Sat: 9AM - 6PM</p>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-icon"><Mail size={20} /></div>
                  <div className="contact-text">
                    <h4>Email Enquiries</h4>
                    <p>porchelvanbuilders.er@gmail.com</p>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-icon"><MapPin size={20} /></div>
                  <div className="contact-text">
                    <h4>Head Office</h4>
                    <p>137, West Street, Kavarappattu,<br />Orathanadu, Thanjavur - 614625</p>
                  </div>
                </div>
              </div>

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input type="text" placeholder="John" required value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input type="text" placeholder="Doe" required value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" placeholder="john@example.com" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="tel" placeholder="+91" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Project Type</label>
                  <select value={formData.projectType} onChange={e => setFormData({ ...formData, projectType: e.target.value })}>
                    <option value="residential">Residential / Custom Home</option>
                    <option value="commercial">Commercial Space</option>
                    <option value="renovation">Renovation</option>
                    <option value="other">Other Inquiry</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea rows={4} placeholder="Tell us about your project requirements..." required value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}></textarea>
                </div>

                {submitStatus === 'success' && <div style={{ color: '#10B981', fontSize: '0.9rem', fontWeight: '600', padding: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '4px' }}>Thank you! Your inquiry has been submitted.</div>}
                {submitStatus === 'error' && <div style={{ color: '#EF4444', fontSize: '0.9rem', fontWeight: '600', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '4px' }}>Failed to send. Please try again.</div>}

                <button type="submit" className="btn-primary" disabled={submitting} style={{ opacity: submitting ? 0.7 : 1, alignSelf: 'flex-start', marginTop: '1rem' }}>
                  {submitting ? 'Sending...' : 'Post Message'} {!submitting && <ArrowRight size={16} />}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer>
          <div className="foot-w">
            <div className="foot-grid">
              <div className="foot-brand">
                <a href="#" className="logo">
                  <span className="logo-name">Porchelvan<span className="logo-accent">|</span>Builders</span>
                </a>
                <p>Founded by Er. J. Arulmozhiselvan B.E., building the finest structures with projects across the Delta region.</p>
              </div>
              {[
                { h: 'Capabilities', l: ['Architectural Design', 'Structural Engineering', 'General Contracting', 'Sustainability', 'Urban Planning'] },
                { h: 'Company', l: ['About Us', 'Our Team', 'Careers', 'Awards', 'Journal'] },
                { h: 'Legal', l: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'] },
              ].map(col => (
                <div key={col.h} className="foot-col">
                  <h4>{col.h}</h4>
                  <ul>{col.l.map(l => <li key={l}><a href="#">{l}</a></li>)}</ul>
                </div>
              ))}
            </div>
            <div className="foot-bottom">
              <p>© 2024 Porchelvan Builders Inc. All rights reserved.</p>
              <Link to="/admin" style={{
                fontSize: '0.78rem', color: 'var(--muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'color 0.25s', fontFamily: 'Space Grotesk, sans-serif', textTransform: 'uppercase', letterSpacing: '0.1em'
              }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#F59E0B'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted)'}
              >
                <HardHat size={14} /> Admin Portal
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
