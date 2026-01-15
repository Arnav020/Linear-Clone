import { createClient } from '@/lib/supabase';
import ProjectsList from '@/components/ProjectsList';

export default async function ProjectsPage() {
  const supabase = createClient();
  const { data: projects } = await supabase
    .from('projects')
    .select('*, issues(count)')
    .order('name');

  return (
    <ProjectsList initialProjects={projects || []} />
  );
}
