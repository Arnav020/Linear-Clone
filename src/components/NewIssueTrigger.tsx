'use client';

import { Plus } from 'lucide-react';
import { useUI } from '@/context/UIContext';

interface NewIssueTriggerProps {
  onIssueCreated?: () => void;
}

export default function NewIssueTrigger({ onIssueCreated }: NewIssueTriggerProps) {
  const { openNewIssueModal } = useUI();

  return (
    <button 
      onClick={() => openNewIssueModal()}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#5E6AD2] hover:bg-[#6B76E8] text-white rounded-md text-sm font-medium transition-colors shadow-sm shadow-[#5e6ad2]/20"
    >
      <Plus size={16} />
      New Issue
    </button>
  );
}
