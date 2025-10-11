import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Build Your Own House</h1>
      </div>

      <div className="about-section">
        <h2>About Us</h2>
        <p>
          Porchelvan Builders is a trusted ARULMOZHISELVAN in the construction industry, dedicated to delivering high-quality residential and commercial projects. With 10 years of experience, we pride ourselves on precision, innovation, and customer satisfaction.
        </p>
      </div>

      <div className="services-section">
        <h2>Our Services</h2>
        <ul>
          <li>Residential Construction</li>
          <li>Commercial Construction</li>
          <li>Renovation and Remodeling</li>
          <li>Interior Design</li>
          <li>Architectural Planning</li>
        </ul>
        <Link to="/register">
          <button className="register-btn">REGISTER</button>
        </Link>
      </div>

      <div className="gallery-section">
        <h2>Images</h2>
        <Link to="/gallery">Click to view more on site project images...</Link>
      </div>
    </div>
  );
};

export default Home;