'use client';

import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { User, Check, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AssigneeDropdownProps {
  issueId: string;
  currentAssignee?: string | null;
  className?: string;
}

const MOCK_USERS = [
    { name: 'Arnav Joshi', id: 'arnav-joshi', color: 'bg-blue-500' },
    // Add more mock users if needed or fetch from DB
];

export default function AssigneeDropdown({ issueId, currentAssignee, className = "" }: AssigneeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [assignee, setAssignee] = useState(currentAssignee);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setAssignee(currentAssignee);
  }, [currentAssignee]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const updateAssignee = async (newAssignee: string | null) => {
    if (newAssignee === assignee) {
        setIsOpen(false);
        return;
    }

    const oldAssignee = assignee;
    setAssignee(newAssignee);
    setIsOpen(false);

    const supabase = createClient();
    const { error } = await supabase
        .from('issues')
        .update({ assignee_name: newAssignee })
        .eq('id', issueId);

    if (error) {
        console.error('Error updating assignee:', error);
        setAssignee(oldAssignee);
    } else {
        router.refresh();
    }
  };

  const currentAssigneeData = MOCK_USERS.find(u => u.name === assignee) || (assignee ? { name: assignee, id: assignee, color: 'bg-gray-500' } : null);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
        <div 
            onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
            className="cursor-pointer rounded-full hover:opacity-80 transition-opacity"
            title={assignee || "Unassigned"}
        >
            {assignee && currentAssigneeData ? (
                <div className={`w-5 h-5 rounded-full ${currentAssigneeData.color} flex items-center justify-center text-[10px] text-white font-bold border border-[#2A2D35]`}>
                    {currentAssigneeData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
            ) : (
                <div className="w-5 h-5 rounded-full bg-[#2A2D35] flex items-center justify-center border border-[#3a3e46] text-[#7C7F88]">
                    <User size={12} />
                </div>
            )}
        </div>

        {isOpen && (
            <div className="absolute top-6 left-0 z-50 w-[200px] bg-[#1C1E22] border border-[#2A2D35] rounded-lg shadow-xl py-1 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-2 py-1.5 border-b border-[#2A2D35] mb-1">
                    <div className="flex items-center gap-2 bg-[#16181D] px-2 py-1 rounded border border-[#2A2D35]">
                         <Search size={12} className="text-[#7C7F88]" />
                         <input type="text" placeholder="Assign to..." className="bg-transparent border-none outline-none text-xs text-[#E3E4E6] w-full placeholder:text-[#5E626E]" autoFocus />
                    </div>
                </div>
                
                <div 
                    onClick={(e) => { e.stopPropagation(); updateAssignee(null); }}
                    className="flex items-center gap-2 px-2 py-1.5 mx-1 rounded text-xs text-[#E3E4E6] hover:bg-[#5E6AD2] cursor-pointer group transition-colors"
                >
                     <div className="w-4 h-4 rounded-full border border-dashed border-[#7C7F88] flex items-center justify-center shrink-0">
                        <User size={10} className="text-[#7C7F88] group-hover:text-white" />
                     </div>
                     <span className="flex-1">Unassigned</span>
                     {!assignee && <Check size={12} />}
                </div>

                <div className="h-[1px] bg-[#2A2D35] my-1 mx-2" />

                {MOCK_USERS.map(user => (
                    <div
                        key={user.id}
                        onClick={(e) => { e.stopPropagation(); updateAssignee(user.name); }}
                        className="flex items-center gap-2 px-2 py-1.5 mx-1 rounded text-xs text-[#E3E4E6] hover:bg-[#5E6AD2] cursor-pointer group transition-colors"
                    >
                         <div className={`w-4 h-4 rounded-full ${user.color} flex items-center justify-center text-[8px] text-white font-bold shrink-0 border border-[#2A2D35]`}>
                             {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                         </div>
                         <span className="flex-1">{user.name}</span>
                         {assignee === user.name && <Check size={12} />}
                    </div>
                ))}
            </div>
        )}
    </div>
  );
}
