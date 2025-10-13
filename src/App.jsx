import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Gallery from "./components/Gallery";
import Register from "./components/Register";
import Address from "./components/Address";
import Service from "./components/Service";
import About from "./components/About";
import Contact from "./components/Contact";
import AdminLogin from "./components/AdminLogin";
import AdminPage from "./pages/AdminPage";
import './App.css';

const AppContent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div style={{ display: isAdminPage ? 'block' : 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isAdminPage && (
        <>
          <div className="header">
            <div className="header-content">
              <img src="/logo.png" alt="Porchelvan Builders Logo" className="logo"/>
              <div className="header-text">
                <h1>Porchelvan Builders</h1>
                <span>Quality Assured</span>
              </div>
            </div>
            <button className="menu-button" onClick={toggleMenu}>
              <div />
              <div />
              <div />
            </button>
          </div>
          <nav className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
            <ul>
              <li className="quit-button-container">
                <button onClick={toggleMenu} className="quit-button">×</button>
              </li>
              <li><Link to="/" onClick={toggleMenu}>HOME</Link></li>
              <li><Link to="/about" onClick={toggleMenu}>ABOUT</Link></li>
              <li><Link to="/contact" onClick={toggleMenu}>CONTACT</Link></li>
              <li><Link to="/service" onClick={toggleMenu}>SERVICE</Link></li>
              <li><Link to="/register" onClick={toggleMenu}>REGISTER</Link></li>
              <li><Link to="/admin" onClick={toggleMenu}>ADMIN</Link></li>
            </ul>
          </nav>
        </>
      )}
      <div className="content" style={{ flex: isAdminPage ? '' : 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/register" element={<Register />} />
          <Route path="/address" element={<Address />} />
          <Route path="/service" element={<Service />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin-panel" element={<AdminPage />} />
        </Routes>
      </div>
      {!isAdminPage && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
