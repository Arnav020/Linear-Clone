'use client';

import { useState } from 'react';
import { ChevronRight, Plus } from 'lucide-react';

interface CollapsibleIssueGroupProps {
    title: string;
    count: number;
    icon: React.ReactNode;
    children: React.ReactNode;
}

export default function CollapsibleIssueGroup({ title, count, icon, children }: CollapsibleIssueGroupProps) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="flex flex-col">
            <div 
                className="h-8 flex items-center gap-2 group cursor-pointer mb-1 select-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                 <div className="p-0.5 rounded hover:bg-white/5 text-[#7C7F88] transition-colors">
                     <ChevronRight 
                        size={12} 
                        className={`transition-transform duration-200 group-hover:text-[#E3E4E6] ${isOpen ? 'rotate-90' : ''}`} 
                     />
                 </div>
                 <div className="flex items-center gap-2">
                     {icon}
                     <span className="text-xs font-medium text-[#E3E4E6]">{title}</span>
                     <span className="text-xs text-[#7C7F88]">{count}</span>
                 </div>
                 <div className="ml-2 flex-1 h-[1px] bg-[#2A2D35]/50 group-hover:bg-[#2A2D35] transition-colors"></div>
                 <Plus size={14} className="text-[#7C7F88] opacity-0 group-hover:opacity-100 transition-opacity hover:text-[#E3E4E6]" />
            </div>
            
            {isOpen && (
                <div className="flex flex-col gap-0.5 pl-1 animate-in fade-in slide-in-from-top-1 duration-150">
                    {children}
                </div>
            )}
        </div>
    );
}
