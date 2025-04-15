import React, { createContext, useState, useContext } from 'react';

// 定义搜索结果的类型
export type SearchResult = {
  title: string;
  artist: string;
  url: string;
  platform: string;
};

// 定义上下文的类型
type SearchContextType = {
  url: string;
  setUrl: (url: string) => void;
  results: SearchResult[];
  setResults: (results: SearchResult[]) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  clearResults: () => void; // Add clearResults function type
};

// 创建上下文
const SearchContext = createContext<SearchContextType | undefined>(undefined);

// 创建提供者组件
export const SearchProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [url, setUrl] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Define the clearResults function
  const clearResults = () => {
    setResults([]);
    setError(null); // Also clear errors when clearing results
  };

  return (
    <SearchContext.Provider
      value={{
        url,
        setUrl,
        results,
        setResults,
        isLoading,
        setIsLoading,
        error,
        setError,
        clearResults, // Add clearResults to the context value
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

// 创建自定义钩子以便于使用上下文
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
