import React from 'react';
import { ArrowLeft } from 'lucide-react';

const SelectionListPage = ({ title, items, onSelectItem, onBack }) => (
  <div className="p-4 md:p-6 bg-white dark:bg-slate-800 rounded-lg shadow-xl">
    <button
        onClick={onBack}
        className="mb-6 flex items-center px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors duration-200"
      >
        <ArrowLeft size={20} className="mr-2" /> Miverina
      </button>
    <h2 className="text-2xl font-bold text-sky-700 dark:text-sky-400 mb-4">{title}</h2>
    {items.length > 0 ? (
      <ul className="space-y-2">
        {items.map(item => (
          <li 
            key={item} 
            onClick={() => onSelectItem(item)}
            className="p-3 bg-slate-50 dark:bg-slate-700 rounded-md hover:bg-sky-100 dark:hover:bg-slate-600 cursor-pointer transition-colors"
          >
            {item}
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-slate-600 dark:text-slate-400">Tsy misy azo isafidianana.</p>
    )}
  </div>
);

export default SelectionListPage;
