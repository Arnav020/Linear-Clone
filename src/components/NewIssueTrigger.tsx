'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import NewIssueModal from './NewIssueModal';

interface NewIssueTriggerProps {
  onIssueCreated?: () => void;
}

export default function NewIssueTrigger({ onIssueCreated }: NewIssueTriggerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.getAttribute('contenteditable') === 'true'
      ) {
        return;
      }

      if (e.key.toLowerCase() === 'c') {
        e.preventDefault();
        setIsModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#5E6AD2] hover:bg-[#6B76E8] text-white rounded-md text-sm font-medium transition-colors shadow-sm shadow-[#5e6ad2]/20"
      >
        <Plus size={16} />
        New Issue
      </button>

      <NewIssueModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onIssueCreated={onIssueCreated}
      />
    </>
  );
}
