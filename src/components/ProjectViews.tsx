'use client';

import { useState, useEffect } from 'react';
import ListView from './ListView';
import BoardView from './BoardView';
import ViewToggle from './ViewToggle';
import { SlidersHorizontal } from 'lucide-react';
import NewIssueTrigger from '@/components/NewIssueTrigger';
import { useViewFilter } from '@/context/ViewFilterContext';
import AIPrioritizeButton from './AIPrioritizeButton';
import BulkActionsMenu from './BulkActionsMenu';

interface ProjectViewsProps {
  issues: any[];
}

export default function ProjectViews({ issues }: ProjectViewsProps) {
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');

  useEffect(() => {
    const saved = localStorage.getItem('linear_clone_view_mode') as 'list' | 'board';
    if (saved) setViewMode(saved);
  }, []);

  const handleViewChange = (mode: 'list' | 'board') => {
    setViewMode(mode);
    localStorage.setItem('linear_clone_view_mode', mode);
  };

  const { filter } = useViewFilter();

  const filteredIssues = issues.filter(issue => {
      // Normalize status if needed, but assuming consistent Case
      const status = issue.status || 'Backlog';
      
      if (filter === 'active') {
          return ['Todo', 'In Progress'].includes(status);
      }
      if (filter === 'backlog') {
          return status === 'Backlog';
      }
      // 'all' includes everything
      return true;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Page Header - Moved here from page.tsx to control View Toggle state */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A2D35] shrink-0">
         <div className="flex items-center gap-3">
             <h1 className="text-sm font-semibold text-[#E3E4E6]">
                 {filter === 'all' ? 'All Issues' : filter === 'active' ? 'Active Issues' : 'Backlog Issues'}
             </h1>
             <div className="h-3 w-[1px] bg-[#2A2D35]"></div>
             <ViewToggle currentView={viewMode} onViewChange={handleViewChange} />
         </div>
         
         <div className="flex items-center gap-3">
             {/* AI Prioritize Button */}
             <AIPrioritizeButton issues={filteredIssues} />
             
             {/* New Issue Button */}
             <div className="relative">
                  <NewIssueTrigger /> 
             </div>
         </div>
      </div>

      <div className="flex-1 overflow-hidden w-full px-6 pt-4 pb-0">
          {viewMode === 'list' ? (
              <div className="h-full overflow-y-auto pb-20">
                   <ListView issues={filteredIssues} />
              </div>
          ) : (
              <div className="h-full overflow-x-auto overflow-y-hidden">
                   <BoardView issues={filteredIssues} />
              </div>
          )}
      </div>
      <BulkActionsMenu />
    </div>
  );
}
