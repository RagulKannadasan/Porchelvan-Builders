import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, CheckCircle, Home, HardHat, Star,
  ArrowRight, Phone, Mail, Moon, Sun,
  Shield, Zap, Clock, Building, ChevronRight, Play, Menu, X
} from 'lucide-react';
import { motion } from 'framer-motion';
import House3D from '../components/House3D';
import API_BASE_URL from '../utils/api';

export default function LandingPage() {
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);



  const d = dark;

  const css = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', system-ui, sans-serif; }

    /* ── TOKENS ── */
    .pg {
      --bg:       ${d ? '#000000' : '#F8FAFC'};
      --bg2:      ${d ? '#111111' : '#FFFFFF'};
      --bg3:      ${d ? '#1A1A1A' : '#F1F5F9'};
      --border:   ${d ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.08)'};
      --text:     ${d ? '#E2E8F0' : '#0F172A'};
      --muted:    ${d ? 'rgba(226,232,240,0.5)' : '#64748B'};
      --accent:   #F97316;
      --navy:     ${d ? '#E2E8F0' : '#0F172A'};
      --card-shadow: ${d ? '0 4px 24px rgba(0,0,0,0.4)' : '0 4px 24px rgba(15,23,42,0.06)'};
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      transition: background 0.35s, color 0.35s;
    }

    /* ── NAV ── */
    .nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      padding: 1.4rem 0;
      transition: all 0.3s;
    }
    .nav.scrolled {
      background: ${d ? 'rgba(0,0,0,0.5)' : 'rgba(248,250,252,0.5)'};
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border);
      padding: 1rem 0;
    }
    .nav-w { max-width: 1280px; margin: 0 auto; padding: 0 2rem; display: flex; align-items: center; justify-content: space-between; }
    .logo { display: flex; align-items: center; gap: 0.6rem; text-decoration: none; }
    .logo-box {
      width: 36px; height: 36px; background: var(--accent);
      border-radius: 8px; display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: 1rem; color: #fff; flex-shrink: 0;
    }
    .logo-name { font-weight: 700; font-size: 1.05rem; color: var(--text); letter-spacing: -0.3px; }
    .nav-links { display: flex; gap: 0.5rem; list-style: none; }
    .nav-links a { 
      color: var(--text); 
      text-decoration: none; 
      font-size: 0.85rem; 
      font-weight: 600; 
      padding: 0.5rem 1.1rem;
      border-radius: 50px;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      background: transparent;
      border: 1px solid transparent;
    }
    .nav-links a:hover { 
      background: var(--bg2);
      color: var(--accent);
      border-color: var(--border);
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      transform: translateY(-1px);
    }
    .nav-right { display: flex; align-items: center; gap: 0.75rem; }
    .theme-btn {
      width: 36px; height: 36px; border-radius: 8px;
      border: 1px solid var(--border); background: var(--bg2);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: var(--muted); transition: all 0.2s;
    }
    .theme-btn:hover { color: var(--accent); border-color: var(--accent); }
    .btn-nav {
      background: var(--accent); color: #fff;
      padding: 0.55rem 1.25rem; border-radius: 50px;
      font-weight: 600; font-size: 0.85rem; border: none; cursor: pointer;
      transition: opacity 0.2s, transform 0.2s;
    }
    .btn-nav:hover { opacity: 0.88; transform: translateY(-1px); }

    /* ── HERO ── */
    .hero-wrapper { position: relative; width: 100%; min-height: 100vh; display: flex; align-items: center; overflow: hidden; padding-top: 80px; }
    .hero-3d-bg { position: absolute; top: 0; bottom: 0; left: 0; width: 140%; z-index: 0; pointer-events: auto; }
    .hero { position: relative; z-index: 2; max-width: 1280px; margin: 0 auto; width: 100%; padding: 0 2rem; display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center; pointer-events: none; }
    .hero-left { pointer-events: auto; }
    .hero-left { }
    .eyebrow {
      display: inline-flex; align-items: center; gap: 0.4rem;
      border: 1px solid var(--border); border-radius: 50px;
      padding: 0.35rem 0.9rem; font-size: 0.75rem; font-weight: 600;
      letter-spacing: 0.06em; text-transform: uppercase; color: var(--accent);
      margin-bottom: 1.5rem; background: var(--bg2);
    }
    .eyebrow-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); }
    .hero-h1 {
      font-size: clamp(2.6rem, 4vw, 3.8rem); font-weight: 800;
      line-height: 1.1; letter-spacing: -1.5px; color: var(--text);
      margin-bottom: 1.25rem;
    }
    .hero-h1 span { color: var(--accent); }
    .hero-p { font-size: 1rem; line-height: 1.75; color: var(--muted); margin-bottom: 2rem; max-width: 440px; }
    .hero-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; }
    .btn-primary {
      background: var(--accent); color: #fff;
      padding: 0.75rem 1.75rem; border-radius: 50px;
      font-weight: 600; font-size: 0.9rem; border: none; cursor: pointer;
      display: flex; align-items: center; gap: 0.45rem;
      transition: all 0.25s;
    }
    .btn-primary:hover { opacity: 0.88; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(249,115,22,0.35); }
    .btn-outline {
      background: transparent; border: 1.5px solid var(--border);
      color: var(--text); padding: 0.75rem 1.5rem; border-radius: 50px;
      font-weight: 500; font-size: 0.9rem; cursor: pointer;
      display: flex; align-items: center; gap: 0.5rem; transition: all 0.2s;
    }
    .btn-outline:hover { border-color: var(--accent); color: var(--accent); }
    .play-circle { width: 22px; height: 22px; border-radius: 50%; background: var(--bg3); display: flex; align-items: center; justify-content: center; }

    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-15px); }
      100% { transform: translateY(0px); }
    }

    .hero-right { position: relative; }
    .hero-img-wrap { border-radius: 20px; overflow: hidden; aspect-ratio: 4/5; box-shadow: var(--card-shadow); background: transparent; }
    .hero-img-wrap img { width:100%; height:100%; object-fit:cover; display:block; }
    .hero-img-overlay { position:absolute; inset:0; background:linear-gradient(180deg,transparent 65%,rgba(0,0,0,0.65) 100%); border-radius:20px; pointer-events:none; }
    .hero-float {
      position: absolute; top: -1rem; right: -1.5rem;
      background: var(--bg2); border: 1px solid var(--border);
      border-radius: 14px; padding: 1rem 1.25rem; text-align: center;
      box-shadow: var(--card-shadow);
    }
    .hero-float strong { display:block; font-size: 1.9rem; font-weight: 800; color: var(--accent); letter-spacing:-1px; line-height:1; }
    .hero-float span { font-size: 0.72rem; color: var(--muted); font-weight:500; }
    .hero-badge {
      position: absolute; bottom: 1.5rem; left: 1.5rem; right: 1.5rem;
      background: ${d ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.88)'};
      backdrop-filter: blur(12px); border: 1px solid var(--border);
      border-radius: 12px; padding: 1rem 1.25rem;
      display: flex; align-items: center; gap: 0.75rem;
    }
    .avatars { display:flex; }
    .av { width:28px; height:28px; border-radius:50%; border:2px solid var(--bg2); overflow:hidden; margin-left:-7px; }
    .av:first-child { margin-left:0; }
    .av img { width:100%; height:100%; object-fit:cover; }
    .badge-info strong { display:block; font-size:0.82rem; font-weight:700; color:var(--text); }
    .badge-info span { font-size:0.72rem; color:var(--muted); }
    .badge-stars { color: var(--accent); font-size:0.7rem; letter-spacing:1px; }


    /* ── SECTION SHARED ── */
    .sec { padding: 6rem 0; }
    .sec-w { max-width:1280px; margin:0 auto; padding:0 2rem; }
    .sec-tag { display:flex; align-items:center; gap:0.5rem; font-size:0.72rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:var(--accent); margin-bottom:0.75rem; }
    .sec-tag::before { content:''; display:block; width:20px; height:2px; background:var(--accent); border-radius:2px; }
    .sec-h2 { font-size: clamp(1.8rem,2.5vw,2.4rem); font-weight:800; letter-spacing:-1px; color:var(--text); line-height:1.15; }
    .sec-h2 span { color:var(--accent); }
    .sec-p { color:var(--muted); line-height:1.7; font-size:0.93rem; margin-top:0.75rem; max-width:460px; }
    .sec-row { display:flex; justify-content:space-between; align-items:flex-end; gap:1.5rem; margin-bottom:3rem; flex-wrap:wrap; }
    .link-more { display:flex; align-items:center; gap:0.3rem; font-size:0.85rem; font-weight:600; color:var(--accent); background:none; border:none; cursor:pointer; white-space:nowrap; }

    /* ── SERVICES ── */
    .svc-bg { background: var(--bg3); }
    .svc-grid { display:grid; grid-template-columns: repeat(3,1fr); gap:1px; background: var(--border); border: 1px solid var(--border); border-radius:16px; overflow:hidden; }
    .svc-card {
      background: var(--bg2); padding:2rem;
      transition: background 0.2s;
    }
    .svc-card:hover { background: var(--bg3); }
    .svc-icon { width:44px; height:44px; border-radius:10px; background: var(--bg3); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; color:var(--accent); margin-bottom:1.25rem; }
    .svc-card h3 { font-size:0.95rem; font-weight:700; color:var(--text); margin-bottom:0.4rem; }
    .svc-card p { font-size:0.85rem; color:var(--muted); line-height:1.65; }

    /* ── PROJECTS ── */
    .prj-grid { display:grid; grid-template-columns: repeat(3,1fr); gap:1.25rem; }
    .prj-card { border-radius:16px; overflow:hidden; position:relative; background:var(--bg2); border:1px solid var(--border); transition: transform 0.25s, box-shadow 0.25s; }
    .prj-card:hover { transform:translateY(-4px); box-shadow:var(--card-shadow); }
    .prj-card img { width:100%; aspect-ratio:3/2; object-fit:cover; display:block; }
    .prj-body { padding:1.25rem; }
    .prj-tag { display:inline-block; background: rgba(249,115,22,0.1); color:var(--accent); border:1px solid rgba(249,115,22,0.2); border-radius:50px; font-size:0.7rem; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; padding:0.2rem 0.65rem; margin-bottom:0.6rem; }
    .prj-body h3 { font-size:0.95rem; font-weight:700; color:var(--text); margin-bottom:0.2rem; }
    .prj-price { font-size:0.95rem; font-weight:800; color:var(--accent); }
    .prj-meta { display:flex; gap:0.75rem; margin-top:0.75rem; padding-top:0.75rem; border-top:1px solid var(--border); }
    .prj-meta span { display:flex; align-items:center; gap:0.3rem; font-size:0.75rem; color:var(--muted); font-weight:500; }

    /* ── PROCESS ── */
    .proc-bg { background: var(--bg3); }
    .proc-grid { display:grid; grid-template-columns:1fr 1fr; gap:5rem; align-items:start; }
    .proc-img { border-radius:20px; overflow:hidden; box-shadow:var(--card-shadow); position:sticky; top:120px; }
    .proc-img img { width:100%; aspect-ratio:4/5; object-fit:cover; display:block; }
    .step { display:flex; gap:1.25rem; padding:1.5rem 0; border-bottom:1px solid var(--border); }
    .step:last-child { border-bottom:none; }
    .step-n {
      width:36px; height:36px; border-radius:10px; flex-shrink:0;
      border:1.5px solid var(--border); display:flex; align-items:center; justify-content:center;
      font-size:0.78rem; font-weight:800; color:var(--muted);
      transition: border-color 0.2s, color 0.2s;
    }
    .step:hover .step-n { border-color:var(--accent); color:var(--accent); }
    .step h4 { font-size:0.92rem; font-weight:700; color:var(--text); margin-bottom:0.3rem; }
    .step p { font-size:0.85rem; color:var(--muted); line-height:1.6; }

    /* ── TESTIMONIALS ── */
    .testi-grid { display:grid; grid-template-columns: repeat(3,1fr); gap:1.25rem; }
    .testi-card { background:var(--bg2); border:1px solid var(--border); border-radius:16px; padding:1.75rem; transition: border-color 0.2s; }
    .testi-card:hover { border-color: rgba(249,115,22,0.3); }
    .testi-stars { color:var(--accent); font-size:0.8rem; letter-spacing:2px; margin-bottom:1rem; }
    .testi-q { font-size:0.88rem; color:var(--muted); line-height:1.7; margin-bottom:1.25rem; font-style:italic; }
    .testi-au { display:flex; align-items:center; gap:0.65rem; }
    .testi-av { width:36px; height:36px; border-radius:50%; overflow:hidden; border:2px solid var(--border); flex-shrink:0; }
    .testi-av img { width:100%; height:100%; object-fit:cover; }
    .testi-name { font-size:0.85rem; font-weight:700; color:var(--text); }
    .testi-role { font-size:0.75rem; color:var(--muted); }

    /* ── CTA / CONTACT ── */
    .contact-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 4rem; }
    .contact-info { background: var(--bg2); padding: 3rem; border-radius: 20px; border: 1px solid var(--border); height: 100%; }
    .contact-info-item { display: flex; gap: 1.25rem; margin-bottom: 2rem; }
    .contact-info-item:last-child { margin-bottom: 0; }
    .contact-icon { width: 48px; height: 48px; border-radius: 12px; background: rgba(249,115,22,0.1); color: var(--accent); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .contact-text h4 { font-size: 0.95rem; font-weight: 700; color: var(--text); margin-bottom: 0.3rem; }
    .contact-text p { font-size: 0.9rem; color: var(--muted); line-height: 1.5; }
    
    .contact-form { display: flex; flex-direction: column; gap: 1.5rem; background: var(--bg2); padding: 3rem; border-radius: 20px; border: 1px solid var(--border); box-shadow: var(--card-shadow); }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.6rem; }
    .form-group label { font-size: 0.8rem; font-weight: 700; color: var(--text); text-transform: uppercase; letter-spacing: 0.05em; }
    .form-group input, .form-group textarea { width: 100%; padding: 1rem 1.25rem; border-radius: 12px; border: 1px solid var(--border); background: var(--bg); color: var(--text); font-family: inherit; font-size: 0.95rem; transition: border-color 0.2s; outline: none; }
    .form-group input:focus, .form-group textarea:focus { border-color: var(--accent); }
    .btn-submit { background: var(--accent); color: white; padding: 1rem 2rem; border-radius: 50px; font-weight: 700; font-size: 0.95rem; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: opacity 0.2s; margin-top: 1rem; }
    .btn-submit:hover { opacity: 0.9; transform: translateY(-2px); }

    /* ── FOOTER ── */
    footer { background:var(--bg2); border-top:1px solid var(--border); padding:4rem 0 2rem; }
    .foot-w { max-width:1280px; margin:0 auto; padding:0 2rem; }
    .foot-grid { display:grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap:3rem; margin-bottom:3rem; }
    .foot-brand p { font-size:0.84rem; color:var(--muted); line-height:1.7; margin-top:0.75rem; max-width:260px; }
    .foot-contact { margin-top:1.25rem; display:flex; flex-direction:column; gap:0.5rem; }
    .foot-contact a { display:flex; align-items:center; gap:0.4rem; color:var(--muted); text-decoration:none; font-size:0.82rem; transition:color 0.2s; }
    .foot-contact a:hover { color:var(--accent); }
    .foot-col h4 { font-size:0.72rem; font-weight:700; letter-spacing:0.09em; text-transform:uppercase; color:var(--muted); margin-bottom:1rem; }
    .foot-col ul { list-style:none; display:flex; flex-direction:column; gap:0.5rem; }
    .foot-col ul a { color:var(--muted); text-decoration:none; font-size:0.84rem; transition:color 0.2s; }
    .foot-col ul a:hover { color:var(--accent); }
    .foot-bottom { border-top:1px solid var(--border); padding-top:1.5rem; display:flex; justify-content:space-between; align-items:center; }
    .foot-bottom p { font-size:0.78rem; color:var(--muted); }
    .foot-accent { color:var(--accent); }

    /* ── MOBILE MENU ── */
    .mobile-menu-btn { display: none; background: none; border: none; color: var(--text); cursor: pointer; padding: 0.5rem; }
    .mobile-menu-overlay {
      position: fixed; inset: 0; background: var(--bg); z-index: 200;
      display: flex; flex-direction: column; padding: 2rem;
      transform: translateX(100%); transition: transform 0.3s;
    }
    .mobile-menu-overlay.open { transform: translateX(0); }
    .mobile-menu-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; }
    .mobile-menu-links { display: flex; flex-direction: column; gap: 2rem; list-style: none; }
    .mobile-menu-links a { font-size: 1.5rem; font-weight: 700; color: var(--text); text-decoration: none; }
    .mobile-menu-links a:hover { color: var(--accent); }

    @media(max-width:1024px){
      .hero-wrapper { min-height: auto; flex-direction: column; padding-top: 120px; }
      .hero { padding-top: 0; padding-bottom: 3rem; grid-template-columns:1fr; gap:3rem; }
      .hero-3d-bg { position: relative; width: 100%; height: 50vh; top: auto; bottom: auto; left: auto; }
      .hero-right { display:none; }
      .prj-grid { grid-template-columns: repeat(2,1fr); }
      .proc-grid { grid-template-columns:1fr; }
      .proc-img { display:none; }
      .svc-grid { grid-template-columns: repeat(2,1fr); }
      .foot-grid { grid-template-columns: 1fr 1fr; }
      .testi-grid { grid-template-columns:1fr; }
    }
    @media(max-width:768px){
      .hero-3d-bg { height: 45vh; }
      .nav-links { display:none; }
      .btn-nav { display:none; }
      .mobile-menu-btn { display: flex; align-items: center; justify-content: center; }
      .svc-grid { grid-template-columns:1fr; }
      .prj-grid { grid-template-columns:1fr; }
      .contact-grid { grid-template-columns: 1fr; gap: 2.5rem; }
      .contact-info, .contact-form { padding: 2rem; }
      .form-row { grid-template-columns: 1fr; gap: 1rem; }
      .foot-grid { grid-template-columns:1fr; gap:2.5rem; }
      .sec { padding: 4rem 0; }
    }
    @media(max-width:480px){
      .hero-3d-bg { height: 40vh; }
      .hero { padding: 0 1.5rem 3rem; }
      .hero-h1 { font-size: 2.4rem; }
      .sec-w { padding: 0 1.5rem; }
      .nav-w { padding: 0 1.5rem; }
      .foot-w { padding: 0 1.5rem; }
      .testi-card { padding: 1.25rem; }
    }
  `;

  const projects = [
    { id:1, title:'Ocean Breeze Villa', price:'₹2.1 Cr', location:'Thanjavur', img:'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800', beds:4, baths:3, tag:'Luxury', sqft:'4,200' },
    { id:2, title:'Jubilee Residences',  price:'₹1.4 Cr', location:'Thiruvarur',    img:'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800', beds:3, baths:2, tag:'Premium', sqft:'3,100' },
    { id:3, title:'Lakeside Cottage',    price:'₹85 L',   location:'Kumbakonam',     img:'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800', beds:2, baths:2, tag:'Serene',  sqft:'1,800' },
  ];

  const services = [
    { icon:<Home size={20}/>,      title:'Custom Homes',          desc:'Bespoke residences built around your vision, lifestyle, and budget.' },
    { icon:<Building size={20}/>,  title:'Commercial Spaces',     desc:'Offices, retail, and hospitality projects built for lasting impact.' },
    { icon:<HardHat size={20}/>,   title:'Renovation',            desc:'Expert renovation that breathes new life into existing structures.' },
    { icon:<Shield size={20}/>,    title:'10-Year Warranty',      desc:'Every build backed by our comprehensive structural guarantee.' },
    { icon:<Zap size={20}/>,       title:'Smart Home Tech',       desc:'Seamlessly integrated automation from day one of construction.' },
    { icon:<Clock size={20}/>,     title:'On-Time Delivery',      desc:'96% on-time track record. We don\'t make promises we can\'t keep.' },
  ];

  const testimonials = [
    { name:'Ramesh Krishnan',    role:'Home Owner, Thanjavur',      text:'Porchelvan Builders exceeded every expectation. Our villa was delivered ahead of schedule and the craftsmanship is outstanding.', rating:5, img:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100' },
    { name:'Priya Subramaniam', role:'Property Investor',         text:'I\'ve worked with many builders across Tamil Nadu. Nobody matches their attention to detail and post-handover support.',          rating:5, img:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100' },
    { name:'Arun Mehta',        role:'Business Owner, Thiruvarur',   text:'From blueprint to key delivery — transparent, on-budget, and stress-free. Truly world-class builders.',                          rating:5, img:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100' },
  ];

  return (
    <div className="pg">
      <style>{css}</style>

      {/* ── NAV ── */}
      <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-w">
          <a href="#" className="logo">
            <div className="logo-box">P</div>
            <span className="logo-name">Porchelvan Builders</span>
          </a>
          <ul className="nav-links">
            {['Projects','Services','Process','About'].map(n => <li key={n}><a href="#">{n}</a></li>)}
            <li><a href="#contact">Contact</a></li>
          </ul>
          <div className="nav-right">
            <button className="theme-btn" onClick={() => setDark(!dark)} title="Toggle theme">
              {dark ? <Sun size={16}/> : <Moon size={16}/>}
            </button>
            <button className="btn-nav" onClick={() => document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}>Get Quote</button>
            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── MOBILE MENU OVERLAY ── */}
      <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-top">
          <div className="logo-box">P</div>
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(false)}>
            <X size={28} />
          </button>
        </div>
        <ul className="mobile-menu-links">
          {['Projects','Services','Process','About'].map(n => (
            <li key={n}><a href="#" onClick={() => setMobileMenuOpen(false)}>{n}</a></li>
          ))}
          <li><a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a></li>
        </ul>
      </div>

      {/* ── HERO ── */}
      <div className="hero-wrapper">
        <div className="hero-3d-bg">
          <House3D />
        </div>
        <div className="hero-3d-overlay" />
        
        <div className="hero">
          <motion.div 
            className="hero-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="eyebrow"><div className="eyebrow-dot"/>Thanjavur's Premier Builder</div>
            <h1 className="hero-h1">Building Homes<br/>That <span>Last</span><br/>Generations</h1>
            <p className="hero-p">From our roots in Thanjavur, Porchelvan Builders has become the Delta region's most trusted name in residential and commercial construction — blending craftsmanship with modern precision.</p>
            <div className="hero-actions">
              <button className="btn-primary">Explore Projects <ArrowRight size={15}/></button>
              <button className="btn-outline">
                <div className="play-circle"><Play size={10} fill="currentColor"/></div>
                Watch Story
              </button>
            </div>
          </motion.div>

          {/* Right side is intentionally left empty for the 3D model to be fully visible and interactive */}
          <div className="hero-right" />
        </div>
      </div>


      {/* ── SERVICES ── */}
      <section className="sec svc-bg">
        <motion.div 
          className="sec-w"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="sec-row">
            <div>
              <div className="sec-tag">What We Do</div>
              <h2 className="sec-h2">Every Service You<br/><span>Need to Build</span></h2>
            </div>
            <button className="link-more">All Services <ChevronRight size={15}/></button>
          </div>
          <div className="svc-grid">
            {services.map((s,i) => (
              <div key={i} className="svc-card">
                <div className="svc-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── PROJECTS ── */}
      <section className="sec">
        <motion.div 
          className="sec-w"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="sec-row">
            <div>
              <div className="sec-tag">Portfolio</div>
              <h2 className="sec-h2">Our <span>Finest</span> Work</h2>
              <p className="sec-p">Discover our most acclaimed builds — each one a testament to precision, premium materials, and modern design.</p>
            </div>
            <button className="link-more">View All <ChevronRight size={15}/></button>
          </div>
          <div className="prj-grid">
            {projects.map(p => (
              <div key={p.id} className="prj-card">
                <img src={p.img} alt={p.title}/>
                <div className="prj-body">
                  <div className="prj-tag">{p.tag}</div>
                  <h3>{p.title}</h3>
                  <div className="prj-price">{p.price}</div>
                  <div className="prj-meta">
                    <span><HardHat size={11}/> {p.beds} Beds · {p.baths} Baths</span>
                    <span><MapPin size={11}/> {p.location}</span>
                    <span>{p.sqft} sq.ft</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── PROCESS ── */}
      <section className="sec proc-bg">
        <motion.div 
          className="sec-w"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="proc-grid">
            <div className="proc-img">
              <img src="https://images.unsplash.com/photo-1541888086225-f6404f456108?q=80&w=800" alt="Construction"/>
            </div>
            <div>
              <div className="sec-tag">Our Process</div>
              <h2 className="sec-h2" style={{marginBottom:'0.5rem'}}>Built Right,<br/><span>Every Time</span></h2>
              <p className="sec-p" style={{marginBottom:'2.5rem'}}>Our 5-step process keeps you confident and informed from the first meeting to key handover.</p>
              <div>
                {[
                  { t:'Initial Consultation', d:'We understand your vision, budget, and timeline to plan the right approach.' },
                  { t:'Blueprint & Approvals',  d:'Detailed architectural plans and full handling of all municipal permits.' },
                  { t:'Material Sourcing',      d:'Premium-grade materials from certified vendors — zero quality compromise.' },
                  { t:'Expert Construction',    d:'Skilled crews with daily updates via our real-time client portal app.' },
                  { t:'Handover & Warranty',    d:'Full inspection, snag clearance, and 10-year structural warranty.' },
                ].map((s,i) => (
                  <div key={i} className="step">
                    <div className="step-n">0{i+1}</div>
                    <div>
                      <h4>{s.t}</h4>
                      <p>{s.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="sec">
        <motion.div 
          className="sec-w"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="sec-row">
            <div>
              <div className="sec-tag">Testimonials</div>
              <h2 className="sec-h2">Words From<br/><span>Happy Owners</span></h2>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:'0.4rem',color:'var(--accent)',fontWeight:700,fontSize:'0.9rem'}}>
              <Star size={16} fill="var(--accent)"/> 4.9 / 5 Average
            </div>
          </div>
          <div className="testi-grid">
            {testimonials.map((t,i) => (
              <div key={i} className="testi-card">
                <div className="testi-stars">{'★'.repeat(t.rating)}</div>
                <p className="testi-q">"{t.text}"</p>
                <div className="testi-au">
                  <div className="testi-av"><img src={t.img} alt={t.name}/></div>
                  <div>
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="sec">
        <motion.div 
          className="sec-w"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="sec-row">
            <div>
              <div className="sec-tag">Contact Us</div>
              <h2 className="sec-h2">Let's Build <span>Together</span></h2>
              <p className="sec-p">Schedule a free consultation or send us a message. Our team will get back to you within 24 hours.</p>
            </div>
          </div>
          
          <div className="contact-grid">
            <div className="contact-info">
              <div className="contact-info-item">
                <div className="contact-icon"><Phone size={20}/></div>
                <div className="contact-text">
                  <h4>Call Us Directly</h4>
                  <p>+91 98765 43210<br/>Mon-Sat: 9AM - 6PM</p>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="contact-icon"><Mail size={20}/></div>
                <div className="contact-text">
                  <h4>Email Enquiries</h4>
                  <p>hello@porchelvan.com<br/>projects@porchelvan.com</p>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="contact-icon"><MapPin size={20}/></div>
                <div className="contact-text">
                  <h4>Head Office</h4>
                  <p>42, Medical College Road,<br/>Thanjavur, Tamil Nadu 613004</p>
                </div>
              </div>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" placeholder="John" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" placeholder="Doe" required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" placeholder="john@example.com" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" placeholder="+91" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Project Type</label>
                <select value={formData.projectType} onChange={e => setFormData({...formData, projectType: e.target.value})} style={{width:'100%', padding:'1rem 1.25rem', borderRadius:'12px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text)', fontFamily:'inherit', fontSize:'0.95rem', outline:'none'}}>
                  <option value="residential">Residential / Custom Home</option>
                  <option value="commercial">Commercial Space</option>
                  <option value="renovation">Renovation</option>
                  <option value="other">Other Inquiry</option>
                </select>
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea rows={4} placeholder="Tell us about your project requirements, budget, or any questions you have..." required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
              </div>
              
              {submitStatus === 'success' && <div style={{color: '#10B981', fontSize: '0.9rem', fontWeight: '600', padding: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px'}}>Thank you! Your inquiry has been submitted.</div>}
              {submitStatus === 'error' && <div style={{color: '#EF4444', fontSize: '0.9rem', fontWeight: '600', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px'}}>Failed to send. Please try again.</div>}

              <button type="submit" className="btn-submit" disabled={submitting} style={{ opacity: submitting ? 0.7 : 1 }}>
                {submitting ? 'Sending...' : 'Post Message'} {!submitting && <ArrowRight size={16}/>}
              </button>
            </form>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <div className="foot-w">
          <div className="foot-grid">
            <div className="foot-brand">
              <a href="#" className="logo">
                <div className="logo-box">P</div>
                <span className="logo-name">Porchelvan Builders</span>
              </a>
              <p>Building the finest homes since 1996, headquartered in Thanjavur with projects across the Delta region.</p>
              <div className="foot-contact">
                <a href="tel:+919876543210"><Phone size={13}/> +91 98765 43210</a>
                <a href="mailto:hello@porchelvan.com"><Mail size={13}/> hello@porchelvan.com</a>
                <a href="#"><MapPin size={13}/> 42, Medical College Rd, Thanjavur</a>
              </div>
            </div>
            {[
              { h:'Services', l:['Custom Homes','Commercial','Renovations','Smart Homes','Interiors'] },
              { h:'Company',  l:['About Us','Our Team','Careers','Awards','Blog'] },
              { h:'Support',  l:['Client Portal','Warranty','FAQs','Terms','Privacy'] },
            ].map(col => (
              <div key={col.h} className="foot-col">
                <h4>{col.h}</h4>
                <ul>{col.l.map(l => <li key={l}><a href="#">{l}</a></li>)}</ul>
              </div>
            ))}
          </div>
          <div className="foot-bottom">
            <p>© 2024 Porchelvan Builders. All rights reserved.</p>
            <Link to="/admin" className="foot-admin-btn" style={{
              fontSize: '0.78rem',
              color: 'var(--muted)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#F97316'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted)'}
            >
              <HardHat size={12} /> Admin Portal
            </Link>
            <p>Made with <span className="foot-accent">♥</span> in Thanjavur</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
