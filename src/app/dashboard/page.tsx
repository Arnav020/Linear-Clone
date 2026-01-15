'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import ProjectViews from '@/components/ProjectViews';

export default function Dashboard() {
  const [issues, setIssues] = useState<any[]>([]);
  const [isFetchingIssues, setIsFetchingIssues] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('project');
  const searchQuery = searchParams.get('q');
  const { user, isLoading } = useUser();

  // Auth guard
  useEffect(() => {
    if (!isLoading && !user) {
        router.push('/login');
    }
  }, [user, isLoading, router]);

  // Fetch issues function
  const fetchIssues = async () => {
    if (!user || !projectId) return;
    
    // Only show loader on initial fetch or major route change, not realtime updates
    if (issues.length === 0) setIsFetchingIssues(true);
    
    const supabase = createClient();
    
    // Fetch issues for the project
    let query = supabase
      .from('issues')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching issues:', error);
    } else {
      setIssues(data || []);
    }
    setIsFetchingIssues(false);
  };

  // Initial Fetch & Realtime Subscription
  useEffect(() => {
    if (user && projectId) {
      fetchIssues();

      // Set up Realtime subscription
      const supabase = createClient();
      const channel = supabase
        .channel('issues_channel')
        .on(
          'postgres_changes',
          {
            event: '*', 
            schema: 'public',
            table: 'issues',
            filter: `project_id=eq.${projectId}`
          },
          (payload) => {
            console.log('Realtime update:', payload);
            fetchIssues(); 
          }
        )
        .subscribe();

      // Cleanup
      return () => {
        supabase.removeChannel(channel);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, projectId, searchQuery]); // Re-fetch when searchQuery changes

  if (isLoading) {
    return (
        <div className="flex h-screen items-center justify-center bg-[#0B0D10] text-[#E3E4E6]">
            <Loader2 className="animate-spin text-[#5E6AD2]" size={24} />
        </div>
    );
  }

  if (!user) return null; // Will redirect

  // If no project selected, show empty state
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

  return <ProjectViews issues={issues} refreshIssues={fetchIssues} />;
}
