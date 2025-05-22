import React from 'react';
import { BookOpen, Heart } from 'lucide-react';

const HymnListItem = ({ hymn, onSelect, isFavorite, onToggleFavorite }) => (
  <li
    key={hymn.Id_}
    className="p-4 mb-3 bg-white dark:bg-slate-700 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex justify-between items-center"
  >
    <div className="cursor-pointer flex-grow mr-2" onClick={() => onSelect(hymn)}>
      <h3 className="text-lg font-semibold text-sky-700 dark:text-sky-400">{hymn.num}. {hymn.Titre}</h3>
      {hymn.Theme1 && <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Lohahevitra: {hymn.Theme1}{hymn.Theme2 ? ` - ${hymn.Theme2}` : ''}</p>}
      {hymn.Auteur && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Mpanoratra: {hymn.Auteur}</p>}
    </div>
    <button 
      onClick={(e) => { e.stopPropagation(); onToggleFavorite(hymn.Id_); }} 
      className={`p-2 rounded-full ${isFavorite ? 'text-red-500 dark:text-red-400' : 'text-slate-400 dark:text-slate-500'} hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors`}
      aria-label={isFavorite ? "Esory amin'ny ankafizina" : "Ampio amin'ny ankafizina"}
    >
      <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
    </button>
  </li>
);

export default HymnListItem;
