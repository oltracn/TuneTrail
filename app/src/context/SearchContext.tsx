import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the structure of a result item (should match HomeScreen and backend)
interface ResultItem {
  mention: string;
  youtubeTitle: string;
  youtubeMusicLink: string | null;
  spotifyTitle: string;
  spotifyArtist: string | null;
  spotifyLink: string | null;
  errorDetails?: string;
}

// Define the shape of the context data
interface SearchContextType {
  isLoading: boolean;
  results: ResultItem[];
  setIsLoading: (loading: boolean) => void;
  setResults: (results: ResultItem[]) => void;
  clearResults: () => void; // Add a function to clear results
}

// Create the context with a default value (can be null or an object with default functions)
const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Create a provider component
interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<ResultItem[]>([]);

  const handleSetLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const handleSetResults = (newResults: ResultItem[]) => {
    setResults(newResults);
  };

  const handleClearResults = () => {
    setResults([]);
  }

  const value = {
    isLoading,
    results,
    setIsLoading: handleSetLoading,
    setResults: handleSetResults,
    clearResults: handleClearResults,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

// Create a custom hook for easy context consumption
export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
