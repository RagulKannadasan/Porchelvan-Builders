import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConstructionAnimation2D() {
  const [step, setStep] = useState(0);

  // Cinematic 15-Second Workflow
  useEffect(() => {
    let isMounted = true;
    const runSequence = async () => {
      while (isMounted) {
        setStep(0); // Reset
        await new Promise((r) => setTimeout(r, 600));
        if (!isMounted) break;

        for (let i = 1; i <= 8; i++) {
          setStep(i);
          await new Promise((r) => setTimeout(r, 1400));
          if (!isMounted) break;
        }

        setStep(9);
        await new Promise((r) => setTimeout(r, 4500));
        if (!isMounted) break;

        setStep(10);
        await new Promise((r) => setTimeout(r, 1000));
      }
    };
    runSequence();
    return () => {
      isMounted = false;
    };
  }, []);

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } },
    exit: { opacity: 0, transition: { duration: 0.5 } },
  };

  const slideUpFade = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.5 } },
  };

  const isVisible = (reqStep) => step >= reqStep && step < 10;
  const animState = (reqStep) => (isVisible(reqStep) ? 'visible' : step === 10 ? 'exit' : 'hidden');

  const Worker = ({ x, y, flip = false, active = true, type = 'hammer' }) => {
    if (!active) return null;
    return (
      <g transform={`translate(${x}, ${y}) scale(${flip ? -1 : 1}, 1)`}>
        <motion.g
          animate={{ y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 0.6 }}
        >
          <ellipse cx="0" cy="-15" rx="8" ry="3" fill="rgba(0,0,0,0.2)" />
          <rect x="-6" y="-35" width="12" height="20" fill="url(#worker-orange)" rx="2" />
          <rect x="-5" y="-35" width="10" height="20" fill="url(#worker-yellow)" />
          <rect x="-6" y="-15" width="12" height="15" fill="#1E293B" />
          <circle cx="0" cy="-45" r="6" fill="#FCD34D" />
          <path d="M -8 -45 Q 0 -55 8 -45 L 10 -45 L 10 -42 L -10 -42 Z" fill="#F59E0B" />
          
          {/* Back Arm */}
          <rect x="5" y="-35" width="4" height="15" fill="url(#worker-orange)" rx="2" />

          {/* Front Animated Arm based on type */}
          {type === 'hammer' && (
            <motion.g
              style={{ originX: '0px', originY: '-30px' }}
              animate={{ rotate: [-20, 60, -20] }}
              transition={{ repeat: Infinity, duration: 0.5, ease: 'easeInOut' }}
            >
              <rect x="-9" y="-35" width="4" height="15" fill="url(#worker-orange)" rx="2" />
              <rect x="-12" y="-20" width="10" height="4" fill="#94A3B8" />
              <rect x="-9" y="-22" width="4" height="8" fill="#475569" />
            </motion.g>
          )}
          
          {type === 'weld' && (
            <motion.g
              style={{ originX: '0px', originY: '-30px' }}
              animate={{ rotate: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 0.2, ease: 'linear' }}
            >
              <rect x="-9" y="-35" width="4" height="15" fill="url(#worker-orange)" rx="2" transform="rotate(-30, -9, -35)" />
              <rect x="-20" y="-25" width="8" height="4" fill="#1E293B" />
              <motion.circle
                 cx="-25" cy="-23" r="4" fill="#FCD34D"
                 animate={{ scale: [0, 1.5, 0], opacity: [1, 0, 1] }}
                 transition={{ repeat: Infinity, duration: 0.15 }}
              />
            </motion.g>
          )}

          {type === 'walk' && (
            <rect x="-9" y="-35" width="4" height="15" fill="url(#worker-orange)" rx="2" />
          )}
        </motion.g>
      </g>
    );
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '5 / 4',
        minHeight: '300px',
        maxHeight: '700px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
      }}
    >
      <AnimatePresence>
        <svg
          viewBox="0 0 1000 800"
          style={{ width: '100%', height: '100%', maxWidth: '1000px', overflow: 'visible' }}
        >
          <defs>
            <filter id="drop-shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="-10" dy="20" stdDeviation="15" floodColor="#0F172A" floodOpacity="0.4" />
            </filter>
            <filter id="shadow-soft" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="-5" dy="10" stdDeviation="8" floodColor="#0F172A" floodOpacity="0.3" />
            </filter>
            
            <linearGradient id="concrete-light" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F8FAFC" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
            <linearGradient id="concrete-dark" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#64748B" />
            </linearGradient>
            <linearGradient id="plaster-white" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>
            <linearGradient id="plaster-navy" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="wood" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#92400E" />
              <stop offset="50%" stopColor="#B45309" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>
            <linearGradient id="glass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0EA5E9" />
              <stop offset="50%" stopColor="#0369A1" />
              <stop offset="100%" stopColor="#0C4A6E" />
            </linearGradient>
            <linearGradient id="glass-reflection" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
              <stop offset="30%" stopColor="rgba(255,255,255,0.0)" />
              <stop offset="70%" stopColor="rgba(255,255,255,0.0)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.3)" />
            </linearGradient>
            <linearGradient id="metal" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#94A3B8" />
              <stop offset="50%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#64748B" />
            </linearGradient>
            <linearGradient id="dirt" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>
            <linearGradient id="worker-orange" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#F97316"/><stop offset="100%" stopColor="#C2410C"/></linearGradient>
            <linearGradient id="worker-yellow" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FBBF24"/><stop offset="100%" stopColor="#D97706"/></linearGradient>

            <pattern id="realistic-brick" width="30" height="15" patternUnits="userSpaceOnUse">
              <rect width="30" height="15" fill="#E2E8F0" />
              <rect x="0" y="0" width="14" height="6" fill="#94A3B8" />
              <rect x="15" y="0" width="15" height="6" fill="#CBD5E1" />
              <rect x="-7" y="7" width="14" height="6" fill="#CBD5E1" />
              <rect x="8" y="7" width="14" height="6" fill="#94A3B8" />
              <rect x="23" y="7" width="14" height="6" fill="#CBD5E1" />
            </pattern>
          </defs>

          {/* BASE */}
          <line x1="0" y1="650" x2="1000" y2="650" stroke="#64748B" strokeWidth="4" />
          <rect x="0" y="652" width="1000" height="150" fill="url(#concrete-light)" opacity="0.1" />

          {/* STEP 1: Basement & Excavation */}
          <motion.g initial="hidden" animate={animState(1)} variants={fadeIn}>
            <path d="M 200 650 L 250 710 L 750 710 L 800 650 Z" fill="url(#dirt)" />
            <rect x="330" y="680" width="60" height="20" fill="url(#concrete-dark)" />
            <rect x="330" y="680" width="60" height="3" fill="#E2E8F0" />
            <rect x="660" y="680" width="60" height="20" fill="url(#concrete-dark)" />
            <rect x="660" y="680" width="60" height="3" fill="#E2E8F0" />
            <rect x="270" y="680" width="40" height="20" fill="url(#concrete-dark)" />
            <rect x="270" y="680" width="40" height="3" fill="#E2E8F0" />
            <line x1="345" y1="620" x2="345" y2="680" stroke="#B45309" strokeWidth="3" />
            <line x1="375" y1="620" x2="375" y2="680" stroke="#B45309" strokeWidth="3" />
            <line x1="675" y1="620" x2="675" y2="680" stroke="#B45309" strokeWidth="3" />
            <line x1="705" y1="620" x2="705" y2="680" stroke="#B45309" strokeWidth="3" />
          </motion.g>

          {/* MACHINERY & WORKERS */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 1 && step <= 8 ? 1 : 0 }} transition={{ duration: 0.5 }}>
            <g transform="translate(820, 200)">
              <rect x="0" y="0" width="15" height="450" fill="url(#worker-orange)" />
              <rect x="0" y="0" width="3" height="450" fill="rgba(255,255,255,0.3)" />
              <path d="M 0 50 L 15 80 M 15 50 L 0 80 M 0 110 L 15 140 M 15 110 L 0 140 M 0 170 L 15 200" stroke="#78350F" strokeWidth="2" fill="none" />
              <motion.g animate={{ rotate: [-1, 1, -1] }} style={{ originX: '7px', originY: '15px' }} transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}>
                <rect x="-350" y="10" width="380" height="12" fill="url(#worker-orange)" />
                <rect x="-350" y="10" width="380" height="3" fill="rgba(255,255,255,0.3)" />
                <motion.g animate={{ x: [0, 120, 0] }} transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}>
                  <line x1="-250" y1="22" x2="-250" y2="150" stroke="#64748B" strokeWidth="2" />
                  <rect x="-260" y="150" width="20" height="24" fill="url(#metal)" rx="2" filter="url(#shadow-soft)" />
                  <rect x="-255" y="155" width="10" height="14" fill="#0F172A" />
                </motion.g>
              </motion.g>
              <rect x="35" y="10" width="35" height="20" fill="url(#plaster-navy)" rx="2" />
            </g>

            <motion.g animate={{ x: [0, -100, 0] }} transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}>
              <Worker x={420} y={650} active={true} type="walk" />
            </motion.g>
            <Worker x={520} y={350} active={step >= 4} type="hammer" />
            <Worker x={330} y={130} active={step >= 6} type="weld" />
          </motion.g>

          {/* STEP 2: Ground Pillars */}
          <motion.g initial="hidden" animate={animState(2)} variants={slideUpFade}>
            <rect x="330" y="370" width="50" height="280" fill="url(#concrete-dark)" />
            <rect x="330" y="370" width="8" height="280" fill="rgba(255,255,255,0.15)" />
            <rect x="660" y="370" width="50" height="280" fill="url(#concrete-dark)" />
            <rect x="660" y="370" width="8" height="280" fill="rgba(255,255,255,0.15)" />
            <rect x="270" y="350" width="30" height="300" fill="url(#concrete-dark)" />
          </motion.g>

          {/* STEP 3: Ground Walls */}
          <motion.g initial="hidden" animate={animState(3)} variants={fadeIn}>
            <rect x="380" y="370" width="280" height="280" fill="url(#realistic-brick)" />
          </motion.g>

          {/* STEP 4: Ground Slab */}
          <motion.g initial="hidden" animate={animState(4)} variants={slideUpFade}>
            <rect x="250" y="350" width="480" height="20" fill="url(#metal)" rx="2" filter="url(#shadow-soft)" />
            <rect x="250" y="350" width="480" height="4" fill="#FFFFFF" rx="1" opacity="0.4" />
          </motion.g>

          {/* STEP 5: Ground Finish (Paint, Details, Base) */}
          <motion.g initial="hidden" animate={animState(5)} variants={fadeIn}>
            {/* Ground Plaster */}
            <rect x="350" y="370" width="350" height="280" fill="url(#concrete-light)" />
            <rect x="280" y="350" width="160" height="250" fill="url(#concrete-light)" filter="url(#shadow-soft)" />
            
            {/* Wooden Door */}
            <rect x="480" y="440" width="70" height="210" fill="url(#wood)" rx="2" />
            {[...Array(8)].map((_, i) => (
              <line key={`door-${i}`} x1="480" y1={460 + i * 25} x2="550" y2={460 + i * 25} stroke="#78350F" strokeWidth="2" opacity="0.5" />
            ))}
            
            {/* Ground Window */}
            <rect x="570" y="480" width="90" height="120" fill="url(#plaster-navy)" rx="2" />
            <rect x="575" y="485" width="22" height="110" fill="url(#glass)" />
            <rect x="575" y="485" width="22" height="110" fill="url(#glass-reflection)" />
            <rect x="604" y="485" width="22" height="110" fill="url(#glass)" />
            <rect x="604" y="485" width="22" height="110" fill="url(#glass-reflection)" />
            <rect x="633" y="485" width="22" height="110" fill="url(#glass)" />
            <rect x="633" y="485" width="22" height="110" fill="url(#glass-reflection)" />

            {/* Bottom Tower Glass */}
            <rect x="350" y="360" width="70" height="200" fill="url(#plaster-navy)" rx="2" />
            {[...Array(4)].map((_, i) => (
              <React.Fragment key={`t-glass-bot-${i}`}>
                <rect x="355" y={365 + i * 47} width="25" height="42" fill="url(#glass)" />
                <rect x="355" y={365 + i * 47} width="25" height="42" fill="url(#glass-reflection)" />
                <rect x="390" y={365 + i * 47} width="25" height="42" fill="url(#glass)" />
                <rect x="390" y={365 + i * 47} width="25" height="42" fill="url(#glass-reflection)" />
              </React.Fragment>
            ))}

            {/* Ground Polished Base */}
            <rect x="250" y="580" width="550" height="70" fill="url(#concrete-light)" />
            <rect x="250" y="580" width="550" height="5" fill="#FFFFFF" opacity="0.5" />
            <rect x="250" y="580" width="550" height="20" fill="url(#concrete-dark)" rx="2" />
            <path d="M 230 650 L 270 690 L 770 690 L 820 650 Z" fill="#1E293B" opacity="0.6" filter="url(#shadow-soft)" />
          </motion.g>

          {/* STEP 6: 2nd Floor Pillars */}
          <motion.g initial="hidden" animate={animState(6)} variants={slideUpFade}>
            <rect x="270" y="150" width="30" height="200" fill="url(#concrete-dark)" />
            <rect x="430" y="100" width="40" height="250" fill="url(#concrete-dark)" />
            <rect x="690" y="100" width="40" height="250" fill="url(#concrete-dark)" />
          </motion.g>

          {/* STEP 7: 2nd Floor Walls */}
          <motion.g initial="hidden" animate={animState(7)} variants={fadeIn}>
            <rect x="300" y="150" width="130" height="200" fill="url(#realistic-brick)" />
            <rect x="470" y="100" width="220" height="250" fill="url(#realistic-brick)" />
          </motion.g>

          {/* STEP 8: 2nd Floor Roof Slabs */}
          <motion.g initial="hidden" animate={animState(8)} variants={fadeIn}>
            <rect x="260" y="130" width="180" height="20" fill="url(#metal)" rx="2" filter="url(#shadow-soft)" />
            <rect x="260" y="130" width="180" height="4" fill="#FFFFFF" rx="1" opacity="0.4" />
            <rect x="420" y="80" width="320" height="20" fill="url(#metal)" rx="2" filter="url(#shadow-soft)" />
            <rect x="420" y="80" width="320" height="4" fill="#FFFFFF" rx="1" opacity="0.4" />
          </motion.g>

          {/* STEP 9: 2nd Floor Finish (Paint, Balcony, White Box) */}
          <motion.g initial="hidden" animate={animState(9)} variants={fadeIn}>
            {/* Top Tower Plaster */}
            <rect x="280" y="150" width="160" height="200" fill="url(#concrete-light)" filter="url(#shadow-soft)" />
            <rect x="280" y="150" width="160" height="30" fill="rgba(15,23,42,0.15)" />
            <rect x="280" y="220" width="160" height="40" fill="url(#concrete-dark)" />
            
            {/* Upper Plaster */}
            <rect x="440" y="100" width="280" height="170" fill="url(#concrete-dark)" />
            <rect x="440" y="100" width="280" height="25" fill="rgba(15,23,42,0.12)" />

            {/* The White Box Structure */}
            <rect x="420" y="270" width="320" height="200" fill="url(#plaster-white)" filter="url(#drop-shadow)" />
            <rect x="420" y="270" width="320" height="5" fill="#FFFFFF" />
            
            {/* Balcony Timber Frame */}
            <path d="M 440 290 H 720 V 450 H 440 Z M 460 310 V 430 H 700 V 310 Z" fill="url(#wood)" filter="url(#shadow-soft)" />
            <rect x="460" y="310" width="240" height="120" fill="url(#concrete-light)" />
            <polygon points="460,310 700,310 700,330 480,330 480,430 460,430" fill="rgba(15,23,42,0.2)" />

            {/* Balcony Glass with realistic reflections */}
            <g filter="url(#shadow-soft)">
              <rect x="590" y="310" width="110" height="120" fill="url(#glass)" />
              <rect x="590" y="310" width="110" height="120" fill="url(#glass-reflection)" />
              <polygon points="590,400 660,310 700,310 590,430" fill="rgba(255,255,255,0.15)" />
            </g>

            {/* Balcony Railing / Screen */}
            {[...Array(25)].map((_, i) => (
              <line key={`screen-${i}`} x1={595 + (i * 27) % 100} y1={320 + (i * 31) % 100} x2={605 + (i * 27) % 100} y2={330 + (i * 31) % 100} stroke="#E2E8F0" strokeWidth="2" opacity="0.6" />
            ))}
            <rect x="460" y="380" width="130" height="50" fill="url(#glass)" opacity="0.7" />
            <rect x="460" y="380" width="130" height="5" fill="url(#plaster-navy)" />
            <rect x="460" y="380" width="130" height="2" fill="#FFFFFF" opacity="0.3" />
            {[...Array(3)].map((_, i) => (
              <g key={`slat-${i}`}>
                <rect x={600 + i * 30} y="40" width="18" height="120" fill="url(#wood)" filter="url(#shadow-soft)" />
                <rect x={600 + i * 30} y="40" width="4" height="120" fill="rgba(255,255,255,0.1)" />
              </g>
            ))}

            {/* Top Tower Glass & Wood Slats */}
            <rect x="350" y="150" width="70" height="210" fill="url(#plaster-navy)" rx="2" />
            {[...Array(4)].map((_, i) => (
              <React.Fragment key={`t-glass-top-${i}`}>
                <rect x="355" y={160 + i * 47} width="25" height="42" fill="url(#glass)" />
                <rect x="355" y={160 + i * 47} width="25" height="42" fill="url(#glass-reflection)" />
                <rect x="390" y={160 + i * 47} width="25" height="42" fill="url(#glass)" />
                <rect x="390" y={160 + i * 47} width="25" height="42" fill="url(#glass-reflection)" />
              </React.Fragment>
            ))}
            {[...Array(4)].map((_, i) => (
              <g key={`tslat-${i}`}>
                <rect x={290 + i * 15} y="150" width="10" height="160" fill="url(#wood)" filter="url(#shadow-soft)" />
                <rect x={290 + i * 15} y="150" width="3" height="160" fill="rgba(255,255,255,0.15)" />
              </g>
            ))}
          </motion.g>

        </svg>
      </AnimatePresence>
    </div>
  );
}