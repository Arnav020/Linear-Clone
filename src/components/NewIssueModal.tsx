'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase';
import { X, CheckCircle2, Circle, AlertCircle, ChevronDown, Loader2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Project = {
  id: string;
  name: string;
  key: string;
};

interface NewIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewIssueModal({ isOpen, onClose }: NewIssueModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Todo');
  const [priority, setPriority] = useState('None');
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teamId, setTeamId] = useState<string | null>(null);
  
  // AI State
  const [isAiEnabled, setIsAiEnabled] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Fetch projects and team
      const fetchData = async () => {
        const { data: teams } = await supabase.from('teams').select('id').limit(1).returns<{ id: string }[]>();
        if (teams && teams.length > 0) {
            setTeamId(teams[0].id);
        }

        const { data: projectsData } = await supabase.from('projects').select('id, name').order('name');
        if (projectsData) {
            setProjects(projectsData);
            const savedProjectId = localStorage.getItem('selectedProjectId');
            // Default to saved project, or first available
            const defaultProjectId = savedProjectId && projectsData.find(p => p.id === savedProjectId) ? savedProjectId : projectsData[0]?.id;
            setProjectId(defaultProjectId || null);
        }
      };
      fetchData();
      
      // Focus title after a short delay to allow animation
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 100);

    } else {
      document.body.style.overflow = 'unset';
      // Reset form on close
      setTimeout(() => {
          setTitle('');
          setDescription('');
          setStatus('Todo');
          setPriority('None');
          setProjectId(null);
          setIsAiEnabled(false);
      }, 200);
    }
    
    return () => {
        document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Import locally to avoid hydration issues if needed, but standard import should work
  const { generateIssueDetailsAction } = require('@/app/actions/ai');

  const handleAiGenerate = async () => {
    if (!title.trim() || isGenerating) return;

    setIsGenerating(true);
    const details = await generateIssueDetailsAction(title);
    
    if (details) {
        if (details.description) setDescription(details.description);
        if (details.priority) setPriority(details.priority);
        // Map status if needed, but AI should return valid status
        if (details.status) setStatus(details.status);
    }
    setIsGenerating(false);
  };

  // Trigger generation on blur if enabled and empty description
  const handleTitleBlur = () => {
    if (isAiEnabled && title.trim() && !description.trim()) {
        handleAiGenerate();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);


  const handleSubmit = async () => {
    if (!title.trim() || !teamId) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('issues').insert({
        title,
        description: description || null,
        status: status, // Matches db constraint if lowercase, but let's check. 
                        // The DB probably expects 'todo', 'in progress' etc or capitalized. 
                        // Based on page.tsx, it seems to handle normalization. 
                        // Let's save as is, or normalize to lowercase if that's the convention.
                        // Page.tsx normalizes to lowercase for comparison.
                        // Let's just save as is for now.
        priority,
        team_id: teamId,
        project_id: projectId
      });

      if (error) {
        console.error('Error creating issue:', error);
        alert('Failed to create issue');
      } else {
        onClose();
        router.refresh();
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        ref={modalRef}
        className="relative w-full max-w-2xl bg-[#1e2024] border border-[#2a2c30] rounded-lg shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2c30]">
           <span className="text-xs font-medium text-gray-500">New Issue</span>
           
           <div className="flex items-center gap-3">
               {/* AI Toggle */}
               <button 
                  onClick={() => setIsAiEnabled(!isAiEnabled)}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium transition-colors border ${isAiEnabled ? 'bg-[#5e6ad2]/10 border-[#5e6ad2]/30 text-[#8B5CF6]' : 'bg-transparent border-transparent text-gray-500 hover:text-gray-300'}`}
               >
                  <Sparkles size={12} className={isAiEnabled ? "text-[#8B5CF6]" : ""} />
                  {isAiEnabled ? 'AI Assistant On' : 'AI Assistant'}
               </button>

               <button onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors">
                 <X size={16} />
               </button>
           </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
            <div className="relative">
                <input
                    ref={titleInputRef}
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={handleTitleBlur}
                    placeholder="Issue title"
                    className="w-full bg-transparent text-lg font-medium text-gray-100 placeholder:text-gray-500 focus:outline-none pr-8"
                />
                 {isGenerating && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2">
                        <Loader2 size={16} className="animate-spin text-[#8B5CF6]" />
                    </div>
                 )}
            </div>
            
            <div className="relative">
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add description..."
                    className="w-full bg-transparent text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none resize-none min-h-[120px]"
                />
                
                {isAiEnabled && !description && title && !isGenerating && (
                    <div className="absolute top-0 right-0">
                         <button 
                            onClick={handleAiGenerate}
                            className="flex items-center gap-1 text-[10px] text-[#8B5CF6] hover:text-[#7c3aed] bg-[#5e6ad2]/10 hover:bg-[#5e6ad2]/20 px-2 py-1 rounded border border-[#5e6ad2]/20 transition-colors"
                         >
                            <Sparkles size={10} />
                            Auto-fill
                         </button>
                    </div>
                )}
            </div>
        </div>

        {/* Footer / Controls */}
        <div className="p-4 border-t border-[#2a2c30] flex items-center justify-between bg-[#1e2024] rounded-b-lg">
            <div className="flex items-center gap-2">
                {/* Status Dropdown (Mock) */}
                 <div className="relative group">
                    <select 
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="appearance-none bg-[#25282d] hover:bg-[#2a2c30] border border-[#3a3d42] text-xs font-medium text-gray-300 rounded px-2 py-1 pr-6 cursor-pointer focus:outline-none focus:border-[#5e6ad2]"
                    >
                        <option value="Backlog">Backlog</option>
                        <option value="Todo">Todo</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                    </select>
                    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                 </div>

                 {/* Priority Dropdown */}
                 <div className="relative group">
                    <select 
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="appearance-none bg-[#25282d] hover:bg-[#2a2c30] border border-[#3a3d42] text-xs font-medium text-gray-300 rounded px-2 py-1 pr-6 cursor-pointer focus:outline-none focus:border-[#5e6ad2]"
                    >
                        <option value="None">No Priority</option>
                        <option value="Urgent">Urgent</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                 </div>

                 {/* Project Dropdown */}
                 {projects.length > 0 && (
                    <div className="relative group">
                        <select 
                            value={projectId || ''}
                            onChange={(e) => setProjectId(e.target.value || null)}
                            className="appearance-none bg-[#25282d] hover:bg-[#2a2c30] border border-[#3a3d42] text-xs font-medium text-gray-300 rounded px-2 py-1 pr-6 cursor-pointer focus:outline-none focus:border-[#5e6ad2]"
                        >
                            <option value="">No Project</option>
                            {projects.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                         <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    </div>
                 )}
                 
                 {isAiEnabled && (
                    <span className="ml-2 flex items-center gap-1.5 text-[10px] text-gray-500 bg-[#25282d] px-2 py-1 rounded-full border border-[#3a3d42]">
                        <Sparkles size={10} className="text-[#8B5CF6]" />
                        AI Assistance Active
                    </span>
                 )}
            </div>

            <div className="flex items-center gap-3">
                 <div className="flex items-center text-xs text-gray-500">
                    <span className="bg-[#2a2c30] px-1.5 py-0.5 rounded border border-[#3a3d42] mr-2 font-mono">Esc</span>
                    to cancel
                 </div>
                 <button 
                    onClick={handleSubmit}
                    disabled={!title.trim() || isSubmitting}
                    className="flex items-center gap-2 px-3 py-1.5 bg-[#5e6ad2] hover:bg-[#4e5ac2] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-[6px] text-sm font-medium transition-colors shadow-sm shadow-[#5e6ad2]/20"
                 >
                    {isSubmitting ? (
                        <>
                            <Loader2 size={14} className="animate-spin" />
                            Creating...
                        </>
                    ) : (
                        'Create Issue'
                    )}
                 </button>
            </div>
        </div>
      </div>
    </div>
  );
}
