'use client';

import { useIssueSelection } from '@/context/IssueSelectionContext';
import { X, User, Circle, ArrowRight, Trash2, Calendar, Tag, ShieldAlert, CheckCircle2, XCircle, SignalHigh, SignalMedium, SignalLow, MoreHorizontal } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';

export default function BulkActionsMenu() {
  const { selectedIssueIds, clearSelection, isSelectionMode } = useIssueSelection();
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const [activeMenu, setActiveMenu] = useState<'status' | 'priority' | 'assignee' | 'label' | null>(null);

  if (!isSelectionMode) return null;

  const count = selectedIssueIds.size;

  const handleUpdate = async (updateData: any) => {
    setIsUpdating(true);
    const supabase = createClient();
    const ids = Array.from(selectedIssueIds);
    
    // Check for label issue
    if (updateData.labels) {
       // We can't easily check schema here without failing, but we can try/catch wrapper logic or just proceed.
       // The supabase call will return error.
    }

    const { error } = await supabase
        .from('issues')
        .update(updateData)
        .in('id', ids);

    if (error) {
        console.error('Error updating issues:', error);
        if (error.message?.includes('column "labels" does not exist') || error.code === '42703') {
            alert('Missing "labels" column in database. Please run: ALTER TABLE public.issues ADD COLUMN labels text[] DEFAULT \'{}\';');
        } else {
            alert('Failed to update issues');
        }
    } else {
        clearSelection();
        router.refresh();
        setActiveMenu(null);
    }
    setIsUpdating(false);
  };

  const menuItems = {
      assignee: [
          { label: 'Arnav Joshi', value: 'Arnav Joshi', icon: <div className="w-4 h-4 rounded-full bg-blue-500 text-[8px] flex items-center justify-center text-white">AJ</div> },
          { label: 'Unassigned', value: null, icon: <User size={14} /> }
      ],
      status: [
          { label: 'Backlog', value: 'Backlog', icon: <Circle size={14} className="text-gray-400 border-dotted" /> },
          { label: 'Todo', value: 'Todo', icon: <Circle size={14} className="text-gray-400" /> },
          { label: 'In Progress', value: 'In Progress', icon: <Circle size={14} className="text-yellow-500" /> },
          { label: 'Done', value: 'Done', icon: <CheckCircle2 size={14} className="text-blue-500" /> },
          { label: 'Canceled', value: 'Canceled', icon: <XCircle size={14} className="text-gray-500" /> },
      ],
      priority: [
         { label: 'Urgent', value: 'Urgent', icon: <ShieldAlert size={14} className="text-red-500" /> },
         { label: 'High', value: 'High', icon: <SignalHigh size={14} className="text-orange-500" /> },
         { label: 'Medium', value: 'Medium', icon: <SignalMedium size={14} className="text-yellow-500" /> },
         { label: 'Low', value: 'Low', icon: <SignalLow size={14} className="text-gray-500" /> },
         { label: 'None', value: 'None', icon: <MoreHorizontal size={14} className="text-gray-500" /> },
      ],
      label: [
          { label: 'Bug', value: 'Bug', icon: <Tag size={14} className="text-red-400" /> },
          { label: 'Feature', value: 'Feature', icon: <Tag size={14} className="text-blue-400" /> },
          { label: 'Improvement', value: 'Improvement', icon: <Tag size={14} className="text-green-400" /> },
      ]
  };

  const renderMenu = () => {
      if (!activeMenu) return null;
      
      const items = menuItems[activeMenu];
      
      return (
          <>
          <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(null)} />
          <div className="absolute bottom-full mb-2 left-0 bg-[#1e2024] border border-[#2A2D35] rounded-lg shadow-xl py-1 w-48 z-50 animate-in fade-in zoom-in-95 duration-100 flex flex-col">
              {items.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                        let update = {};
                        if (activeMenu === 'assignee') update = { assignee_name: item.value };
                        if (activeMenu === 'status') update = { status: item.value };
                        if (activeMenu === 'priority') update = { priority: item.value };
                        if (activeMenu === 'label') {
                             // For bulk label, we might want to append or replace. 
                             // Linear usually appends or toggles mixed state.
                             // For simplicity: Replace labels with this one (single label mode) or Add?
                             // User asked for "choosable format".
                             // Let's assume ADDing a label for now, or setting the list to just this one? 
                             // Setting labels to [value] is safest for bulk "Apply Label".
                             update = { labels: [item.value] }; 
                        }
                        handleUpdate(update);
                    }}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-[#2A2D35] text-left text-xs text-[#E3E4E6]"
                  >
                      <span className="shrink-0 w-5 flex items-center justify-center">{item.icon}</span>
                      <span>{item.label}</span>
                  </button>
              ))}
          </div>
          </>
      );
  };

  const actions = [
      { 
          id: 'assignee',
          label: 'Assign', 
          icon: <User size={14} />, 
          shortcut: 'A', 
      },
      { 
        id: 'status',
        label: 'Status', 
        icon: <Circle size={14} />, 
        shortcut: 'S', 
      },
      { 
        id: 'priority',
        label: 'Priority', 
        icon: <ShieldAlert size={14} />, 
        shortcut: 'P', 
      },
      { 
        id: 'label',
        label: 'Label', 
        icon: <Tag size={14} />, 
        shortcut: 'L', 
      },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="bg-[#1C1E22] border border-[#2A2D35] rounded-lg shadow-2xl flex items-center p-1 gap-1 relative">
        <div className="flex items-center gap-3 pl-3 pr-2 border-r border-[#2A2D35]">
            <div className="flex items-center justify-center bg-[#5E6AD2] text-white text-xs font-bold w-5 h-5 rounded-sm">
                {count}
            </div>
            <span className="text-sm font-medium text-[#E3E4E6]">Selected</span>
            <button onClick={clearSelection} className="ml-1 p-1 hover:bg-[#2A2D35] rounded text-[#7C7F88] hover:text-[#E3E4E6]">
                <X size={14} />
            </button>
        </div>

        <div className="flex items-center gap-0.5 relative">
            {actions.map((action) => (
                <div key={action.id} className="relative">
                    <button 
                        onClick={() => setActiveMenu(activeMenu === action.id ? null : action.id as any)}
                        disabled={isUpdating}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-[#2A2D35] text-[#E3E4E6] text-xs font-medium transition-colors disabled:opacity-50 ${activeMenu === action.id ? 'bg-[#2A2D35]' : ''}`}
                        title={action.label}
                    >
                        <span className="text-[#7C7F88] group-hover:text-[#E3E4E6]">{action.icon}</span>
                        <span>{action.label}</span>
                        <span className="ml-1 text-[10px] text-[#575a61]">{action.shortcut}</span>
                    </button>
                     {/* Render menu relative to the active button if we wanted specific positioning, 
                         but simplified to rendering one menu for the bar is easier. 
                         Let's render the specific menu INSIDE this mapped div if valid? 
                         No, css positioning might be tricky. 
                         Let's render it outside or just absolute to the parent bar.
                      */}
                     {activeMenu === action.id && renderMenu()}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
