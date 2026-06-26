'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  defaultValue?: string;
  onSearch: (query: string) => void;
}

export function SearchBar({ placeholder = 'Search posts...', defaultValue = '', onSearch }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="input-field pl-10 pr-10"
      />
      {query && (
        <button
          type="button"
          onClick={() => { setQuery(''); onSearch(''); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </form>
  );
}
