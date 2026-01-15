'use client';

import { useDroppable } from '@dnd-kit/core';
import IssueCard from './IssueCard';
import { Plus, MoreHorizontal } from 'lucide-react';
import { StatusIcon } from './StatusIcon';

interface BoardColumnProps {
  status: string;
  issues: any[];
  count: number;
}

export default function BoardColumn({ status, issues, count }: BoardColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div className="flex flex-col h-full min-w-[280px] w-[280px]">
      {/* Column Header */}
      <div className="flex items-center justify-between px-2 mb-3 group">
          <div className="flex items-center gap-2">
              <StatusIcon status={status} />
              <span className="text-xs font-medium text-[#E3E4E6]">{status}</span>
              <span className="text-xs text-[#7C7F88]">{count}</span>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
               <button className="p-1 hover:bg-[#2A2D35] rounded text-[#7C7F88] hover:text-[#E3E4E6]">
                   <Plus size={14} />
               </button>
               <button className="p-1 hover:bg-[#2A2D35] rounded text-[#7C7F88] hover:text-[#E3E4E6]">
                   <MoreHorizontal size={14} />
               </button>
          </div>
      </div>

      {/* Droppable Area */}
      <div 
        ref={setNodeRef}
        className={`flex-1 flex flex-col gap-2 p-1 rounded-lg transition-colors ${isOver ? 'bg-[#2A2D35]/30' : ''}`}
      >
         {issues.map(issue => (
             <IssueCard key={issue.id} issue={issue} />
         ))}
         {issues.length === 0 && (
            <div className="h-24 border border-dashed border-[#2A2D35] rounded-lg flex items-center justify-center">
                 <span className="text-xs text-[#575a61]">No issues</span>
            </div>
         )}
      </div>
    </div>
  );
}
