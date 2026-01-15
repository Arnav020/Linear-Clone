import { createClient } from '@/lib/supabase';
import Link from 'next/link';
import { Plus, Folder } from 'lucide-react';

export default async function ProjectsPage() {
  const supabase = createClient();
  const { data: projects } = await supabase
    .from('projects')
    .select('*, issues(count)')
    .order('name');

  return (
    <div className="p-8 max-w-6xl mx-auto text-[#E3E4E6]">
      <div className="flex justify-between items-center mb-8 border-b border-[#2A2D35] pb-6">
        <div>
            <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
            <p className="text-[#878A94] mt-1 text-sm">Manage your team's projects</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-[#5E6AD2] hover:bg-[#4e5ac0] text-white rounded-md text-sm font-medium transition-colors">
          <Plus size={16} />
          <span>New Project</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects?.map((project: any) => (
          <Link
            key={project.id}
            href={`/?project=${project.id}`}
            className="group p-5 bg-[#1C1E22] border border-[#2A2D35] rounded-lg hover:border-[#4B4E57] hover:bg-[#232529] transition-all duration-200 flex flex-col h-36"
          >
            <div className="flex items-start justify-between mb-2">
                <div className="w-8 h-8 rounded bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    <Folder size={18} />
                </div>
                {/* Future: menu dots */}
            </div>
            
            <h3 className="font-medium text-base mb-1">{project.name}</h3>
            <p className="text-sm text-[#878A94] line-clamp-1 mb-auto">{project.description || 'No description'}</p>
            
            <div className="mt-4 pt-3 border-t border-[#2A2D35] flex items-center justify-between text-xs text-[#7C7F88]">
                <span>{new Date(project.created_at).toLocaleDateString()}</span>
                <span className="bg-[#2A2D35] px-2 py-0.5 rounded text-[#E3E4E6]">{project.issues?.[0]?.count || 0} issues</span>
            </div>
          </Link>
        ))}
        
        {/* Empty State / Create New Card */}
        <button className="p-5 border border-dashed border-[#2A2D35] rounded-lg hover:border-[#4B4E57] hover:bg-[#2A2D35]/30 transition-all duration-200 flex flex-col items-center justify-center h-36 gap-2 text-[#7C7F88] hover:text-[#E3E4E6]">
             <Plus size={24} />
             <span className="text-sm font-medium">Create new project</span>
        </button>
      </div>
    </div>
  );
}
