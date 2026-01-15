'use client';

import { LayoutGrid, List, SlidersHorizontal, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface ViewToggleProps {
  currentView: 'list' | 'board';
  onViewChange: (view: 'list' | 'board') => void;
}

export default function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (view: 'list' | 'board') => {
    onViewChange(view);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
        <div 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-[#2A2D35]"
        >
            {currentView === 'board' ? (
                 <LayoutGrid size={14} className="text-[#7C7F88]" />
            ) : (
                 <List size={14} className="text-[#7C7F88]" />
            )}
            <span className="text-xs text-[#7C7F88] capitalize">{currentView}</span>
        </div>

        {isOpen && (
            <div className="absolute top-8 right-0 z-50 w-32 bg-[#1C1E22] border border-[#2A2D35] rounded-lg shadow-xl py-1 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-2 py-1 text-[10px] uppercase font-semibold text-[#7C7F88] tracking-wider mb-1">
                    View Layout
                </div>
                <button 
                    onClick={() => handleSelect('list')}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-[#E3E4E6] hover:bg-[#5E6AD2] group transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <List size={14} className="text-[#7C7F88] group-hover:text-white" />
                        <span>List</span>
                    </div>
                    {currentView === 'list' && <Check size={12} className="text-[#E3E4E6] group-hover:text-white" />}
                </button>
                <button 
                    onClick={() => handleSelect('board')}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-[#E3E4E6] hover:bg-[#5E6AD2] group transition-colors"
                >
                    <div className="flex items-center gap-2">
                         <LayoutGrid size={14} className="text-[#7C7F88] group-hover:text-white" />
                        <span>Board</span>
                    </div>
                    {currentView === 'board' && <Check size={12} className="text-[#E3E4E6] group-hover:text-white" />}
                </button>
            </div>
        )}
    </div>
  );
}
