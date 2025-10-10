import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Gallery from "./components/Gallery";
import Register from "./components/Register";
import Address from "./components/Address";
import Service from "./components/Service";
import About from "./components/About";
import Contact from "./components/Contact";
import './App.css';

const AppContent = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div className="header">
        <img src="/logo.png" alt="Porchelvan Builders Logo" />
        <div className="header-text">
          <h1>Porchelvan Builders</h1>
          <span>Quality Assured</span>
        </div>
      </div>
      <nav>
        <ul>
          <li>
            <Link to="/">HOME</Link>
          </li>
          <li>
            <Link to="/about">ABOUT</Link>
          </li>
          <li>
            <Link to="/contact">CONTACT</Link>
          </li>
          <li>
            <Link to="/service">SERVICE</Link>
          </li>
          <li>
            <Link to="/register">REGISTER</Link>
          </li>
        </ul>
      </nav>
      <div className="content" style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/register" element={<Register />} />
          <Route path="/address" element={<Address />} />
          <Route path="/service" element={<Service />} />
        </Routes>
      </div>
      <Footer />
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
