'use client';

import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { User, Check, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AssigneeDropdownProps {
  issueId: string;
  currentAssignee?: string | null;
  className?: string;
  projectId?: string;
}

interface ProjectMember {
    id: string;
    name: string;
    email: string;
    avatar_url: string | null;
}

export default function AssigneeDropdown({ issueId, currentAssignee, className = "", projectId }: AssigneeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [assignee, setAssignee] = useState(currentAssignee);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setAssignee(currentAssignee);
  }, [currentAssignee]);

  useEffect(() => {
      // Fetch members when dropdown opens
      if (isOpen && projectId) {
          const fetchMembers = async () => {
              const supabase = createClient();
              const { data, error } = await supabase
                  .from('project_members')
                  .select(`
                      user:users (
                          id,
                          name,
                          email,
                          avatar_url
                      )
                  `)
                  .eq('project_id', projectId);

               if (data) {
                   const mappedMembers = data.map((item: any) => item.user).filter((u: any) => u !== null);
                   setMembers(mappedMembers);
               } else if (error) {
                   console.error('Error fetching members:', error);
               }
          };
          fetchMembers();
      }
  }, [isOpen, projectId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const updateAssignee = async (newAssigneeName: string | null, newAssigneeId: string | null) => {
    if (newAssigneeName === assignee) {
        setIsOpen(false);
        return;
    }

    const oldAssignee = assignee;
    setAssignee(newAssigneeName);
    setIsOpen(false);

    const supabase = createClient();
    const { error } = await supabase
        .from('issues')
        .update({ 
            assignee_name: newAssigneeName,
            assignee_id: newAssigneeId 
        })
        .eq('id', issueId);

    if (error) {
        console.error('Error updating assignee:', error);
        setAssignee(oldAssignee);
    } else {
        router.refresh();
    }
  };

  // Helper to get initials
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  // Find current assignee details if available in fetched members, or try to construct best guess if name matches
  // Actually if we haven't fetched members yet, we only have the name string. 
  // We can just show initials of the name string.
  
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
        <div 
            onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
            className="cursor-pointer rounded-full hover:opacity-80 transition-opacity"
            title={assignee || "Unassigned"}
        >
            {assignee ? (
                <div className={`w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold border border-[#2A2D35]`}>
                    {getInitials(assignee)}
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
                    onClick={(e) => { e.stopPropagation(); updateAssignee(null, null); }}
                    className="flex items-center gap-2 px-2 py-1.5 mx-1 rounded text-xs text-[#E3E4E6] hover:bg-[#5E6AD2] cursor-pointer group transition-colors"
                >
                     <div className="w-4 h-4 rounded-full border border-dashed border-[#7C7F88] flex items-center justify-center shrink-0">
                        <User size={10} className="text-[#7C7F88] group-hover:text-white" />
                     </div>
                     <span className="flex-1">Unassigned</span>
                     {!assignee && <Check size={12} />}
                </div>

                <div className="h-[1px] bg-[#2A2D35] my-1 mx-2" />

                {members.length === 0 && (
                    <div className="px-3 py-2 text-[10px] text-[#7C7F88] text-center">
                        {projectId ? 'Loading members...' : 'No project context'}
                    </div>
                )}

                {members.map(member => (
                    <div
                        key={member.id}
                        onClick={(e) => { e.stopPropagation(); updateAssignee(member.name, member.id); }}
                        className="flex items-center gap-2 px-2 py-1.5 mx-1 rounded text-xs text-[#E3E4E6] hover:bg-[#5E6AD2] cursor-pointer group transition-colors"
                    >
                         <div className={`w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[8px] text-white font-bold shrink-0 border border-[#2A2D35]`}>
                             {getInitials(member.name)}
                         </div>
                         <span className="flex-1">{member.name}</span>
                         {assignee === member.name && <Check size={12} />}
                    </div>
                ))}
            </div>
        )}
    </div>
  );
}
