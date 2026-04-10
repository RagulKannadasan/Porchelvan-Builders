'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function VerifyForm() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  useEffect(() => {
    if (!email) {
      router.push('/register');
    }
  }, [email, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Verification failed');
      } else {
        router.push('/login');
      }
    } catch (err) {
      setError('Internal server error');
    } finally {
      setLoading(false);
    }
  };

  return (
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
          <h1 className="text-lg md:text-xl font-light tracking-[0.4em] text-white uppercase text-center drop-shadow-md">VERIFICATION</h1>
          <p className="mt-4 text-[9px] tracking-[0.25em] text-gray-500 uppercase text-center">Enter the security token sent to {email}</p>
      </div>

      <div className="shadow-2xl bg-white/[0.02] border border-white/5 p-8 md:p-12 backdrop-blur-xl relative">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-8">
            <Label htmlFor="otp" className="sr-only">One-Time Password</Label>
            <Input 
              id="otp" 
              required 
              value={otp} 
              onChange={(e) => setOtp(e.target.value)} 
              maxLength={6} 
              placeholder="000000" 
              className="bg-transparent border-0 border-b border-white/20 text-white placeholder:text-gray-800 focus-visible:ring-0 focus-visible:border-indigo-500 rounded-none h-16 text-center text-4xl tracking-[0.5em] shadow-none w-full outline-none"
            />
          </div>
          {error && <p className="text-[10px] tracking-widest text-[#ef4444] font-medium pt-2 text-center">{error}</p>}
          
          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-white text-black hover:bg-gray-200 h-14 rounded-none text-[10px] font-bold tracking-[0.3em] uppercase mt-8 transition-colors"
          >
            {loading ? 'PROCESSING...' : 'VERIFY TOKEN'}
          </Button>
        </form>
      </div>
    </motion.div>
  );
}

export default function VerifyPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#07090f] px-6 text-gray-200 font-sans relative overflow-hidden">
       {/* Background Ambience */}
       <div className="absolute inset-x-0 top-0 h-screen w-full select-none pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,_#1e1b4b_0%,_#07090f_70%)] opacity-60" />
      </div>

       <Suspense fallback={<div className="text-[10px] tracking-[0.3em] text-white uppercase">Loading securely...</div>}>
         <VerifyForm />
       </Suspense>
    </div>
  );
}
