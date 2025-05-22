import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearchChange, searchTerm }) => {
  return (
    <div className="p-4 bg-sky-100 dark:bg-slate-700 rounded-lg shadow mb-6">
      <div className="relative flex-grow w-full">
        <input
          type="text"
          placeholder="Karohy hira (laharana na lohateny)..."
          className="w-full p-3 pl-10 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-slate-800 dark:text-white transition-colors"
          value={searchTerm}
          onChange={onSearchChange}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
      </div>
    </div>
  );
};

export default SearchBar;
