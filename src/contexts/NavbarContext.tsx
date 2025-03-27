"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface NavbarContextType {
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: (query: string) => void;
  setOnSearch: (callback: (query: string) => void) => void;
}

const NavbarContext = createContext<NavbarContextType>({
  showSearch: false,
  setShowSearch: () => {},
  searchQuery: '',
  setSearchQuery: () => {},
  onSearch: () => {},
  setOnSearch: () => {},
});

export function NavbarProvider({ children }: { children: ReactNode }) {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [onSearch, setOnSearch] = useState<(query: string) => void>(() => () => {});

  return (
    <NavbarContext.Provider value={{
      showSearch,
      setShowSearch,
      searchQuery,
      setSearchQuery,
      onSearch,
      setOnSearch,
    }}>
      {children}
    </NavbarContext.Provider>
  );
}

export const useNavbarContext = () => useContext(NavbarContext); 