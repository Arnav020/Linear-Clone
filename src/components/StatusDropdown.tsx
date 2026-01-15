import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { StatusIcon, getStatusColor } from './StatusIcon';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface StatusDropdownProps {
  issueId: string;
  currentStatus: string;
  className?: string;
  onStatusChange?: (newStatus: string) => void;
}

const ALL_STATUSES = [
    { label: 'Backlog', value: 'Backlog', shortcut: '1' },
    { label: 'Todo', value: 'Todo', shortcut: '2' },
    { label: 'In Progress', value: 'In Progress', shortcut: '3' },
    { label: 'Done', value: 'Done', shortcut: '4' },
    { label: 'Canceled', value: 'Canceled', shortcut: '5' },
    { label: 'Duplicate', value: 'Duplicate', shortcut: '6' },
];

export default function StatusDropdown({ issueId, currentStatus, className = "", onStatusChange }: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Sync internal state if prop changes (e.g. from real-time or parent refresh)
  useEffect(() => {
    setStatus(currentStatus);
  }, [currentStatus]);

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

  const updateStatus = async (newStatus: string) => {
    if (newStatus === status) {
        setIsOpen(false);
        return;
    }
    
    // Optimistic update
    const oldStatus = status;
    setStatus(newStatus);
    setIsOpen(false);
    if (onStatusChange) onStatusChange(newStatus);
    
    setIsUpdating(true);
    const supabase = createClient();
    const { error } = await supabase
        .from('issues')
        .update({ status: newStatus })
        .eq('id', issueId);

    if (error) {
        console.error('Error updating status:', error);
        // Revert if error
        setStatus(oldStatus);
        if (onStatusChange) onStatusChange(oldStatus);
    } else {
        router.refresh();
    }
    setIsUpdating(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    
    // Number shortcuts
    const num = parseInt(e.key);
    if (num >= 1 && num <= 6) {
        e.preventDefault();
        const target = ALL_STATUSES.find(s => s.shortcut === e.key);
        if (target) updateStatus(target.value);
    }

    if (e.key === 'Escape') {
        setIsOpen(false);
        e.stopPropagation(); // Prevent deselecting parent
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div 
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        className="cursor-pointer rounded-sm hover:bg-[#2A2D35] p-0.5 inline-flex items-center justify-center transition-colors relative z-10"
      >
        <StatusIcon status={status} />
      </div>

      {isOpen && (
        <div 
            className="absolute top-6 left-0 z-[60] w-[180px] bg-[#1C1E22] border border-[#2A2D35] rounded-lg shadow-xl py-1 animate-in fade-in zoom-in-95 duration-100"
            onKeyDown={handleKeyDown}
            tabIndex={0} // Make focusable for keyboard events to bubble here
            autoFocus // Auto focus when opened
        >
          <div className="px-2 py-1 text-[10px] uppercase font-semibold text-[#7C7F88] tracking-wider">
            Change Status...
          </div>
          {ALL_STATUSES.map((option) => (
            <div
              key={option.value}
              onClick={(e) => { e.stopPropagation(); updateStatus(option.value); }}
              className="flex items-center gap-2 px-2 py-1.5 mx-1 rounded text-xs text-[#E3E4E6] hover:bg-[#5E6AD2] cursor-pointer group transition-colors"
            >
              <div className="shrink-0 flex items-center justify-center w-4">
                  <StatusIcon status={option.value} size={14} className="group-hover:text-white" />
              </div>
              <span className="flex-1 text-sm font-medium">{option.label}</span>
              {status === option.value && <Check size={12} className="text-[#E3E4E6] group-hover:text-white" />}
              <span className="text-[10px] text-[#7C7F88] bg-[#2A2D35] px-1 rounded min-w-[16px] text-center group-hover:bg-[#4C55AA] group-hover:text-white transition-colors">
                {option.shortcut}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
