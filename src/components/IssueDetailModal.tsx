'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase';
import { X, Loader2, Calendar, Layout, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import StatusDropdown from './StatusDropdown';
import PriorityDropdown from './PriorityDropdown';
import AssigneeDropdown from './AssigneeDropdown';
import LabelDropdown from './LabelDropdown';

interface IssueDetailModalProps {
  issue: any;
  isOpen: boolean;
  onClose: () => void;
}

import { createPortal } from 'react-dom';

export default function IssueDetailModal({ issue, isOpen, onClose }: IssueDetailModalProps) {
  const [title, setTitle] = useState(issue.title);
  const [description, setDescription] = useState(issue.description || '');
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // We use local state for immediate feedback but rely on the dropdowns to handle their own updates
  // However, for title/description, we need to save on blur or specific action
  
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();


  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setTitle(issue.title);
    setDescription(issue.description || '');
  }, [issue]);

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

  const saveChanges = async () => {
      if (title === issue.title && description === (issue.description || '')) return;

      setIsSaving(true);
      const supabase = createClient();
      const { error } = await supabase
          .from('issues')
          .update({ title, description })
          .eq('id', issue.id);
      
      if (error) {
          console.error('Failed to update issue', error);
      } else {
          router.refresh();
      }
      setIsSaving(false);
  };

  if (!isOpen || !mounted) return null;

  const dateStr = new Date(issue.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' });

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 text-sans">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
      />

      <div 
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-[#1e2024] border border-[#2a2c30] rounded-xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a2c30] bg-[#1e2024]">
            <div className="flex items-center gap-3 text-sm text-[#7C7F88] font-mono">
                <span>LIN-{issue.id.slice(0,3).toUpperCase()}</span>
                <span className="w-1 h-1 rounded-full bg-[#3a3d42]"></span>
                <span className="flex items-center gap-1.5 align-middle">
                     Created {dateStr}
                </span>
            </div>
            
            <div className="flex items-center gap-2">
                 <button 
                    onClick={(e) => { e.stopPropagation(); onClose(); }}
                    className="p-1.5 text-[#7C7F88] hover:text-[#E3E4E6] rounded hover:bg-[#2a2c30] transition-colors relative z-50 cursor-pointer"
                 >
                     <X size={18} />
                 </button>
            </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-8 border-r border-[#2a2c30] bg-[#16181D]">
                 <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={saveChanges}
                    className="w-full bg-transparent text-2xl font-semibold text-[#E3E4E6] placeholder:text-[#5E626E] focus:outline-none mb-6"
                    placeholder="Issue Title"
                 />
                 
                 <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onBlur={saveChanges}
                    className="w-full h-[calc(100%-100px)] bg-transparent text-base text-[#D1D5DB] placeholder:text-[#5E626E] focus:outline-none resize-none leading-relaxed"
                    placeholder="Add a description..."
                 />
            </div>

            {/* Sidebar / Properties */}
            <div className="w-[300px] bg-[#1e2024] p-6 flex flex-col gap-8 overflow-y-auto shrink-0">
                
                {/* Status */}
                <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-[#7C7F88] uppercase tracking-wider">Status</span>
                    <StatusDropdown 
                        issueId={issue.id} 
                        currentStatus={issue.status} 
                        className="w-full"
                    />
                </div>

                {/* Priority */}
                <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-[#7C7F88] uppercase tracking-wider">Priority</span>
                    <PriorityDropdown 
                        issueId={issue.id} 
                        currentPriority={issue.priority} 
                        className="flex items-center gap-2 p-1.5 rounded border border-[#2a2c30] bg-[#16181D] hover:bg-[#25282D]"
                    />
                </div>

                {/* Assignee */}
                <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-[#7C7F88] uppercase tracking-wider">Assignee</span>
                     <AssigneeDropdown 
                        issueId={issue.id} 
                        currentAssignee={issue.assignee_name}
                        className="flex items-center gap-2 p-1.5 rounded border border-[#2a2c30] bg-[#16181D] hover:bg-[#25282D]"
                     />
                </div>
                
                 {/* Labels */}
                 <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-[#7C7F88] uppercase tracking-wider">Labels</span>
                     <LabelDropdown 
                        issueId={issue.id} 
                        currentLabels={issue.labels}
                        compact={false}
                        className="flex items-center gap-2 p-1.5 rounded border border-[#2a2c30] bg-[#16181D] hover:bg-[#25282D] min-h-[36px]"
                     />
                </div>

                {/* Meta */}
                <div className="mt-auto pt-6 border-t border-[#2a2c30] flex flex-col gap-3">
                     <div className="flex items-center justify-between text-xs text-[#7C7F88]">
                        <span>Project</span>
                        <span>None</span>
                     </div>
                     <div className="flex items-center justify-between text-xs text-[#7C7F88]">
                        <span>Cycle</span>
                        <span>None</span>
                     </div>
                </div>
            </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
