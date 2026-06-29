import React from 'react';
import { Users, HardHat, Activity, Package } from 'lucide-react';

export default function StatsBanner() {
  return (
    <section className="lp-stats-banner">
      <div className="lp-container">
        <div className="lp-stats-grid">
          <div className="lp-stat-card">
            <div className="lp-stat-val">
              5K+ <Users className="lp-stat-icon" size={32} />
            </div>
            <h3 className="lp-stat-title">Projects Completed</h3>
            <div className="lp-stat-desc">Delivering excellence in every build, every time.</div>
          </div>
          <div className="lp-stat-card">
            <div className="lp-stat-val">
              250+ <HardHat className="lp-stat-icon" size={32} />
            </div>
            <h3 className="lp-stat-title">Skilled Professionals</h3>
            <div className="lp-stat-desc">Experts driven by precision, passion, and experience.</div>
          </div>
          <div className="lp-stat-card">
            <div className="lp-stat-val">
              35+ <Activity className="lp-stat-icon" size={32} />
            </div>
            <h3 className="lp-stat-title">Industry Excellence</h3>
            <div className="lp-stat-desc">Leading with innovative solutions that set standards.</div>
          </div>
          <div className="lp-stat-card">
            <div className="lp-stat-val">
              1M+ <Package className="lp-stat-icon" size={32} />
            </div>
            <h3 className="lp-stat-title">Tons of Materials</h3>
            <div className="lp-stat-desc">Providing quality resources to meet all project needs.</div>
          </div>
        </div>
      </div>
    </section>
  );
}
