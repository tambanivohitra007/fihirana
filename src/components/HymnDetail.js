import React from 'react';
import { ArrowLeft, Heart } from 'lucide-react';
import colors from '../colors';

const HymnDetail = ({ hymn, onBack, isFavorite, onToggleFavorite, isDarkMode }) => {
  const formatDetails = (details) => {
    if (typeof details !== 'string' || !details.trim()) {
      return <p style={{ color: isDarkMode ? colors.darkCardMuted : colors.cardMuted }}><em>Tsy misy tononkira ho an'ity hira ity.</em></p>;
    }
    return details
      .split(/\r\n|\r|\n/) // More robust newline splitting
      .map((line, index, arr) => (
        <React.Fragment key={index}>
          {line.startsWith('\t') ? <span className="ml-4">{line.substring(1)}</span> : line}
          {index < arr.length - 1 && <br />} {/* Add <br /> only if not the last line */}
        </React.Fragment>
      ));
  };

  if (!hymn) {
    return (
        <div className="p-4 md:p-6 rounded-lg shadow-xl text-center" 
             style={{ 
               background: isDarkMode ? colors.darkCard : colors.cardBg, 
               borderColor: isDarkMode ? colors.darkCardBorder : colors.cardBorder,
               borderWidth: '1px', // Ensure border is visible
               borderStyle: 'solid'
             }}>
            <p style={{ color: isDarkMode ? colors.darkCardSubtitle : colors.cardSubtitle }}>Mifidiana hira azafady.</p>
             <button
                onClick={onBack}
                className="mt-4 inline-flex items-center px-4 py-2 rounded-lg transition-colors duration-200"
                style={{
                  background: isDarkMode ? colors.darkButtonPrimaryBg : colors.buttonPrimaryBg,
                  color: isDarkMode ? colors.darkButtonPrimaryText : colors.buttonPrimaryText,
                  ':hover': {
                    background: isDarkMode ? colors.darkButtonPrimaryHoverBg : colors.buttonPrimaryHoverBg,
                  }
                }}
            >
                <ArrowLeft size={20} className="mr-2" /> Miverina
            </button>
        </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 rounded-xl" 
         style={{ 
           background: isDarkMode ? colors.darkCard : colors.cardBg, 
           boxShadow: isDarkMode ? colors.darkCardShadow : colors.cardShadow, 
           border: `1px solid ${isDarkMode ? colors.darkCardBorder : colors.cardBorder}` 
         }}>
      <div className="flex justify-between items-start mb-6">
        <button
          onClick={onBack}
          className="flex items-center px-4 py-2 rounded-lg transition-colors duration-200"
          style={{
            background: isDarkMode ? colors.darkButtonPrimaryBg : colors.buttonPrimaryBg,
            color: isDarkMode ? colors.darkButtonPrimaryText : colors.buttonPrimaryText,
            ':hover': {
              background: isDarkMode ? colors.darkButtonPrimaryHoverBg : colors.buttonPrimaryHoverBg,
            }
          }}
        >
          <ArrowLeft size={20} className="mr-2" /> Miverina
        </button>
        <button 
          onClick={() => onToggleFavorite(hymn.Id_)} 
          className={`p-2 rounded-full transition-colors ${isFavorite ? 'text-red-500 bg-red-100 dark:text-red-400 dark:bg-red-900' : ''}`}
          style={!isFavorite ? {
            color: isDarkMode ? colors.darkIconColor : colors.iconColor,
            ':hover': {
              background: isDarkMode ? colors.darkIconHoverBg : colors.iconHoverBg,
            }
          } : {}}
          aria-label={isFavorite ? "Esory amin'ny ankafizina" : "Ampio amin'ny ankafizina"}
        >
          <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>
      <h2 className="text-2xl mb-2" style={{ color: isDarkMode ? colors.darkCardTitle : colors.cardTitle }}>{hymn.Titre}</h2>
      <div className="mb-2 text-sm" style={{ color: isDarkMode ? colors.darkCardSubtitle : colors.cardSubtitle }}>{hymn.Auteur}</div>
      <div className="mb-4 text-xs" style={{ color: isDarkMode ? colors.darkCardMuted : colors.cardMuted }}>{hymn.Theme1}</div>
      
      <div className="text-base whitespace-pre-line" style={{ color: isDarkMode ? colors.darkCardTitle : colors.cardTitle, fontFamily: 'inherit', lineHeight: '1.6' }}>
        {formatDetails(hymn.detaille)}
      </div>

      <button 
        onClick={onBack} 
        className="mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors" 
        style={{ 
          background: isDarkMode ? colors.darkButtonSecondaryBg : colors.buttonSecondaryBg, 
          color: isDarkMode ? colors.darkButtonSecondaryText : colors.buttonSecondaryText,
          ':hover': {
            background: isDarkMode ? colors.darkButtonSecondaryHoverBg : colors.buttonSecondaryHoverBg,
          }
        }}
      >
        Miverina
      </button>
      {onToggleFavorite && (
        <button 
          onClick={() => onToggleFavorite(hymn.Id_)} 
          className="ml-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors" 
          style={{ 
            background: isFavorite 
              ? (isDarkMode ? colors.darkButtonPrimaryBg : colors.buttonPrimaryBg) 
              : (isDarkMode ? colors.darkButtonSecondaryBg : colors.buttonSecondaryBg), 
            color: isFavorite 
              ? (isDarkMode ? colors.darkButtonPrimaryText : colors.buttonPrimaryText) 
              : (isDarkMode ? colors.darkButtonSecondaryText : colors.buttonSecondaryText),
            ':hover': {
              background: isFavorite 
                ? (isDarkMode ? colors.darkButtonPrimaryHoverBg : colors.buttonPrimaryHoverBg) 
                : (isDarkMode ? colors.darkButtonSecondaryHoverBg : colors.buttonSecondaryHoverBg),
            }
          }}
        >
          {isFavorite ? 'Esory amin\'ny ankafizina' : 'Ankafizo'}
        </button>
      )}
    </div>
  );
};

export default HymnDetail;
