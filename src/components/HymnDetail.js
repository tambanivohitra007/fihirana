import React from 'react';
import { ArrowLeft, Heart } from 'lucide-react';
import colors from '../colors';

const HymnDetail = ({ hymn, onBack, isFavorite, onToggleFavorite, isDarkMode }) => {
  console.log('[HymnDetail.js] Rendering. Received hymn prop:', hymn); 

  const formatDetails = (details) => {
    console.log('[HymnDetail.js] formatDetails ORIGINAL LOGIC called. Details type:', typeof details, 'Length:', (details && details.length));

    if (typeof details !== 'string' || !details.trim()) {
      console.log('[HymnDetail.js] formatDetails: details is not a valid string or is empty/whitespace. Value:', details);
      // Ensure the escape sequence for the apostrophe is correct for JavaScript strings
      return <p style={{ color: isDarkMode ? colors.darkCardMuted : colors.cardMuted }}><em>Tsy misy tononkira ho an\\'ity hira ity.</em></p>;
    }

    console.log('[HymnDetail.js] formatDetails: Processing details string.');
    // Assuming hymn.detaille uses actual newline and tab characters
    const lines = details.split(/\r\n|\r|\n/); // Corrected JS: uses actual CR/LF
    console.log(`[HymnDetail.js] formatDetails: Split into ${lines.length} lines. First few lines:`, lines.slice(0, 5));

    return lines.map((line, index, arr) => {
      const isIndented = line.startsWith('\t'); // Corrected JS: uses actual TAB char
      let lineContent = line;
      if (isIndented) {
        lineContent = line.substring(1); // Correct for removing a single tab character
      }
      
      console.log(`[HymnDetail.js] formatDetails map [${index}]: rawLine="${line}", isIndented=${isIndented}, processedLineContent="${lineContent}"`);
      
      // Special styling for "Refrain:" or "Chorus:" type lines (case-insensitive)
      // And also for "Tonony X:" (e.g., "Tonony 1:")
      const trimmedLineContent = lineContent.trim();
      let specialStyle = {};
      if (/^(refrain|chorus|fiverenana|tontonana|andininy|verse|tonony\\s*\\d*):?/i.test(trimmedLineContent)) {
        specialStyle = { fontWeight: 'bold', fontStyle: 'italic', marginTop: '0.5em', marginBottom: '0.25em' };
        console.log(`[HymnDetail.js] formatDetails map [${index}]: Applying special style for structural line: "${trimmedLineContent}"`);
      }

      return (
        <React.Fragment key={index}>
          {isIndented ? 
            <span className="ml-4" style={specialStyle}>{lineContent}</span> : 
            (Object.keys(specialStyle).length > 0 ? <div style={specialStyle}>{lineContent}</div> : lineContent)
          }
          {index < arr.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  if (!hymn) {
    console.log('[HymnDetail.js] Condition !hymn is TRUE. Rendering "Mifidiana hira azafady."');
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
      <h1 className="text-2xl mb-2" style={{ color: isDarkMode ? colors.darkCardTitle : colors.cardTitle }}>{hymn.num} - {hymn.Titre}</h1>
      {hymn.Auteur && (
        <div className="text-sm mb-1" style={{ color: isDarkMode ? colors.darkCardSubtitle : colors.cardSubtitle }}>
          <strong>Auteur:</strong> {hymn.Auteur}
        </div>
      )}
      {hymn.Compositeur && (
        <div className="text-sm mb-1" style={{ color: isDarkMode ? colors.darkCardSubtitle : colors.cardSubtitle }}>
          <strong>Compositeur:</strong> {hymn.Compositeur}
        </div>
      )}
      {hymn.Tonalite && (
        <div className="text-sm mb-1" style={{ color: isDarkMode ? colors.darkCardSubtitle : colors.cardSubtitle }}>
          <strong>Tonalité:</strong> {hymn.Tonalite}
        </div>
      )}
      {hymn.Theme1 && (
        <div className="text-xs" style={{ color: isDarkMode ? colors.darkCardMuted : colors.cardMuted }}>
          <strong>Thème:</strong> {hymn.Theme1}
        </div>
      )}
      <div 
        className="text-base whitespace-pre-line" 
        style={{ 
          color: isDarkMode ? colors.darkCardTitle : colors.cardTitle, 
          fontFamily: 'inherit', 
          lineHeight: '1.6'
          // Removed temporary border, padding, and margin
        }}
      >
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
