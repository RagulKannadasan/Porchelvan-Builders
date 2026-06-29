import React from 'react';
import { ArrowRight } from 'lucide-react';
import architectureImg from '../../assets/images/external/architecture-drawing-building..png';
import civilImg from '../../assets/images/external/architectural-engineering-civi.png';
import machineryImg from '../../assets/images/external/architectural-engineering-roya.png';

export default function ServicesSection() {
  return (
    <section id="services" className="lp-services-sec">
      <div className="lp-container">
        <div className="lp-services-header">
          <div className="lp-left">
            <span className="lp-sec-tag" style={{ color: '#FDBA12' }}>Our Services</span>
            <h2 className="lp-services-title">Expertise You Can Build On</h2>
            <p>
              Porchelvan Builders delivers innovative, quality construction tailored to your vision with a focus on sustainability and excellence.
            </p>
          </div>
          <a href="#contact" className="lp-btn-pill">
            Explore More <ArrowRight size={16} />
          </a>
        </div>

        <div className="lp-service-grid">
          {/* Card 1 */}
          <div className="lp-service-card">
            <div className="lp-service-img">
              <img src={architectureImg} alt="Architectural Design" />
            </div>
            <div className="lp-service-content">
              <div className="lp-service-num">01</div>
              <h3>Architectural Design Services</h3>
              <p>
                Our expert team creates modern, functional, and visually captivating architectural designs. We blend creativity with technical precision.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="lp-service-card" style={{ marginTop: '2rem' }}>
            <div className="lp-service-img">
              <img src={machineryImg} alt="Construction Management" />
            </div>
            <div className="lp-service-content">
              <div className="lp-service-num">02</div>
              <h3>Construction Management</h3>
              <p>
                From start to finish, we handle every aspect of your project with unmatched efficiency. Our services include scheduling, budgeting, and on-site coordination.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="lp-service-card">
            <div className="lp-service-img">
              <img src={civilImg} alt="Structural Engineering" />
            </div>
            <div className="lp-service-content">
              <div className="lp-service-num">03</div>
              <h3>Advanced Structural Engineering</h3>
              <p>
                Delivering robust and reliable structural solutions with cutting-edge technology to ensure safety, durability, and efficiency in every build.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
