import React from 'react';
import { ArrowLeft, Heart } from 'lucide-react';

const HymnDetail = ({ hymn, onBack, isFavorite, onToggleFavorite }) => {
  const formatDetails = (details) => {
    if (!details) return '';
    return details
      .split('\r\n')
      .map((line, index) => (
        <React.Fragment key={index}>
          {line.startsWith('\t') ? <span className="ml-4">{line.substring(1)}</span> : line}
          <br />
        </React.Fragment>
      ));
  };

  if (!hymn) {
    return (
        <div className="p-4 md:p-6 bg-white dark:bg-slate-800 rounded-lg shadow-xl text-center">
            <p className="text-slate-600 dark:text-slate-400">Mifidiana hira azafady.</p>
             <button
                onClick={onBack}
                className="mt-4 inline-flex items-center px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors duration-200"
            >
                <ArrowLeft size={20} className="mr-2" /> Miverina
            </button>
        </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-white dark:bg-slate-800 rounded-lg shadow-xl h-full overflow-y-auto">
      <div className="flex justify-between items-start mb-6">
        <button
          onClick={onBack}
          className="flex items-center px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors duration-200"
        >
          <ArrowLeft size={20} className="mr-2" /> Miverina
        </button>
        <button 
          onClick={() => onToggleFavorite(hymn.Id_)} 
          className={`p-2 rounded-full ${isFavorite ? 'text-red-500 bg-red-100 dark:text-red-400 dark:bg-red-900' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'} transition-colors`}
          aria-label={isFavorite ? "Esory amin'ny ankafizina" : "Ampio amin'ny ankafizina"}
        >
          <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>
      <h2 className="text-3xl font-bold text-sky-700 dark:text-sky-400 mb-3">{hymn.num}. {hymn.Titre}</h2>
      <div className="space-y-2 mb-6 text-slate-700 dark:text-slate-300">
        <p><strong className="font-semibold">Mpamorona:</strong> {hymn.Compositeur || 'Tsy fantatra'}</p>
        <p><strong className="font-semibold">Mpanoratra:</strong> {hymn.Auteur || 'Tsy fantatra'}</p>
        <p><strong className="font-semibold">Tonalite:</strong> {hymn.Tonalite || 'Tsy voalaza'}</p>
        {hymn.Theme1 && <p><strong className="font-semibold">Lohahevitra:</strong> {hymn.Theme1}{hymn.Theme2 ? ` - ${hymn.Theme2}` : ''}</p>}
      </div>
      <div className="prose prose-sm sm:prose dark:prose-invert max-w-none leading-relaxed whitespace-pre-line">
        {formatDetails(hymn.detaille)}
      </div>
    </div>
  );
};

export default HymnDetail;
