'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { Loader2, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import ProjectViews from '@/components/ProjectViews';

export default function Home() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [issues, setIssues] = useState<any[]>([]); // Using any[] to match ProjectViews props for now
  const [isFetchingIssues, setIsFetchingIssues] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('project');
  const { user } = useUser();

  // Fetch issues when project changes
  useEffect(() => {
    if (user && projectId) {
      const fetchIssues = async () => {
        setIsFetchingIssues(true);
        const supabase = createClient();
        
        // Fetch issues for the project
        const { data, error } = await supabase
          .from('issues')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching issues:', error);
        } else {
          setIssues(data || []);
        }
        setIsFetchingIssues(false);
      };

      fetchIssues();
    }
  }, [user, projectId]);

  // Handle Login
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
       window.location.reload(); 
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
        window.location.reload();
      }
    }
    setLoading(false);
  };

  // If logged in
  if (user) {
      // If no project selected, redirect to projects or show empty state
      if (!projectId) {
           return (
               <div className="flex flex-col h-full items-center justify-center text-[#7C7F88]">
                   <p className="text-sm">Please select a project from the sidebar.</p>
               </div>
           );
      }

      if (isFetchingIssues) {
          return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="animate-spin text-[#5E6AD2]" size={24} />
            </div>
          );
      }

      return <ProjectViews issues={issues} />;
  }

  // Not logged in -> Show Login Form
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0B0D10] text-[#E3E4E6] p-4 relative overflow-hidden">
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
            
            <p className="text-center text-[#575a61] text-xs mt-8">
                Powered by Supabase & Next.js
            </p>
        </div>

    </div>
  );
}
