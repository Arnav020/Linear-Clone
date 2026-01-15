'use client';

import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { useState, useEffect } from 'react';
import BoardColumn from './BoardColumn';
import IssueCard from './IssueCard';
import { createClient } from '@/lib/supabase';
import { ChevronRight } from 'lucide-react';

interface BoardViewProps {
  issues: any[];
}

import { useRouter } from 'next/navigation';

export default function BoardView({ issues }: BoardViewProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeIssue, setActiveIssue] = useState<any | null>(null);
  const router = useRouter();

  // Optimistic state usually handled by optimistic UI or just relying on parent re-render if fast enough. 
  // For standard React, modifying prop-derived state is better.
  // But here we might just trigger an update and let parent/Supabase refresh.
  // Ideally, we lift state up or use optimistic hook. 
  // For simplicity, we'll fire Supabase update and wait for real-time or revalidation.
  // However, DnD feels laggy without instant update.
  // Let's implement local optimistic state.
  
  const [localIssues, setLocalIssues] = useState(issues);

  // Sync with props when they change (e.g. from server)
  // But be careful not to overwrite optimistic updates immediately if server is slow.
  // We'll trust props for now and implement local reorder.
  if (localIssues !== issues) { // Simple reference check often fails, but assume parent passes fresh arrays.
      // Actually, updating local state from props needs useEffect.
  }
  
  // Actually, simpler: just use props issues, and update Supabase. 
  // If we want optimistic, we need a way to mutate `issues` immediately.
  // Since `issues` comes from a Server Component `page.tsx`, we can't easily mutate it without a refresh.
  // So we use local state initialized from props.
  useState(() => {
      // Intentionally empty, relying on initial state.
      // But we need to update if props change (e.g. new issue created).
  });
  
  // Sync state with props
  useEffect(() => {
     setLocalIssues(issues);
  }, [issues]);

  // Better approach: Use local state derived from props, update it on drop, and sync.
  // This is a common pattern.
  
  // Re-sync local issues when props change
  // Note: This overrides local optimistic updates if server update arrives later.
  // For this task, we will just use `localIssues` and update it.
  
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
            router.refresh(); // Sync with server
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
            <BoardColumn status="Backlog" issues={getIssuesByStatus('backlog')} count={getIssuesByStatus('backlog').length} />
            <BoardColumn status="Todo" issues={getIssuesByStatus('todo')} count={getIssuesByStatus('todo').length} />
            <BoardColumn status="In Progress" issues={getIssuesByStatus('in progress')} count={getIssuesByStatus('in progress').length} />
            <BoardColumn status="Done" issues={getIssuesByStatus('done')} count={getIssuesByStatus('done').length} />
            
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
