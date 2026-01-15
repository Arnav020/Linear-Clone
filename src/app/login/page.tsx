'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  
  const router = useRouter();
  const { user, isLoading } = useUser();

  // Auth guard - redirect to dashboard if logged in
  useEffect(() => {
    if (!isLoading && user) {
        router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const supabase = createClient();
    
    // Check if user exists
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email);

    if (error) {
       setMessage('Error logging in');
       setLoading(false);
       return;
    }

    if (users && users.length > 0) {
       // User exists, log them in
       localStorage.setItem('linear_clone_user_id', users[0].id);
       router.push('/dashboard');
       setTimeout(() => window.location.reload(), 100); // Reload to refresh context if needed, though push should trigger effect
    } else {
      // User does not exist, create them
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([{ email: email, name: email.split('@')[0] }]) // Simple name from email
        .select('*')
        .single();

      if (createError) {
        setMessage('Error creating user');
        setLoading(false);
        return;
      }

      if (newUser) {
        localStorage.setItem('linear_clone_user_id', newUser.id);
        router.push('/dashboard');
        setTimeout(() => window.location.reload(), 100);
      }
    }
    setLoading(false);
  };

  // Prevent flash of login screen if we're going to redirect
  if (isLoading || user) {
      return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-[#0B0D10] text-[#E3E4E6]">
              <Loader2 className="animate-spin text-[#5E6AD2]" size={24} />
          </div>
      );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0B0D10] text-[#E3E4E6] p-4 relative overflow-hidden">
        {/* Back to Home */}
        <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-[#878A94] hover:text-[#E3E4E6] transition-colors z-20">
            <ArrowLeft size={16} />
            <span className="text-sm font-medium">Back to Home</span>
        </Link>
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[url('https://linear.app/cdn-cgi/imagedelivery/fO02fVwohEs9s9UHFZJErA/d0d34e6e-2d4e-4f73-2051-404675545500/width=1000')] opacity-20 pointer-events-none" style={{ backgroundSize: '800px' }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D10] via-transparent to-[#0B0D10] pointer-events-none"></div>

        <div className="max-w-md w-full z-10 animate-in fade-in zoom-in-95 duration-500 ease-out">
            <div className="text-center mb-8">
               <div className="w-12 h-12 bg-[#5E6AD2] rounded-xl mx-auto flex items-center justify-center shadow-[0_0_40px_-10px_rgba(94,106,210,0.6)] mb-6">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white transform scale-110">
                   <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                   <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                   <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
               </div>
               <h1 className="text-3xl font-bold tracking-tight mb-2">Linear Clone</h1>
               <p className="text-[#878A94]">Log in to your workspace</p>
            </div>

            <div className="bg-[#16181D] border border-[#2A2D35] rounded-xl shadow-2xl p-8 backdrop-blur-sm relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#5E6AD2] to-transparent opacity-50"></div>
                 
                 <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-xs font-semibold text-[#878A94] mb-2 uppercase tracking-wider">Email Address</label>
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@company.com"
                            className="w-full bg-[#0B0D10] border border-[#2A2D35] rounded-lg px-4 py-3 text-sm text-[#E3E4E6] placeholder-[#575a61] focus:outline-none focus:border-[#5E6AD2] focus:ring-1 focus:ring-[#5E6AD2] transition-all"
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-[#5E6AD2] hover:bg-[#4C55AA] text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#5E6AD2]/20 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : (
                            <>
                                Continue <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                            </>
                        )}
                    </button>
                    
                    {message && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
                            {message}
                        </div>
                    )}
                 </form>
            </div>
            
            <p className="text-center text-[#878A94] text-sm mt-8">
                Don't have an account? <Link href="/signup" className="text-[#5E6AD2] hover:underline">Sign up</Link>
            </p>
            <p className="text-center text-[#575a61] text-xs mt-2">
                Powered by Supabase & Next.js
            </p>
        </div>

    </div>
  );
}
