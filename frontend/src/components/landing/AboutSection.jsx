import React from 'react';
import workerImg from '../../assets/images/external/architectural-engineering-cons.png';

export default function AboutSection() {
  return (
    <section id="about" className="lp-about-sec">
      <div className="lp-container">
        <div className="lp-about-grid">
          <div className="lp-about-content">
            <span className="lp-sec-tag">About Us</span>
            <h2 className="lp-about-h2">Redefining Construction Standards</h2>
            <p className="lp-about-desc">
              Committed to innovation, expertise, and unwavering dedication to excellence. 
              At Porchelvan Builders, we blend cutting-edge technology with timeless craftsmanship 
              to deliver structures that stand the test of time.
            </p>
            <p className="lp-about-desc">
              From the initial architectural design to the final finishing touches, our team of 
              experienced professionals ensures that every project meets the highest industry standards.
            </p>
            <div style={{ marginTop: '2.5rem' }}>
              <a href="#contact" className="lp-btn-pill" style={{ display: 'inline-flex' }}>
                Discover Our Story
              </a>
            </div>
          </div>
          <div className="lp-about-image-wrapper">
            <div className="lp-about-image">
              <img src={workerImg} alt="Construction Team" />
              <div className="lp-about-badge">
                <span className="badge-number">15+</span>
                <span className="badge-text">Years Experience</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
