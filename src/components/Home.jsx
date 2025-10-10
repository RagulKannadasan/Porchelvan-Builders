import React from 'react';

const Home = () => {
  return (
    <div>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1>Build Your Own House</h1>
      </div>

      <div style={{ padding: '2rem' }}>
        <h2>About Us</h2>
        <p>
          Porchelvan Builders is a trusted ARULMOZHISELVAN in the construction industry, dedicated to delivering high-quality residential and commercial projects. With 10 years of experience, we pride ourselves on precision, innovation, and customer satisfaction.
        </p>
      </div>

      <div style={{ padding: '2rem' }}>
        <h2>Our Services</h2>
        <ul>
          <li>Residential Construction</li>
          <li>Commercial Construction</li>
          <li>Renovation and Remodeling</li>
          <li>Interior Design</li>
          <li>Architectural Planning</li>
        </ul>
        <button>REGISTER</button>
      </div>

      <div style={{ padding: '2rem' }}>
        <h2>Images</h2>
        <a href="#">Click to view more on site project images...</a>
      </div>
    </div>
  );
};

export default Home;