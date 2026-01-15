'use client';

import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { X, Loader2, Folder } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated?: () => void;
}

export default function NewProjectModal({ isOpen, onClose, onProjectCreated }: NewProjectModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
    } else {
      document.body.style.overflow = 'unset';
      setTimeout(() => {
          setName('');
          setDescription('');
      }, 200);
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      // Get team (default to first found for now, user likely has one)
      const { data: teams } = await supabase.from('teams').select('id').limit(1);
      const teamId = teams?.[0]?.id;

      if (!teamId) {
        throw new Error('No team found');
      }

      const { error } = await supabase.from('projects').insert({
        name,
        description: description || null,
        team_id: teamId,
        status: 'active'
      });

      if (error) {
        console.error('Error creating project:', error);
        alert('Failed to create project');
      } else {
        if (onProjectCreated) onProjectCreated();
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
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
      />

      <div 
        ref={modalRef}
        className="relative w-full max-w-lg bg-[#1e2024] border border-[#2a2c30] rounded-lg shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2c30]">
           <span className="text-xs font-medium text-gray-500">New Project</span>
           <button onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors">
             <X size={16} />
           </button>
        </div>

        <div className="p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Project Name</label>
                <div className="flex items-center gap-3 bg-[#16181D] border border-[#2a2c30] rounded-md px-3 py-2 focus-within:border-[#5E6AD2] transition-colors">
                    <Folder size={16} className="text-gray-500" />
                    <input
                        ref={nameInputRef}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Q3 Roadmap"
                        className="flex-1 bg-transparent text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What is this project about?"
                    className="w-full bg-[#16181D] border border-[#2a2c30] rounded-md px-3 py-2 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-[#5E6AD2] min-h-[80px] resize-none"
                />
            </div>
        </div>

        <div className="p-4 border-t border-[#2a2c30] flex items-center justify-end gap-3 bg-[#1e2024] rounded-b-lg">
             <button 
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-gray-200 hover:bg-white/5 rounded transition-colors"
             >
                Cancel
             </button>
             <button 
                onClick={handleSubmit}
                disabled={!name.trim() || isSubmitting}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#5e6ad2] hover:bg-[#4e5ac2] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-[6px] text-xs font-medium transition-colors"
             >
                {isSubmitting && <Loader2 size={12} className="animate-spin" />}
                Create Project
             </button>
        </div>
      </div>
    </div>
  );
}
