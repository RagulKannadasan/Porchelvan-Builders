'use client';
import Image from 'next/image';

import { Suspense } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import House3D from '@/components/House3D';

export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-[#07090f] text-gray-200 selection:bg-indigo-500/30 font-sans overflow-hidden">
      
      {/* Absolute 3D Canvas Background for Hero */}
      <div className="absolute inset-x-0 top-0 h-screen w-full select-none pointer-events-none">
        {/* Soft Radial Ambient Glow matching the image */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,_#1e1b4b_0%,_#07090f_70%)] opacity-80" />
        
        {/* Vertical light rays (Auroras) */}
        <div className="absolute inset-x-0 top-0 h-[60vh] w-full flex justify-center gap-12 opacity-30 mix-blend-screen overflow-hidden">
          <div className="h-full w-24 bg-gradient-to-b from-indigo-500/30 to-transparent blur-3xl rotate-[-5deg]" />
          <div className="h-full w-32 bg-gradient-to-b from-blue-400/20 to-transparent blur-3xl translate-y-12" />
          <div className="h-full w-24 bg-gradient-to-b from-purple-500/30 to-transparent blur-3xl rotate-[5deg]" />
        </div>

        <Canvas camera={{ position: [0, 4, 12], fov: 35 }}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 10, 5]} intensity={2} color="#818cf8" />
          <directionalLight position={[-10, 10, -5]} intensity={1} color="#c084fc" />
          <Suspense fallback={null}>
            <House3D />
          </Suspense>
        </Canvas>
        
        {/* Fade to content gradient */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#07090f] to-transparent z-10" />
      </div>

      {/* Extreme Minimalist UI Overlay */}
      <div className="relative z-20 h-screen w-full pointer-events-none">
        
        {/* Top Navbar */}
        <header className="absolute top-0 inset-x-0 flex w-full items-center justify-between px-10 py-12 text-[9px] font-medium tracking-[0.3em] text-gray-500 uppercase pointer-events-auto">
          <div className="flex gap-10 items-center cursor-pointer">
            <Link href="#" className="hover:text-white transition-colors">PORCHELVAN GROUP</Link>
            <Link href="#" className="text-white border-b border-white pb-1 relative">PORCHELVAN TRADING</Link>
            <Link href="#" className="hover:text-white transition-colors">PORCHELVAN CAPITAL</Link>
            <Link href="#" className="hover:text-white transition-colors">PORCHELVAN MARITIME</Link>
            <Link href="#" className="hover:text-white transition-colors">ENERGY</Link>
          </div>
          
          <div className="flex items-center gap-10 cursor-pointer text-gray-400">
            <div className="flex items-center gap-3 hover:text-white transition-colors">
              <span>NEWS</span>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[8px] text-black font-bold">13</span>
            </div>
            <Link href="/login" className="hover:text-white transition-colors flex items-center gap-4">
              <span>MENU</span>
              <div className="flex gap-1">
                <div className="h-1 w-1 rounded-full bg-white/80" />
                <div className="h-1 w-1 rounded-full bg-white/80" />
              </div>
            </Link>
          </div>
        </header>

        {/* Center Logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
            className="flex items-center gap-6"
          >
            {/* Minimal Icon */}
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/90">
              <path d="M16 2L30 10V22L16 30L2 22V10L16 2Z" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="16" cy="16" r="2.5" fill="currentColor" />
              <circle cx="16" cy="8" r="1.5" fill="currentColor" />
              <circle cx="9" cy="20" r="1.5" fill="currentColor" />
              <circle cx="23" cy="20" r="1.5" fill="currentColor" />
            </svg>
            <div className="h-5 w-px bg-white/30" />
            <h1 className="text-xl md:text-[22px] font-light tracking-[0.45em] text-[#F3F4F6] drop-shadow-md relative top-px uppercase">
              PORCHELVAN TRADING
            </h1>
          </motion.div>
        </div>

        {/* Bottom Elements */}
        <div className="absolute bottom-0 inset-x-0 flex w-full items-end justify-between px-10 py-12 text-[9px] tracking-[0.3em] font-medium uppercase text-gray-400 pointer-events-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            <span className="hover:text-white cursor-pointer transition-colors">SCROLL DOWN TO DISCOVER</span>
          </motion.div>
          
          <motion.div 
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 1, duration: 1 }}
             className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white/20 transition-all hover:bg-white/10 hover:border-white/40"
          >
            <svg width="14" height="6" viewBox="0 0 14 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1C3 1 3 5 7 5C11 5 11 1 13 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </div>
      </div>

      {/* 1. Philosophy Statement */}
      <section className="relative z-20 bg-[#07090f] px-8 py-40 md:py-64 flex flex-col items-center border-t border-white/5">
        <motion.h2 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="max-w-6xl text-center text-3xl md:text-5xl lg:text-7xl font-light tracking-[0.05em] text-white leading-tight"
        >
          WE BELIEVE ARCHITECTURE IS NOT JUST ABOUT CONSTRUCTING BUILDINGS, BUT CHOREOGRAPHING LIGHT, SPACE, AND RAW MATERIALS INTO A MONUMENTAL EXPERIENCE.
        </motion.h2>
      </section>

      {/* 2. Capabilities List (Huge Typography) */}
      <section className="relative z-20 bg-[#07090f] px-8 py-32 flex flex-col border-t border-white/5">
        <div className="max-w-7xl mx-auto w-full">
          <p className="text-[10px] font-medium tracking-[0.2em] text-gray-400 mb-16 uppercase">Our Capabilities</p>
          <div className="flex flex-col w-full border-t border-white/10">
            {['RESIDENTIAL', 'COMMERCIAL', 'INTERIORS', 'LANDSCAPE'].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                className="group flex flex-col md:flex-row md:items-center justify-between py-12 md:py-20 border-b border-white/10 cursor-pointer hover:bg-white/[0.02] transition-colors px-4"
              >
                <div className="flex items-start gap-8 md:gap-16">
                  <span className="text-sm font-light text-gray-500 mt-4 md:mt-8">0{idx + 1}</span>
                  <h3 className="text-5xl md:text-7xl lg:text-9xl font-light tracking-tight text-gray-200 group-hover:text-white transition-colors">
                    {item}
                  </h3>
                </div>
                <div className="mt-8 md:mt-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-20px] group-hover:translate-x-0">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 20H30M30 20L22 12M30 20L22 28" stroke="white" strokeWidth="2" strokeLinecap="square"/>
                  </svg>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Selected Works Asymmetrical Grid */}
      <section className="relative z-20 bg-[#07090f] px-8 py-40 border-t border-white/5">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex justify-between items-end mb-24">
            <p className="text-[10px] font-medium tracking-[0.2em] text-gray-400 uppercase">Selected Works</p>
            <Link href="#" className="text-[10px] uppercase tracking-[0.2em] text-white border-b border-white/30 hover:border-white pb-1 transition-colors">View All Archive</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24">
            {/* Left Huge Project */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="md:col-span-8 flex flex-col gap-6 group cursor-pointer"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-white/5">
                <Image src="/images/hero.png" alt="Project 1" fill className="object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
              </div>
              <div className="flex justify-between items-center text-sm uppercase tracking-[0.1em] text-gray-400">
                <span className="text-white text-xl tracking-wider">The Obsidian</span>
                <span>2026</span>
              </div>
            </motion.div>
            
            {/* Right Offset Project */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
              className="md:col-span-4 flex flex-col gap-6 md:mt-64 group cursor-pointer"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-white/5">
                <Image src="/images/thumbnail.png" alt="Project 2" fill className="object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
              </div>
              <div className="flex justify-between items-center text-sm uppercase tracking-[0.1em] text-gray-400">
                <span className="text-white text-lg tracking-wider">Minimalist Haven</span>
                <span>2025</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Footer */}
      <footer className="relative z-20 bg-[#07090f] px-8 py-32 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <p className="text-[10px] font-medium tracking-[0.2em] text-gray-400 mb-12 uppercase">Start A Project</p>
          <motion.a 
            href="mailto:contact@porchelvan.com"
            whileHover={{ scale: 1.02 }}
            className="text-4xl md:text-6xl lg:text-8xl font-light tracking-tight text-white hover:text-gray-300 transition-colors mb-32 text-center"
          >
            CONTACT@PORCHELVAN.COM
          </motion.a>
          
          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] uppercase tracking-[0.2em] text-gray-500 border-t border-white/10 pt-12">
            <p>&copy; {new Date().getFullYear()} PORCHELVAN BUILDERS</p>
            <div className="flex gap-8">
              <Link href="#" className="hover:text-white transition-colors">INSTAGRAM</Link>
              <Link href="#" className="hover:text-white transition-colors">LINKEDIN</Link>
            </div>
            <p>ALL RIGHTS RESERVED</p>
          </div>
        </div>
      </footer>

    </main>
  );
}
