'use client';

import { Command } from 'cmdk';
import { useUI } from '@/context/UIContext';
import { useUser } from '@/context/UserContext';
import { useViewFilter } from '@/context/ViewFilterContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Calculator, 
  Calendar, 
  CreditCard, 
  Settings, 
  Smile, 
  User, 
  Search,
  Plus,
  Layout,
  List,
  Kanban,
  LogOut,
  Filter,
  Grid
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CommandMenu() {
  const { isCommandMenuOpen, setCommandMenuOpen, openNewIssueModal } = useUI();
  const { logout } = useUser();
  const { setFilter } = useViewFilter();
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('project');

  const navigate = (path: string, params: Record<string, string> = {}) => {
      const urlParams = new URLSearchParams();
      if (projectId) urlParams.set('project', projectId);
      Object.entries(params).forEach(([k, v]) => urlParams.set(k, v));
      router.push(`${path}?${urlParams.toString()}`);
  };



  const runCommand = (command: () => void) => {
    setCommandMenuOpen(false);
    command();
  };

  if (!isCommandMenuOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[15vh]">
       <div 
        className="w-full max-w-[640px] shadow-2xl rounded-xl overflow-hidden border border-[#2A2D35] bg-[#16181D] animate-in fade-in zoom-in-95 duration-100"
        onClick={(e) => e.stopPropagation()}
       >
        <Command 
            className="w-full bg-transparent"
            loop
        >
          <div className="flex items-center px-4 border-b border-[#2A2D35]">
            <Search className="w-4 h-4 text-[#7C7F88] mr-2" />
            <Command.Input 
                autoFocus
                placeholder="Type a command or search..." 
                className="w-full h-12 bg-transparent text-[#E3E4E6] placeholder:text-[#575A61] focus:outline-none text-sm font-medium"
            />
            <div className="flex items-center gap-1">
                 <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-[#2A2D35] bg-[#1C1E22] px-1.5 font-mono text-[10px] font-medium text-[#7C7F88] opacity-100">
                    <span className="text-xs">ESC</span>
                </kbd>
            </div>
          </div>
          
          <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2 scrollbar-thin scrollbar-thumb-[#2A2D35] scrollbar-track-transparent">
            <Command.Empty className="py-6 text-center text-sm text-[#7C7F88]">
                No results found.
            </Command.Empty>

            <Command.Group heading="Actions" className="text-[#575A61] text-[10px] font-medium uppercase tracking-wider mb-2 px-2">
              <CommandItem 
                onSelect={() => runCommand(() => openNewIssueModal())}
                icon={<Plus size={14} />}
                shortcut="C"
              >
                Create new issue
              </CommandItem>
            </Command.Group>

            <Command.Group heading="Navigation" className="text-[#575A61] text-[10px] font-medium uppercase tracking-wider mb-2 px-2">
              <CommandItem 
                onSelect={() => runCommand(() => router.push('/dashboard'))}
                icon={<Grid size={14} />}
              >
                Go to Projects
              </CommandItem>
              <CommandItem 
                onSelect={() => runCommand(() => navigate('/dashboard', { view: 'list' }))}
                icon={<List size={14} />}
              >
                Switch to List View
              </CommandItem>
              <CommandItem 
                onSelect={() => runCommand(() => navigate('/dashboard', { view: 'board' }))}
                icon={<Kanban size={14} />}
              >
                Switch to Board View
              </CommandItem>
            </Command.Group>

             <Command.Group heading="View" className="text-[#575A61] text-[10px] font-medium uppercase tracking-wider mb-2 px-2">
                <CommandItem 
                    onSelect={() => runCommand(() => setFilter('active'))}
                    icon={<Filter size={14} />}
                >
                    Show Active Issues
                </CommandItem>
             </Command.Group>

             <Command.Group heading="Account" className="text-[#575A61] text-[10px] font-medium uppercase tracking-wider mb-2 px-2">
                <CommandItem 
                    onSelect={() => runCommand(() => logout())}
                    icon={<LogOut size={14} />}
                >
                    Log Out
                </CommandItem>
             </Command.Group>
             
          </Command.List>
        </Command>

        {/* Backdrop close handler */}
        <div 
             className="fixed inset-0 -z-10" 
             onClick={() => setCommandMenuOpen(false)}
        />
       </div>
    </div>
  );
}

function CommandItem({ children, icon, shortcut, onSelect }: { children: React.ReactNode, icon?: React.ReactNode, shortcut?: string, onSelect: () => void }) {
    return (
        <Command.Item
            onSelect={onSelect}
            className="group flex items-center h-10 px-2 rounded-md text-sm text-[#E3E4E6] aria-selected:bg-[#5E6AD2] aria-selected:text-white cursor-pointer transition-colors mb-0.5"
        >
            <div className="mr-3 text-[#7C7F88] group-aria-selected:text-white/70">
                {icon}
            </div>
            <span className="flex-1 truncate">{children}</span>
            {shortcut && (
                <span className="ml-auto text-xs text-[#575A61] group-aria-selected:text-white/60 font-mono">
                    {shortcut}
                </span>
            )}
        </Command.Item>
    );
}
