'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface UIContextType {
  isCommandMenuOpen: boolean;
  setCommandMenuOpen: (open: boolean) => void;
  toggleCommandMenu: () => void;
  isNewIssueModalOpen: boolean;
  setNewIssueModalOpen: (open: boolean) => void;
  openNewIssueModal: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [isCommandMenuOpen, setCommandMenuOpen] = useState(false);
  const [isNewIssueModalOpen, setNewIssueModalOpen] = useState(false);

  const toggleCommandMenu = useCallback(() => setCommandMenuOpen(prev => !prev), []);
  const openNewIssueModal = useCallback(() => setNewIssueModalOpen(true), []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if input is active
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.getAttribute('contenteditable') === 'true'
      ) {
        return;
      }

      // Command + K: Toggle Command Menu
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleCommandMenu();
      }

      // "C": Create Issue (Only if command menu is NOT open)
      if (e.key.toLowerCase() === 'c' && !isCommandMenuOpen) {
        e.preventDefault();
        openNewIssueModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleCommandMenu, openNewIssueModal, isCommandMenuOpen]);

  return (
    <UIContext.Provider value={{
      isCommandMenuOpen,
      setCommandMenuOpen,
      toggleCommandMenu,
      isNewIssueModalOpen,
      setNewIssueModalOpen,
      openNewIssueModal
    }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}
