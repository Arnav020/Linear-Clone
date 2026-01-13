import { Search, ChevronDown, Bell } from 'lucide-react';

const Topbar = () => {
  return (
    <header className="h-12 border-b border-[#2a2c30] flex items-center justify-between px-4 bg-[#141518] text-gray-400">
      <div className="flex items-center gap-2 hover:bg-white/5 p-1 px-2 rounded cursor-pointer transition-colors">
        <div className="w-4 h-4 bg-purple-500 rounded text-[10px] flex items-center justify-center text-white">
          T
        </div>
        <span className="text-sm font-medium text-gray-200">Team Linear</span>
        <ChevronDown size={14} />
      </div>

      <div className="flex-1 max-w-xl mx-4">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-gray-400" size={16} />
          <input 
            id="search"
            type="text" 
            placeholder="Search..." 
            className="w-full bg-[#1e2024] border border-transparent focus:border-[#2a2c30] rounded-md py-1.5 pl-9 pr-4 text-sm text-gray-200 placeholder-gray-500 focus:outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="hover:text-gray-200 transition-colors">
          <Bell size={18} />
        </button>
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-blue-500"></div>
      </div>
    </header>
  );
};

export default Topbar;
