'use client';

import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { PriorityIcon } from './PriorityIcon';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PriorityDropdownProps {
  issueId: string;
  currentPriority: string;
  className?: string;
}

const PRIORITIES = [
    { label: 'Urgent', value: 'Urgent' },
    { label: 'High', value: 'High' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Low', value: 'Low' },
    { label: 'No Priority', value: 'None' }, // Sometimes 'None' or 'No Priority' stored as 'None' or null
];

export default function PriorityDropdown({ issueId, currentPriority, className = "" }: PriorityDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [priority, setPriority] = useState(currentPriority);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setPriority(currentPriority);
  }, [currentPriority]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const updatePriority = async (newPriority: string) => {
     if (newPriority === priority) {
         setIsOpen(false);
         return;
     }

     const oldPriority = priority;
     setPriority(newPriority);
     setIsOpen(false);

     const supabase = createClient();
     // Ensure we handle 'None' properly depending on backend schema. Assuming string 'None' or similar is fine.
     // Or map 'None' to empty string if that's the logic. Let's assume 'None' or 'No Priority' matches backend enum/check.
     // Based on PriorityIcon.tsx, valid keys are lowercase keys but stored value might be Title Case? 
     // IssueCard.tsx uses 'Urgent', 'High', etc. So we stick to Title Case match.
     
     const { error } = await supabase
         .from('issues')
         .update({ priority: newPriority })
         .eq('id', issueId);
 
     if (error) {
         console.error('Error updating priority:', error);
         setPriority(oldPriority);
     } else {
         router.refresh();
     }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div 
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        className="cursor-pointer p-0.5 rounded hover:bg-[#2A2D35] flex items-center justify-center transition-colors"
        title={`Priority: ${priority}`}
      >
        <PriorityIcon priority={priority} />
      </div>

      {isOpen && (
        <div className="absolute top-6 left-[-8px] z-50 w-[140px] bg-[#1C1E22] border border-[#2A2D35] rounded-lg shadow-xl py-1 animate-in fade-in zoom-in-95 duration-100">
           <div className="px-2 py-1 text-[10px] uppercase font-semibold text-[#7C7F88] tracking-wider mb-0.5">
             Set Priority
           </div>
           {PRIORITIES.map((p) => (
             <div
               key={p.value}
               onClick={(e) => { e.stopPropagation(); updatePriority(p.value); }}
               className="flex items-center gap-2 px-2 py-1.5 mx-1 rounded text-xs text-[#E3E4E6] hover:bg-[#5E6AD2] cursor-pointer group transition-colors"
             >
                <div className="shrink-0">
                    <PriorityIcon priority={p.value} />
                </div>
                <span className="flex-1">{p.label}</span>
                {priority === p.value && <Check size={12} />}
             </div>
           ))}
        </div>
      )}
    </div>
  );
}
