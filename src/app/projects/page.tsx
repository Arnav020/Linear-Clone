'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import ProjectsList from '@/components/ProjectsList';
import { useUser } from '@/context/UserContext';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProjectsPage() {
  const { user, isLoading: isUserLoading } = useUser();
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (!isUserLoading && !user) {
        router.push('/');
        return;
    }

    if (user) {
        fetchProjects();
    }
  }, [user, isUserLoading]);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
        // Fetch projects where the user is a member
        const { data, error } = await supabase
            .from('project_members')
            .select(`
                project_id,
                projects (
                    *,
                    issues (count)
                )
            `)
            .eq('user_id', user!.id);

        if (error) {
            console.error('Error fetching projects:', error);
        } else {
            // Transform data to flat project array
            const flatProjects = data.map((item: any) => ({
                ...item.projects,
                issues: item.projects.issues // Preserve issue count if available
            }));
            setProjects(flatProjects);
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    } finally {
        setIsLoading(false);
    }
  };

  if (isUserLoading || (isLoading && user)) {
      return (
          <div className="h-full flex items-center justify-center text-[#5E6AD2]">
              <Loader2 className="animate-spin" size={24} />
          </div>
      );
  }

  if (!user) return null; // Will redirect

  return (
    <ProjectsList initialProjects={projects} />
  );
}
