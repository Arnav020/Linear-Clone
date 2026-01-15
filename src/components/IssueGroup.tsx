'use client';

import { ChevronRight, Plus, Circle, CheckCircle2 } from 'lucide-react';
import IssueListItem from './IssueListItem';
import { useState } from 'react';

interface IssueGroupProps {
  title: string;
  issues: any[];
  count: number;
  icon: React.ReactNode;
  onIssueUpdate?: () => void;
}

export default function IssueGroup({ title, issues, count, icon, onIssueUpdate }: IssueGroupProps) {
    // We can add collapse state here later if needed
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex flex-col">
            <div 
                className="h-8 flex items-center gap-2 group cursor-pointer mb-1 select-none"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                 <div className="p-0.5 rounded hover:bg-white/5 text-[#7C7F88] transition-colors">
                     <ChevronRight size={12} className={`transition-transform group-hover:text-[#E3E4E6] ${isCollapsed ? '' : 'rotate-90'}`} />
                 </div>
                 <div className="flex items-center gap-2">
                     {icon}
                     <span className="text-xs font-medium text-[#E3E4E6]">{title}</span>
                     <span className="text-xs text-[#7C7F88]">{count}</span>
                 </div>
                 <div className="ml-2 flex-1 h-[1px] bg-[#2A2D35]/50 group-hover:bg-[#2A2D35] transition-colors"></div>
                 <Plus size={14} className="text-[#7C7F88] opacity-0 group-hover:opacity-100 transition-opacity hover:text-[#E3E4E6]" />
            </div>
            
            {!isCollapsed && (
                <div className="flex flex-col gap-0.5 pl-1">
                     {issues.length === 0 ? (
                        <div className="py-8 border border-dashed border-[#2A2D35] rounded flex items-center justify-center">
                            <span className="text-xs text-[#7C7F88]">No issues</span>
                        </div>
                     ) : (
                        issues.map(i => <IssueListItem key={i.id} issue={i} onIssueUpdate={onIssueUpdate} />)
                     )}
                </div>
            )}
        </div>
    );
}
