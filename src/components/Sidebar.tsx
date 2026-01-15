'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Inbox, Layers, MoreHorizontal, Plus, Github, Download, ChevronDown, ListFilter, PenSquare, Search, Bell, HelpCircle, User, ChevronLeft, ChevronRight, PanelLeft } from 'lucide-react';
import React, { useState } from 'react';

import NewIssueModal from './NewIssueModal';

const Sidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isNewIssueModalOpen, setIsNewIssueModalOpen] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const containerClass = isCollapsed 
    ? "w-[64px] transition-[width] duration-300 ease-in-out" 
    : "w-[240px] transition-[width] duration-300 ease-in-out";

  return (
    <>
    <aside className={`${containerClass} h-screen bg-[#16181D] border-r border-[#2A2D35] flex flex-col items-center py-3 z-50 text-[13px] font-medium font-sans shrink-0`}>
      {/* Workspace Switcher / Header */}
      <div className={`w-full px-3 mb-2 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
         {isCollapsed ? (
             <div className="w-8 h-8 rounded-md bg-orange-500 flex items-center justify-center text-white font-bold text-xs cursor-pointer hover:opacity-90 transition-opacity">
                M
             </div>
         ) : (
            <>
             <div className="flex items-center gap-2 text-[#E3E4E6] p-1 hover:bg-white/5 rounded cursor-pointer transition-colors max-w-[160px]">
                <div className="w-4 h-4 bg-orange-500 rounded flex items-center justify-center text-[10px] text-white font-bold shrink-0">M</div>
                <span className="truncate">My Practise ...</span>
                <ChevronDown size={14} className="text-[#7C7F88]" />
             </div>
             <PanelLeft 
                size={16} 
                className="text-[#7C7F88] hover:text-[#E3E4E6] cursor-pointer" 
                onClick={toggleSidebar}
             />
            </>
         )}
      </div>
      
      {isCollapsed && (
          <div className="mb-4 text-[#7C7F88] hover:text-[#E3E4E6] cursor-pointer" onClick={toggleSidebar}>
              <PanelLeft size={18} />
          </div>
      )}

      {/* Content Container */}
      <div className="flex-1 w-full overflow-y-auto overflow-x-hidden flex flex-col gap-6 px-3">
         
         {/* Top Section */}
         <div className="flex flex-col gap-0.5">
            <SidebarItem icon={<PenSquare size={isCollapsed ? 18 : 16} />} label="New Issue" onClick={() => setIsNewIssueModalOpen(true)} collapsed={isCollapsed} active={isNewIssueModalOpen} />
            <div className="h-2"></div>
            <SidebarItem icon={<Inbox size={isCollapsed ? 18 : 16} />} label="Inbox" href="/inbox" collapsed={isCollapsed} active={pathname === '/inbox'} />
            <SidebarItem icon={<ListFilter size={isCollapsed ? 18 : 16} />} label="My Issues" href="/my-issues" collapsed={isCollapsed} active={pathname === '/my-issues'} />
         </div>

         {/* Workspace Section */}
         <div className="flex flex-col gap-0.5">
            {!isCollapsed && <SectionHeader label="Workspace" />}
            <SidebarItem icon={<Layers size={isCollapsed ? 18 : 16} />} label="Projects" href="/projects" collapsed={isCollapsed} active={pathname === '/projects'} />
            <SidebarItem icon={<Layers size={isCollapsed ? 18 : 16} />} label="Views" href="/views" collapsed={isCollapsed} active={pathname === '/views'} />
            <SidebarItem icon={<MoreHorizontal size={isCollapsed ? 18 : 16} />} label="More" href="/more" collapsed={isCollapsed} />
         </div>

         {/* Your Teams Section */}
         <div className="flex flex-col gap-0.5">
            {!isCollapsed && (
                <div className="mb-1 px-2 py-1 flex items-center justify-between text-[#7C7F88] hover:text-[#E3E4E6] cursor-pointer group">
                   <span className="text-xs font-semibold">Your teams</span>
                   <Plus size={12} className="opacity-0 group-hover:opacity-100" />
                </div>
            )}
            
            {/* Team Item */}
            <div className={`flex flex-col gap-0.5 ${isCollapsed ? 'items-center' : ''}`}>
                <div className={`flex items-center gap-2 ${isCollapsed ? 'justify-center w-10 h-10' : 'px-2 py-1.5'} text-[#E3E4E6] hover:bg-white/5 rounded cursor-pointer`}>
                    <div className="w-3 h-3 bg-red-500 rounded-[3px] text-white flex items-center justify-center text-[8px] shrink-0"></div>
                    {!isCollapsed && <span className="truncate flex-1">My Practise Demo</span>}
                </div>
                
                {/* Team Sub-items: Always Render, adjust spacing/indent if not collapsed */}
                <div className={`${!isCollapsed ? 'pl-6' : ''} flex flex-col gap-0.5`}>
                        <SidebarItem icon={<ListFilter size={16} />} label="Issues" href="/" active={pathname === '/'} collapsed={isCollapsed} />
                        <SidebarItem icon={<Layers size={16} />} label="Projects" href="/team/demo/projects" collapsed={isCollapsed} />
                        <SidebarItem icon={<Layers size={16} />} label="Views" href="/team/demo/views" collapsed={isCollapsed} />
                </div>
            </div>
         </div>

         {/* Try Section */}
         <div className="mt-auto flex flex-col gap-0.5 pt-4">
             {!isCollapsed && <div className="px-2 pb-2 text-xs font-semibold text-[#7C7F88]">Try</div>}
             <SidebarItem icon={<Download size={isCollapsed ? 18 : 16} />} label="Import issues" href="/import" collapsed={isCollapsed} />
             <SidebarItem icon={<Plus size={isCollapsed ? 18 : 16} />} label="Invite people" href="/invite" collapsed={isCollapsed} />
             <SidebarItem icon={<Github size={isCollapsed ? 18 : 16} />} label="Link GitHub" href="/github" collapsed={isCollapsed} />
         </div>
      </div>
      
       {/* Footer */}
       <div className={`h-10 border-t border-[#2A2D35] flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-4 gap-2'} w-full mt-2 text-[#7C7F88] hover:text-[#E3E4E6] cursor-pointer`}>
           <HelpCircle size={18} />
           {!isCollapsed && <span>Help & Support</span>}
       </div>
    </aside>
    
    <NewIssueModal isOpen={isNewIssueModalOpen} onClose={() => setIsNewIssueModalOpen(false)} />
    </>
  );
};

const SectionHeader = ({ label }: { label: string }) => (
    <div className="flex items-center justify-between px-2 py-1 group cursor-pointer hover:bg-white/5 rounded-md mt-2">
        <span className="text-xs font-semibold text-[#7C7F88] group-hover:text-[#E3E4E6] transition-colors">{label}</span>
        <ChevronDown size={12} className="text-[#7C7F88] opacity-0 group-hover:opacity-100" />
    </div>
);

const SidebarItem = ({ icon, label, href, active, collapsed, onClick }: { icon: React.ReactNode, label: string, href?: string, active?: boolean, collapsed?: boolean, onClick?: () => void }) => {
  const content = (
      <>
        <span className={active ? 'text-[#E3E4E6]' : 'text-[#7C7F88] group-hover:text-[#E3E4E6]'}>{icon}</span>
        <span className="truncate">{label}</span>
      </>
  );

  const collapsedContent = (
      <>
        <span className={active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}>
            {icon}
        </span>
        {active && <div className="absolute left-[-6px] top-2 bottom-2 w-1 bg-[#5E6AD2] rounded-r-none rounded-l"></div>}
      </>
  );

  const className = collapsed 
    ? `relative w-10 h-10 flex items-center justify-center rounded-md transition-all duration-200 group shrink-0 ${active ? 'bg-white/10 text-[#E3E4E6]' : 'text-[#7C7F88] hover:bg-white/5 hover:text-[#E3E4E6]'}`
    : `flex items-center gap-3 px-2 py-1.5 rounded-md transition-colors whitespace-nowrap overflow-hidden ${active ? 'bg-[#2A2D35]/80 text-[#E3E4E6]' : 'text-[#7C7F88] hover:bg-[#2A2D35]/50 hover:text-[#E3E4E6]'}`;

  if (onClick) {
      return (
          <div onClick={onClick} className={`${className} cursor-pointer`} title={collapsed ? label : undefined}>
              {collapsed ? collapsedContent : content}
          </div>
      );
  }

  return (
    <Link 
      href={href || '#'}
      className={className}
      title={collapsed ? label : undefined}
    >
      {collapsed ? collapsedContent : content}
    </Link>
  );
};

export default Sidebar;
