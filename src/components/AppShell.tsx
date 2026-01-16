'use client';

import { useUser } from '@/context/UserContext';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { Loader2 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useUI } from '@/context/UIContext';
import CommandMenu from './CommandMenu';
import NewIssueModal from './NewIssueModal';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useUser();
  const { isNewIssueModalOpen, setNewIssueModalOpen } = useUI();
  const pathname = usePathname();

  // Public routes that don't need the app shell
  const isPublicRoute = pathname === '/' || pathname === '/login';

  if (isPublicRoute) {
      return <main className="h-screen w-full bg-[#0B0D10] overflow-y-auto custom-scrollbar">{children}</main>;
  }

  // Show nothing or a sophisticated loader while checking auth state
  if (isLoading) {
    return (
      <div className="h-screen w-full bg-[#0B0D10] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#5E6AD2]" size={24} />
      </div>
    );
  }

  // If not logged in and trying to access protected route, render children (which will likely redirect)
  // or we could redirect here. But pages usually handle it. 
  // actually existing logic was: if !user return main children.
  if (!user) {
    return <main className="h-screen w-full bg-[#0B0D10]">{children}</main>;
  }

  // If logged in, render the full app shell
  return (
    <div className="flex h-screen w-full bg-[#0B0D10] text-[#E3E4E6] font-sans overflow-hidden selection:bg-[#5E6AD2]/30">
      <Sidebar />
      <div className="flex flex-col flex-1 h-full min-w-0">
        <Topbar />
        <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-[#2A2D35] scrollbar-track-transparent">
          {children}
        </main>
      </div>

      {/* Global Overlays */}
      <CommandMenu />
      <NewIssueModal 
        isOpen={isNewIssueModalOpen} 
        onClose={() => setNewIssueModalOpen(false)} 
      />
    </div>
  );
}
