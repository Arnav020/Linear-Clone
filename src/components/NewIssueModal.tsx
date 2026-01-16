'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase';
import { X, ChevronDown, Loader2, Sparkles } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@/context/UserContext';

type Project = {
  id: string;
  name: string;
  key: string;
};

interface NewIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIssueCreated?: () => void;
}

export default function NewIssueModal({ isOpen, onClose, onIssueCreated }: NewIssueModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Todo');
  const [priority, setPriority] = useState('None');
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();
  
  // AI State
  const [isAiEnabled, setIsAiEnabled] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Import AI action safely
  const { generateIssueDetailsAction } = require('@/app/actions/ai');

  useEffect(() => {
    if (isOpen && user) {
      document.body.style.overflow = 'hidden';
      // Fetch projects where user is a member
      const fetchProjects = async () => {
        const { data } = await supabase
            .from('project_members')
            .select('project_id, projects(id, name, key)')
            .eq('user_id', user.id);
        
        if (data) {
             const mappedProjects = data.map((item: any) => item.projects).sort((a: any, b: any) => a.name.localeCompare(b.name));
             setProjects(mappedProjects);
             
             // Auto-select project if only one or based on local storage
             const paramProjectId = searchParams.get('project');
             const savedProjectId = paramProjectId || localStorage.getItem('selectedProjectId');
             const defaultProjectId = savedProjectId && mappedProjects.find(p => p.id === savedProjectId) ? savedProjectId : mappedProjects[0]?.id;
             setProjectId(defaultProjectId || null);
        }
      };
      fetchProjects();
      
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 100);

    } else {
      document.body.style.overflow = 'unset';
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
  }, [isOpen, user, searchParams]);

  const handleAiGenerate = async () => {
    if (!title.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
        const details = await generateIssueDetailsAction(title);
        
        if (details) {
            if (details.description) setDescription(details.description);
            if (details.priority) setPriority(details.priority);
            if (details.status) setStatus(details.status);
        }
    } catch (e) {
        console.error("AI generation failed", e);
    } finally {
        setIsGenerating(false);
    }
  };

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
    if (!title.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('issues').insert({
        title,
        description: description || null,
        status: status, 
        priority,
        project_id: projectId, // Can be null for "Draft" or Personal? Let's assume mandatory if projects exist, else null
        created_by: user.id,
        assignee_id: user.id, // Auto-assign to creator for now
        assignee_name: user?.name, // Denormalize for easier display if needed, though schema has it
      });

      if (error) {
        console.error('Error creating issue:', error);
        alert('Failed to create issue');
      } else {
        onClose();
        if (onIssueCreated) onIssueCreated();
        // router.refresh(); // Handled by realtime subscription now
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
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
      />

      <div 
        ref={modalRef}
        className="relative w-full max-w-2xl bg-[#1e2024] border border-[#2a2c30] rounded-lg shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2c30]">
           <span className="text-xs font-medium text-gray-500">New Issue</span>
           
           <div className="flex items-center gap-3">
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

        <div className="p-4 border-t border-[#2a2c30] flex items-center justify-between bg-[#1e2024] rounded-b-lg">
            <div className="flex items-center gap-2">
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
