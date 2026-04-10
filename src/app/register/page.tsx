'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Something went wrong');
      } else {
        router.push('/verify?email=' + encodeURIComponent(email));
      }
    } catch (err) {
      setError('Internal server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#07090f] px-6 text-gray-200 font-sans relative overflow-hidden py-24">
      
      {/* Background Ambience */}
      <div className="absolute inset-x-0 top-0 h-screen w-full select-none pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,_#1e1b4b_0%,_#07090f_70%)] opacity-60" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex flex-col items-center mb-12">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-white mb-8">
              <path d="M16 2L30 10V22L16 30L2 22V10L16 2Z" stroke="currentColor" strokeWidth="1" />
              <circle cx="16" cy="16" r="3" fill="currentColor" />
            </svg>
            <h1 className="text-lg md:text-xl font-light tracking-[0.4em] text-white uppercase text-center drop-shadow-md">ONBOARDING</h1>
            <p className="mt-4 text-[9px] tracking-[0.25em] text-gray-500 uppercase text-center">Establish your identity to access project archives.</p>
        </div>

        <div className="shadow-2xl bg-white/[0.02] border border-white/5 p-8 md:p-12 backdrop-blur-xl relative">
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-[9px] uppercase tracking-[0.2em] text-gray-400">Full Name</Label>
              <Input 
                id="name" 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="bg-black/20 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 rounded-none h-12 px-4 shadow-inner"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="email" className="text-[9px] uppercase tracking-[0.2em] text-gray-400">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="bg-black/20 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 rounded-none h-12 px-4 shadow-inner"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="password" className="text-[9px] uppercase tracking-[0.2em] text-gray-400">Create Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="bg-black/20 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 rounded-none h-12 px-4 shadow-inner"
              />
            </div>
            
            {error && <p className="text-[10px] tracking-widest text-[#ef4444] font-medium pt-2">{error}</p>}
            
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-white text-black hover:bg-gray-200 h-14 rounded-none text-[10px] font-bold tracking-[0.3em] uppercase mt-4 transition-colors relative overflow-hidden group"
            >
              <span className="relative z-10">{loading ? 'CREATING...' : 'REGISTER IDENTITY'}</span>
            </Button>
          </form>
        </div>

        <div className="mt-16 text-center flex justify-center items-center relative z-20">
          <p className="text-[9px] tracking-[0.25em] text-gray-500 uppercase">
            Already verified? 
            <Link href="/login" className="text-white hover:text-indigo-400 transition-colors border-b border-white/30 hover:border-indigo-400 pb-1 ml-3 tracking-[0.25em]">
              Return to Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
