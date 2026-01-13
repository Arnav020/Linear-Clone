import Link from 'next/link';
import { Home, CheckCircle2, Layers, Settings, User } from 'lucide-react';
import React from 'react';

const Sidebar = () => {
  return (
    <aside className="w-[80px] h-screen bg-[#1a1c20] text-gray-400 flex flex-col items-center py-6 border-r border-[#2a2c30]">
      <div className="mb-8">
        {/* Placeholder for workspace logo or user */}
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
          L
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-6 w-full items-center">
        <SidebarItem icon={<Home size={20} />} label="Home" href="/" active />
        <SidebarItem icon={<CheckCircle2 size={20} />} label="Issues" href="/issues" />
        <SidebarItem icon={<Layers size={20} />} label="Projects" href="/projects" />
      </nav>

      <div className="mt-auto">
        <SidebarItem icon={<Settings size={20} />} label="Settings" href="/settings" />
      </div>
    </aside>
  );
};

const SidebarItem = ({ icon, label, href, active }: { icon: React.ReactNode, label: string, href: string, active?: boolean }) => {
  return (
    <Link 
      href={href}
      className={`p-3 rounded-lg transition-colors hover:bg-white/5 ${active ? 'text-gray-100 bg-white/5' : 'hover:text-gray-200'}`}
      title={label}
    >
      {icon}
    </Link>
  );
};

export default Sidebar;
