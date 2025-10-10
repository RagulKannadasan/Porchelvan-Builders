import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Header from "./components/Header";
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
  const location = useLocation();

  return (
    <div>
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
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/register" element={<Register />} />
        <Route path="/address" element={<Address />} />
        <Route path="/service" element={<Service />} />
      </Routes>
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
