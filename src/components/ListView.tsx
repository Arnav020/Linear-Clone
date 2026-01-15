'use client';

import { Circle, CheckCircle2 } from 'lucide-react';
import IssueGroup from './IssueGroup';

interface ListViewProps {
  issues: any[];
}

export default function ListView({ issues }: ListViewProps) {
  const normalizeStatus = (status: string) => status?.toLowerCase().replace('_', ' ') || 'backlog';

  const backlogIssues = issues?.filter(i => normalizeStatus(i.status) === 'backlog') || [];
  const todoIssues = issues?.filter(i => normalizeStatus(i.status) === 'todo') || [];
  const inProgressIssues = issues?.filter(i => normalizeStatus(i.status) === 'in progress') || [];
  const doneIssues = issues?.filter(i => normalizeStatus(i.status) === 'done') || [];
  const canceledIssues = issues?.filter(i => normalizeStatus(i.status) === 'canceled') || [];
  const duplicateIssues = issues?.filter(i => normalizeStatus(i.status) === 'duplicate') || [];

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6 pb-10">
        <IssueGroup 
            title="In Progress" 
            count={inProgressIssues.length}
            issues={inProgressIssues} 
            icon={<div className="w-3.5 h-3.5 rounded-full border-2 border-[#F59E0B] border-t-transparent -rotate-45" />} 
        />
        <IssueGroup 
            title="Todo" 
            count={todoIssues.length}
            issues={todoIssues} 
            icon={<Circle size={14} className="text-[#6366F1]" />} 
        />
        <IssueGroup 
            title="Backlog" 
            count={backlogIssues.length}
            issues={backlogIssues} 
            icon={<Circle size={14} className="text-[#78716C] border-dashed" />} 
        />
        <IssueGroup 
            title="Done" 
            count={doneIssues.length}
            issues={doneIssues} 
            icon={<CheckCircle2 size={14} className="text-[#5E6AD2]" />} 
        />

        {/* Hidden Issues Section */}
        {(canceledIssues.length > 0 || duplicateIssues.length > 0) && (
             <div className="mt-4 pt-4 border-t border-[#2A2D35]">
                 <div className="flex items-center gap-2 mb-4 text-[#7C7F88] font-medium text-sm">
                     <span>Hidden issues</span>
                     <span className="text-xs bg-[#2A2D35] px-1.5 py-0.5 rounded text-[#7C7F88]">{canceledIssues.length + duplicateIssues.length}</span>
                 </div>
                 
                 <div className="flex flex-col gap-6 opacity-60 hover:opacity-100 transition-opacity duration-300">
                    {canceledIssues.length > 0 && (
                        <IssueGroup 
                            title="Canceled" 
                            count={canceledIssues.length}
                            issues={canceledIssues} 
                            icon={<div className="w-3.5 h-3.5 rounded-full bg-[#2A2D35] border border-[#7C7F88] flex items-center justify-center"><div className="w-1 h-1 rounded-full bg-[#7C7F88]"></div></div>} 
                        />
                    )}
                    {duplicateIssues.length > 0 && (
                        <IssueGroup 
                            title="Duplicate" 
                            count={duplicateIssues.length}
                            issues={duplicateIssues} 
                            icon={<div className="w-3.5 h-3.5 rounded-full bg-[#2A2D35] border border-[#7C7F88] flex items-center justify-center"><div className="w-1 h-1 rounded-full bg-[#7C7F88]"></div></div>} 
                        />
                    )}
                 </div>
             </div>
        )}
    </div>
  );
}
