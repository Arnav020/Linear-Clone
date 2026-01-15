'use client';

import { Search, ListFilter, SlidersHorizontal, Plus, Bell, ChevronDown } from 'lucide-react';
import { useViewFilter } from '@/context/ViewFilterContext';

const Topbar = () => {
  const { filter, setFilter } = useViewFilter();
  return (
    <header className="h-12 border-b border-[#2A2D35] flex items-center justify-between px-4 bg-[#0D0E11] text-[#E3E4E6] font-sans">
      <div className="flex items-center gap-3">
         {/* Team Selector */}
         <div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#2A2D35] cursor-pointer transition-colors group">
             <div className="w-4 h-4 bg-[#5E6AD2] rounded-[3px] flex items-center justify-center text-[10px] text-white font-bold">L</div>
             <span className="text-sm font-medium text-[#E3E4E6]">Linear Clone</span>
             <ChevronDown size={12} className="text-[#7C7F88] group-hover:text-[#E3E4E6]" />
         </div>
         
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

      <div className="flex items-center gap-4">
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
