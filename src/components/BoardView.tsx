'use client';

import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { useState, useEffect } from 'react';
import BoardColumn from './BoardColumn';
import IssueCard from './IssueCard';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface BoardViewProps {
  issues: any[];
  refreshIssues?: () => Promise<void>;
}

export default function BoardView({ issues, refreshIssues }: BoardViewProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeIssue, setActiveIssue] = useState<any | null>(null);
  const router = useRouter();
  
  const [localIssues, setLocalIssues] = useState(issues);

  // Sync state with props
  useEffect(() => {
     setLocalIssues(issues);
  }, [issues]);

  // Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement to start drag, preventing accidental drags on clicks
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setActiveIssue(event.active.data.current?.issue);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
        setActiveId(null);
        setActiveIssue(null);
        return;
    }

    const issueId = active.id as string;
    const newStatus = over.id as string;
    
    const issue = localIssues.find(i => i.id === issueId);
    
    if (issue && issue.status !== newStatus) {
        // Optimistic update
        const updatedLocalIssues = localIssues.map(i => 
             i.id === issueId ? { ...i, status: newStatus } : i
        );
        setLocalIssues(updatedLocalIssues);

        // Supabase Update
        const supabase = createClient();
        const { error } = await supabase
            .from('issues')
            .update({ status: newStatus })
            .eq('id', issueId);
            
        if (error) {
            console.error('Failed to update status', error);
            // Revert
            setLocalIssues(localIssues); 
        } else {
            // Trigger manual refresh if callback provided
            if (refreshIssues) refreshIssues();
            // router.refresh(); // Sync with server backup
        }
    }

    setActiveId(null);
    setActiveIssue(null);
  };

  // Group issues by status
  const normalizeStatus = (status: string) => status?.toLowerCase().replace('_', ' ').replace('-', ' ').trim() || 'backlog';

  const getIssuesByStatus = (status: string) => {
      const target = normalizeStatus(status);
      return localIssues.filter(i => normalizeStatus(i.status) === target);
  };

  const canceled = getIssuesByStatus('canceled');
  const duplicate = getIssuesByStatus('duplicate');

  return (
    <DndContext 
        sensors={sensors}
        onDragStart={handleDragStart} 
        onDragEnd={handleDragEnd}
    >
        <div className="flex h-full gap-4 overflow-x-auto pb-4 pr-10">
            <BoardColumn status="Backlog" issues={getIssuesByStatus('backlog')} count={getIssuesByStatus('backlog').length} onIssueUpdate={refreshIssues} />
            <BoardColumn status="Todo" issues={getIssuesByStatus('todo')} count={getIssuesByStatus('todo').length} onIssueUpdate={refreshIssues} />
            <BoardColumn status="In Progress" issues={getIssuesByStatus('in progress')} count={getIssuesByStatus('in progress').length} onIssueUpdate={refreshIssues} />
            <BoardColumn status="Done" issues={getIssuesByStatus('done')} count={getIssuesByStatus('done').length} onIssueUpdate={refreshIssues} />
            
            {/* Hidden Columns Panel */}
            <div className="border-l border-[#2A2D35] pl-4 flex flex-col gap-4 min-w-[280px]">
                <div className="flex items-center gap-2 text-[#7C7F88] text-xs font-medium mb-2 uppercase tracking-wider">
                    Hidden Issues
                </div>
                
                {/* Canceled */}
                <div className="flex flex-col gap-2">
                     <div className="flex items-center gap-2 text-[#7C7F88] text-xs font-medium bg-[#1C1E22] p-1.5 rounded border border-[#2A2D35]">
                         <span className="w-1.5 h-1.5 rounded-full border border-[#7C7F88]"></span>
                         <span>Canceled</span>
                         <span className="ml-auto text-[#575a61]">{canceled.length}</span>
                     </div>
                     <div className="flex flex-col gap-2">
                        {canceled.map(issue => (
                            <IssueCard key={issue.id} issue={issue} />
                        ))}
                     </div>
                </div>

                 {/* Duplicate */}
                <div className="flex flex-col gap-2">
                     <div className="flex items-center gap-2 text-[#7C7F88] text-xs font-medium bg-[#1C1E22] p-1.5 rounded border border-[#2A2D35]">
                         <span className="w-1.5 h-1.5 rounded-full border border-[#7C7F88]"></span>
                         <span>Duplicate</span>
                         <span className="ml-auto text-[#575a61]">{duplicate.length}</span>
                     </div>
                     <div className="flex flex-col gap-2">
                        {duplicate.map(issue => (
                            <IssueCard key={issue.id} issue={issue} />
                        ))}
                     </div>
                </div>
            </div>
        </div>

        {/* Drag Overlay for smooth dragging visual */}
        <DragOverlay>
            {activeIssue ? (
                <div className="opacity-90 rotate-2 scale-105 cursor-grabbing">
                    <IssueCard issue={activeIssue} />
                </div>
            ) : null}
        </DragOverlay>
    </DndContext>
  );
}
