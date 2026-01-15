'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';

interface Project {
  id: string;
  name: string;
}

export default function ProjectSelector() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchProjects = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('projects').select('*').order('name');
      
      if (data && data.length > 0) {
          setProjects(data);
          
          // Determine selected project: URL > localStorage > first project
          const paramProjectId = searchParams.get('project');
          const savedProjectId = localStorage.getItem('selectedProjectId');
          
          const initialProject = data.find(p => p.id === paramProjectId) || 
                                 data.find(p => p.id === savedProjectId) || 
                                 data[0];
                                 
          setSelectedProject(initialProject);
          if (!paramProjectId && initialProject) {
             // Optional: Update URL to reflect default selection if not present
             // router.replace(`/?project=${initialProject.id}`); 
             // But maybe user wants "All"? User requirements say "Filter issues by project".
             // If URL has no project, maybe we show all? Or defaults to one?
             // Linear usually drives view by team/project.
             // Let's stick to user request: "Store selected project ID in localStorage"
          }
      }
    };
    fetchProjects();
  }, [searchParams]);

  const handleProjectChange = (project: Project) => {
    setSelectedProject(project);
    setIsOpen(false);
    localStorage.setItem('selectedProjectId', project.id);
    // Navigate to dashboard with new project param
    router.push(`/?project=${project.id}`);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#2A2D35] rounded-md transition-colors"
      >
        <div className="w-5 h-5 bg-orange-500 rounded flex items-center justify-center text-[10px] text-white font-bold">
          {selectedProject?.name?.[0] || 'L'}
        </div>
        <span className="text-sm font-medium text-[#E3E4E6]">
          {selectedProject?.name || 'Linear Clone'}
        </span>
        <ChevronDown size={14} className="text-[#7C7F88]" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-[#16181D] border border-[#2A2D35] rounded-lg shadow-xl z-50 p-1">
          <div className="flex flex-col gap-1">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => handleProjectChange(project)}
                className={`w-full flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-[#2A2D35] transition-colors group ${
                  selectedProject?.id === project.id ? 'bg-[#2A2D35]' : ''
                }`}
              >
                <div className="w-5 h-5 bg-orange-500 rounded flex items-center justify-center text-[10px] text-white font-bold group-hover:scale-105 transition-transform">
                  {project.name[0]}
                </div>
                <span className={`text-sm ${selectedProject?.id === project.id ? 'text-[#E3E4E6]' : 'text-[#878A94] group-hover:text-[#E3E4E6]'}`}>
                    {project.name}
                </span>
                {selectedProject?.id === project.id && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#A855F7]" />
                )}
              </button>
            ))}
            <div className="h-[1px] bg-[#2A2D35] my-1" />
             <button
                onClick={() => router.push('/projects')}
                className="w-full flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-[#2A2D35] transition-colors text-[#878A94] hover:text-[#E3E4E6]"
              >
                <div className="w-5 h-5 border border-dashed border-[#7C7F88] rounded flex items-center justify-center text-[#7C7F88]">
                  <Plus size={10} />
                </div>
                <span className="text-sm">Create / View All</span>
              </button>
          </div>
        </div>
      )}
      
      {/* Click outside closer would be nice but simplified for now */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
