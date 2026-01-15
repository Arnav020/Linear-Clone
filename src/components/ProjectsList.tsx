'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Folder, Trash2, MoreHorizontal } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import NewProjectModal from './NewProjectModal';

interface Project {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  issues: { count: number }[];
}

interface ProjectsListProps {
  initialProjects: Project[];
}

export default function ProjectsList({ initialProjects }: ProjectsListProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleProjectCreated = () => {
    router.refresh(); // Refresh server data
    // Supabase subscription could go here, or just simple refresh
  };

  const handleDelete = async (e: React.MouseEvent, projectId: string, projectName: string) => {
    e.preventDefault(); // Prevent navigation
    if (!confirm(`Are you sure you want to delete "${projectName}"? This will delete ALL associated issues.`)) return;

    try {
      // Manual cascade delete since user requested "delete the project... and the issue that refer to this project"
      // Assuming ON DELETE CASCADE might not be set in DB, manual is safer for now.
      
      // 1. Delete issues
      const { error: issuesError } = await supabase.from('issues').delete().eq('project_id', projectId);
      if (issuesError) {
        console.error('Error deleting issues:', issuesError);
        alert('Failed to delete associated issues.');
        return;
      }

      // 2. Delete project
      const { error: projectError } = await supabase.from('projects').delete().eq('id', projectId);
      if (projectError) {
          console.error('Error deleting project:', projectError);
          alert('Failed to delete project.');
      } else {
          router.refresh();
          setProjects(prev => prev.filter(p => p.id !== projectId));
      }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto text-[#E3E4E6]">
      <div className="flex justify-between items-center mb-8 border-b border-[#2A2D35] pb-6">
        <div>
            <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
            <p className="text-[#878A94] mt-1 text-sm">Manage your team's projects</p>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#5E6AD2] hover:bg-[#4e5ac0] text-white rounded-md text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          <span>New Project</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects?.map((project) => (
          <Link
            key={project.id}
            href={`/?project=${project.id}`}
            className="group p-5 bg-[#1C1E22] border border-[#2A2D35] rounded-lg hover:border-[#4B4E57] hover:bg-[#232529] transition-all duration-200 flex flex-col h-36 relative"
          >
            <div className="flex items-start justify-between mb-2">
                <div className="w-8 h-8 rounded bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    <Folder size={18} />
                </div>
                
                {/* Delete/Menu Action */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={(e) => handleDelete(e, project.id, project.name)}
                        className="p-1.5 text-[#7C7F88] hover:text-red-400 hover:bg-white/5 rounded transition-colors"
                        title="Delete Project"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>
            
            <h3 className="font-medium text-base mb-1 text-gray-100">{project.name || 'Untitled Project'}</h3>
            <p className="text-sm text-gray-400 line-clamp-1 mb-auto">{project.description || 'No description'}</p>
            
            <div className="mt-4 pt-3 border-t border-[#2A2D35] flex items-center justify-between text-xs text-[#7C7F88]">
                <span suppressHydrationWarning>{new Date(project.created_at).toLocaleDateString()}</span>
                <span className="bg-[#2A2D35] px-2 py-0.5 rounded text-[#E3E4E6]">{project.issues?.[0]?.count || 0} issues</span>
            </div>
          </Link>
        ))}
        
        {/* Empty State / Create New Card */}
        <button 
            onClick={() => setIsModalOpen(true)}
            className="p-5 border border-dashed border-[#2A2D35] rounded-lg hover:border-[#4B4E57] hover:bg-[#2A2D35]/30 transition-all duration-200 flex flex-col items-center justify-center h-36 gap-2 text-[#7C7F88] hover:text-[#E3E4E6]"
        >
             <Plus size={24} />
             <span className="text-sm font-medium">Create new project</span>
        </button>
      </div>

      <NewProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
}
