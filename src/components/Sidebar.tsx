'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Inbox, Layers, MoreHorizontal, Plus, Github, Download, ChevronDown, ListFilter, PenSquare, Search, Bell, HelpCircle, LogOut, PanelLeft, User as UserIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useUser } from '@/context/UserContext';
import NewIssueModal from './NewIssueModal';

const Sidebar = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('project');
  const { user, logout } = useUser();
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isNewIssueModalOpen, setIsNewIssueModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  useEffect(() => {
    const fetchProject = async () => {
        if (projectId) {
            const supabase = createClient();
            const { data } = await supabase.from('projects').select('name').eq('id', projectId).single();
            if (data) setProjectName((data as { name: string }).name);
        } else {
            setProjectName('');
        }
    };
    fetchProject();
  }, [projectId]);

  const containerClass = isCollapsed 
    ? "w-[64px] transition-[width] duration-300 ease-in-out" 
    : "w-[240px] transition-[width] duration-300 ease-in-out";

  const userInitial = user?.name ? user.name[0].toUpperCase() : 'U';

  return (
    <>
    <aside className={`${containerClass} h-screen bg-[#16181D] border-r border-[#2A2D35] flex flex-col items-center py-3 z-50 text-[13px] font-medium font-sans shrink-0`}>
      {/* User / Workspace Switcher */}
      <div className={`w-full px-3 mb-2 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
         {isCollapsed ? (
             <div className="w-8 h-8 rounded-md bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs cursor-pointer hover:opacity-90 transition-opacity" title={user?.name || 'User'}>
                {userInitial}
             </div>
         ) : (
            <div className="flex items-center justify-between w-full group">
             <div className="flex items-center gap-2 text-[#E3E4E6] p-1 hover:bg-white/5 rounded cursor-pointer transition-colors max-w-[160px] overflow-hidden">
                <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-indigo-600 rounded flex items-center justify-center text-[10px] text-white font-bold shrink-0">
                    {userInitial}
                </div>
                <span className="truncate">{user?.name || 'My Workspace'}</span>
             </div>
             
             <button 
                onClick={logout}
                className="p-1.5 text-[#7C7F88] hover:text-[#E3E4E6] hover:bg-white/5 rounded transition-colors opacity-0 group-hover:opacity-100"
                title="Log out"
            >
                <LogOut size={14} />
             </button>
            </div>
         )}
      </div>
      
      {/* Collapse Toggle for mobile/desktop preference */}
      {!isCollapsed && (
          <div className="absolute top-4 right-[-12px] z-50 opacity-0 hover:opacity-100 transition-opacity">
               {/* Could add a floating toggle here, but sticking to bottom/internal mainly */}
          </div>
      )}

      {/* Content Container */}
      <div className="flex-1 w-full overflow-y-auto overflow-x-hidden flex flex-col gap-6 px-3 mt-4">
         
         {/* Top Section */}
         <div className="flex flex-col gap-0.5">
            <SidebarItem icon={<PenSquare size={isCollapsed ? 18 : 16} />} label="New Issue" onClick={() => setIsNewIssueModalOpen(true)} collapsed={isCollapsed} active={isNewIssueModalOpen} />
            <div className="h-2"></div>
            <SidebarItem icon={<Inbox size={isCollapsed ? 18 : 16} />} label="Inbox" href="/dashboard/inbox" collapsed={isCollapsed} active={pathname === '/dashboard/inbox'} />
            <SidebarItem icon={<ListFilter size={isCollapsed ? 18 : 16} />} label="My Issues" href="/dashboard/my-issues" collapsed={isCollapsed} active={pathname === '/dashboard/my-issues'} />
         </div>

         {/* Workspace Section */}
         <div className="flex flex-col gap-0.5">
            {!isCollapsed && <SectionHeader label="Workspace" />}
            <SidebarItem icon={<Layers size={isCollapsed ? 18 : 16} />} label="Projects" href="/dashboard/projects" collapsed={isCollapsed} active={pathname === '/dashboard/projects'} />
            <SidebarItem icon={<Layers size={isCollapsed ? 18 : 16} />} label="Views" href="/dashboard/views" collapsed={isCollapsed} active={pathname === '/dashboard/views'} />
            <SidebarItem icon={<MoreHorizontal size={isCollapsed ? 18 : 16} />} label="More" href="/dashboard/more" collapsed={isCollapsed} />
         </div>

         {/* Active Project Section - Only show if projectId exists */}
         {projectId && (
            <div className="flex flex-col gap-0.5">
                {!isCollapsed && (
                    <div className="mb-1 px-2 py-1 flex items-center justify-between text-[#7C7F88] hover:text-[#E3E4E6] cursor-pointer group">
                    <span className="text-xs font-semibold">Project</span>
                    <Plus size={12} className="opacity-0 group-hover:opacity-100" />
                    </div>
                )}
                
                {/* Project Item */}
                <div className={`flex flex-col gap-0.5 ${isCollapsed ? 'items-center' : ''}`}>
                    <div className={`flex items-center gap-2 ${isCollapsed ? 'justify-center w-10 h-10' : 'px-2 py-1.5'} text-[#E3E4E6] hover:bg-white/5 rounded cursor-pointer`}>
                        <div className="w-3 h-3 bg-red-500 rounded-[3px] text-white flex items-center justify-center text-[8px] shrink-0">
                            {projectName ? projectName[0] : 'P'}
                        </div>
                        {!isCollapsed && <span className="truncate flex-1">{projectName || 'Project'}</span>}
                    </div>
                    
                    {/* Project Sub-items */}
                    <div className={`${!isCollapsed ? 'pl-6' : ''} flex flex-col gap-0.5`}>
                            <SidebarItem icon={<ListFilter size={16} />} label="Issues" href={`/dashboard?project=${projectId}`} active={pathname === '/dashboard' && searchParams.get('project') === projectId} collapsed={isCollapsed} />
                    </div>
                </div>
            </div>
         )}

         {/* Try Section */}
         <div className="mt-auto flex flex-col gap-0.5 pt-4">
             {!isCollapsed && <div className="px-2 pb-2 text-xs font-semibold text-[#7C7F88]">Try</div>}
             <SidebarItem icon={<Download size={isCollapsed ? 18 : 16} />} label="Import issues" href="/dashboard/import" collapsed={isCollapsed} />
             <SidebarItem icon={<Plus size={isCollapsed ? 18 : 16} />} label="Invite people" href="/dashboard/invite" collapsed={isCollapsed} />
         </div>
      </div>
      
       {/* Footer */}
       <div className={`h-10 border-t border-[#2A2D35] flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-4 gap-2'} w-full mt-2 text-[#7C7F88] hover:text-[#E3E4E6] cursor-pointer`} onClick={toggleSidebar}>
           <PanelLeft size={18} />
           {!isCollapsed && <span>Collapse Sidebar</span>}
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
