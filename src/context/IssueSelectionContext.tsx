'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface IssueSelectionContextType {
  selectedIssueIds: Set<string>;
  toggleSelection: (id: string, multiSelect?: boolean) => void;
  selectIssue: (id: string) => void;
  deselectIssue: (id: string) => void;
  clearSelection: () => void;
  selectAll: (ids: string[]) => void;
  isSelectionMode: boolean;
}

const IssueSelectionContext = createContext<IssueSelectionContextType | undefined>(undefined);

export function IssueSelectionProvider({ children }: { children: ReactNode }) {
  const [selectedIssueIds, setSelectedIssueIds] = useState<Set<string>>(new Set());

  const toggleSelection = useCallback((id: string, multiSelect = true) => {
    setSelectedIssueIds((prev) => {
      const newSet = new Set(multiSelect ? prev : []);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const selectIssue = useCallback((id: string) => {
    setSelectedIssueIds((prev) => new Set(prev).add(id));
  }, []);

  const deselectIssue = useCallback((id: string) => {
    setSelectedIssueIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIssueIds(new Set());
  }, []);

  const selectAll = useCallback((ids: string[]) => {
      setSelectedIssueIds(new Set(ids));
  }, []);

  const isSelectionMode = selectedIssueIds.size > 0;

  return (
    <IssueSelectionContext.Provider
      value={{
        selectedIssueIds,
        toggleSelection,
        selectIssue,
        deselectIssue,
        clearSelection,
        selectAll,
        isSelectionMode,
      }}
    >
      {children}
    </IssueSelectionContext.Provider>
  );
}

export function useIssueSelection() {
  const context = useContext(IssueSelectionContext);
  if (context === undefined) {
    throw new Error('useIssueSelection must be used within an IssueSelectionProvider');
  }
  return context;
}
