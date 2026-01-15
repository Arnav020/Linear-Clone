'use client';

import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Tag, Check, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface LabelDropdownProps {
  issueId: string;
  currentLabels?: string[] | null; // Assuming Supabase stores JSONB or array text[]
  className?: string;
  compact?: boolean;
}

const AVAILABLE_LABELS = [
    { name: 'Bug', color: 'bg-red-500/10 text-red-500 border-red-500/20' },
    { name: 'Feature', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
    { name: 'Improvement', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
];

export default function LabelDropdown({ issueId, currentLabels = [], className = "", compact = true }: LabelDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [labels, setLabels] = useState<string[]>(currentLabels || []);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setLabels(currentLabels || []);
  }, [currentLabels]);

  useEffect(() => {
     const handleClickOutside = (event: MouseEvent) => {
       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
         setIsOpen(false);
       }
     };
     if (isOpen) document.addEventListener('mousedown', handleClickOutside);
     return () => document.removeEventListener('mousedown', handleClickOutside);
   }, [isOpen]);

   const toggleLabel = async (labelName: string) => {
      const oldLabels = [...labels];
      let newLabels;
      if (labels.includes(labelName)) {
          newLabels = labels.filter(l => l !== labelName);
      } else {
          newLabels = [...labels, labelName];
      }
      
      setLabels(newLabels);
      // Keep dropdown open for multi-select
      
      const supabase = createClient();
      const { error } = await supabase
          .from('issues')
          .update({ labels: newLabels })
          .eq('id', issueId);

      if (error) {
          console.error('Error updating labels:', error);
          if (error.message?.includes('column "labels" does not exist') || error.code === '42703') {
              alert('Missing "labels" column in database. Please run: ALTER TABLE public.issues ADD COLUMN labels text[] DEFAULT \'{}\';');
          }
          setLabels(oldLabels);
      } else {
          router.refresh();
      }
   };

   return (
     <div className={`relative flex items-center gap-1 ${className}`} ref={dropdownRef}>
        {/* Render existing labels if not compact or if we want to show them inline */}
        {!compact && labels.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
                {labels.map(l => {
                    const style = AVAILABLE_LABELS.find(al => al.name === l) || { color: 'bg-[#2A2D35] text-[#7C7F88] border-[#3a3e46]' };
                    return (
                        <div key={l} className={`text-[10px] px-1.5 py-0.5 rounded border ${style.color} font-medium flex items-center gap-1`}>
                            {l}
                        </div>
                    );
                })}
            </div>
        )}

        {/* Trigger */}
        <div 
             onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
             className={`cursor-pointer flex items-center text-[#7C7F88] hover:text-[#E3E4E6] transition-colors rounded hover:bg-[#2A2D35] ${compact ? 'p-1' : 'p-0.5'}`}
             title="Add Label"
        >
             {compact && labels.length > 0 ? (
                 <div className="flex -space-x-1">
                     {labels.map((l, i) => {
                         const style = AVAILABLE_LABELS.find(al => al.name === l);
                         if (!style) return null;
                         return (
                             <div key={l} className={`w-2 h-2 rounded-full ${style.color.split(' ')[0]} border border-[#16181D]`} />
                         );
                     })}
                 </div>
             ) : (
                 <Tag size={14} />
             )}
        </div>

        {isOpen && (
             <div className="absolute top-6 left-0 z-50 w-[160px] bg-[#1C1E22] border border-[#2A2D35] rounded-lg shadow-xl py-1 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-2 py-1 text-[10px] uppercase font-semibold text-[#7C7F88] tracking-wider mb-0.5">
                    Add Label
                </div>
                {AVAILABLE_LABELS.map(lbl => {
                    const isSelected = labels.includes(lbl.name);
                    return (
                        <div
                            key={lbl.name}
                            onClick={(e) => { e.stopPropagation(); toggleLabel(lbl.name); }}
                            className="flex items-center gap-2 px-2 py-1.5 mx-1 rounded text-xs text-[#E3E4E6] hover:bg-[#5E6AD2] cursor-pointer group transition-colors"
                        >
                            <div className={`w-2 h-2 rounded-full ${lbl.color.split(' ')[0]} border border-current`} />
                            <span className="flex-1">{lbl.name}</span>
                            {isSelected && <Check size={12} />}
                        </div>
                    );
                })}
             </div>
        )}
     </div>
   );
}
