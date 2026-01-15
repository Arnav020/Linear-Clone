'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type FilterType = 'all' | 'active' | 'backlog';

interface ViewFilterContextType {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
}

const ViewFilterContext = createContext<ViewFilterContextType | undefined>(undefined);

export function ViewFilterProvider({ children }: { children: ReactNode }) {
  const [filter, setFilter] = useState<FilterType>('all');

  return (
    <ViewFilterContext.Provider value={{ filter, setFilter }}>
      {children}
    </ViewFilterContext.Provider>
  );
}

export function useViewFilter() {
  const context = useContext(ViewFilterContext);
  if (context === undefined) {
    throw new Error('useViewFilter must be used within a ViewFilterProvider');
  }
  return context;
}
