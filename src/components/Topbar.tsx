'use client';

import { Search, ListFilter, SlidersHorizontal, Plus, Bell, ChevronDown } from 'lucide-react';
import { useViewFilter } from '@/context/ViewFilterContext';
import ProjectSelector from './ProjectSelector';
import { usePathname } from 'next/navigation';

const Topbar = () => {
  const { filter, setFilter } = useViewFilter();
  const pathname = usePathname();
  const isProjectsPage = pathname === '/projects';
  return (
    <header className="h-12 border-b border-[#2A2D35] flex items-center justify-between px-4 bg-[#0D0E11] text-[#E3E4E6] font-sans">
      {!isProjectsPage ? (
        <div className="flex items-center gap-3">
          <ProjectSelector />
          <button className="p-1 text-[#7C7F88] hover:text-[#E3E4E6] rounded hover:bg-white/5 transition-colors">
              <SlidersHorizontal size={16} />
          </button>
          <div className="h-4 w-[1px] bg-[#2A2D35]"></div>

          {/* View Tabs - Refined */}
          <div className="flex items-center gap-1">
              <button 
                  onClick={() => setFilter('all')}
                  className={`px-2 py-1 rounded flex items-center gap-1.5 text-xs font-medium transition-colors ${filter === 'all' ? 'bg-[#2A2D35] text-[#E3E4E6]' : 'text-[#7C7F88] hover:text-[#E3E4E6] hover:bg-white/5'}`}
              >
                  <ListFilter size={13} className={filter === 'all' ? "opacity-100" : "opacity-70"} />
                  <span>All issues</span>
              </button>
              <button 
                  onClick={() => setFilter('active')}
                  className={`px-2 py-1 rounded flex items-center gap-1.5 text-xs font-medium transition-colors ${filter === 'active' ? 'bg-[#2A2D35] text-[#E3E4E6]' : 'text-[#7C7F88] hover:text-[#E3E4E6] hover:bg-white/5'}`}
              >
                  <span>Active</span>
              </button>
              <button 
                  onClick={() => setFilter('backlog')}
                  className={`px-2 py-1 rounded flex items-center gap-1.5 text-xs font-medium transition-colors ${filter === 'backlog' ? 'bg-[#2A2D35] text-[#E3E4E6]' : 'text-[#7C7F88] hover:text-[#E3E4E6] hover:bg-white/5'}`}
              >
                  <span>Backlog</span>
              </button>
          </div>
        </div>
      ) : (
        <div></div> /* Spacer */
      )}

      <div className="flex items-center gap-4">
          {!isProjectsPage && (
            <div className="relative group w-64 transition-all focus-within:w-80">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#7C7F88] group-focus-within:text-[#E3E4E6]" size={14} />
                <input 
                    type="text" 
                    placeholder="Search issues..." 
                    className="w-full bg-[#1C1E22] border border-[#2A2D35] focus:border-[#5E6AD2] rounded-md py-1.5 pl-8 pr-3 text-xs text-[#E3E4E6] placeholder-[#7C7F88]/60 focus:outline-none transition-all shadow-sm"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-0.5">
                    <span className="text-[10px] text-[#7C7F88] bg-[#2A2D35] px-1 rounded border border-[#3a3d45]">/</span>
                </div>
            </div>
          )}
          
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full hover:bg-[#2A2D35] flex items-center justify-center cursor-pointer transition-colors text-[#7C7F88] hover:text-[#E3E4E6]">
                 <Bell size={16} />
             </div>
             <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 border border-[#2A2D35]"></div>
          </div>
      </div>
    </header>
  );
};

export default Topbar;
