import React, { useState, useEffect, useCallback } from 'react'; // Added useEffect and useCallback
import { Heart, ZoomIn, ZoomOut } from 'lucide-react';
import { useSwipeable } from 'react-swipeable'; // Import useSwipeable
import colors from '../colors';

const HymnDetail = ({ hymn, onBack, isFavorite, onToggleFavorite, isDarkMode, onSwipeNext, onSwipePrev, currentHymnIndex, totalHymns }) => {
  console.log('[HymnDetail.js] Rendering. Received hymn prop:', hymn); 

  // State for font size - initial size 16px
  const [fontSize, setFontSize] = useState(16);

  const handleZoomIn = () => {
    setFontSize(prevSize => Math.min(prevSize + 2, 32)); // Max font size 32px
  };

  const handleZoomOut = () => {
    setFontSize(prevSize => Math.max(prevSize - 2, 10)); // Min font size 10px
  };

  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      console.log("[HymnDetail.js] Swiped Left - Next Hymn");
      if (onSwipeNext) onSwipeNext();
    },
    onSwipedRight: () => {
      console.log("[HymnDetail.js] Swiped Right - Previous Hymn");
      if (onSwipePrev) onSwipePrev();
    },
    preventScrollOnSwipe: false, // Changed from true
    trackMouse: true // Optional: allow swiping with mouse for easier desktop testing
  });

  // Reset font size when hymn changes
  useEffect(() => {
    setFontSize(16); // Reset to default font size
  }, [hymn]);


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
    console.log('[HymnDetail.js] Condition !hymn is TRUE. Rendering "Mifidiana hira azafady.');
    return (
        <div className="p-4 md:p-6 rounded-lg shadow-xl text-center" 
             style={{ 
               background: isDarkMode ? colors.darkCard : colors.cardBg, 
               borderColor: isDarkMode ? colors.darkCardBorder : colors.cardBorder,
               borderWidth: '1px', // Ensure border is visible
               borderStyle: 'solid'
             }}>
            <p style={{ color: isDarkMode ? colors.darkCardSubtitle : colors.cardSubtitle }}>Mifidiana hira azafady.</p>
        </div>
    );
  }

  return (
    <div {...swipeHandlers} className="max-w-2xl mx-auto p-4 md:p-6 rounded-xl select-none" // Added swipeHandlers and select-none
         style={{ 
           background: isDarkMode ? colors.darkCard : colors.cardBg, 
           boxShadow: isDarkMode ? colors.darkCardShadow : colors.cardShadow, 
           border: `1px solid ${isDarkMode ? colors.darkCardBorder : colors.cardBorder}`,
           touchAction: 'pan-y' // Allow vertical scroll but handle horizontal with swipeable
         }}>
      <div className="flex justify-between items-center mb-4"> 
        {/* Favorite Button */}
        <button 
          onClick={() => onToggleFavorite(hymn.Id_)} 
          className={`p-2 rounded-full transition-colors ${isFavorite ? 'text-red-500 bg-red-100 dark:text-red-400 dark:bg-red-900' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          style={!isFavorite ? {
            color: isDarkMode ? colors.darkIconColor : colors.iconColor,
            // Using className for hover now, direct style hover is tricky
          } : {}}
          aria-label={isFavorite ? "Esory amin'ny ankafizina" : "Ampio amin'ny ankafizina"}
        >
          <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>

        {/* Zoom Controls */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleZoomOut}
            className="p-2 rounded-full transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
            style={{ color: isDarkMode ? colors.darkIconColor : colors.iconColor }}
            aria-label="Henao ny haben'ny soratra"
            disabled={fontSize <= 10} // Disable if at min font size
          >
            <ZoomOut size={22} />
          </button>
          <span className="text-sm w-6 text-center" style={{color: isDarkMode ? colors.darkTextSecondary : colors.lightTextSecondary}}>{fontSize}px</span>
          <button 
            onClick={handleZoomIn}
            className="p-2 rounded-full transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
            style={{ color: isDarkMode ? colors.darkIconColor : colors.iconColor }}
            aria-label="Halehibeazo ny haben'ny soratra"
            disabled={fontSize >= 32} // Disable if at max font size
          >
            <ZoomIn size={22} />
          </button>
        </div>
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
        className="text-base whitespace-pre-line mt-4" // Added mt-4 for spacing
        style={{ 
          color: isDarkMode ? colors.darkCardTitle : colors.cardTitle, 
          fontFamily: 'inherit', 
          lineHeight: '1.6',
          fontSize: `${fontSize}px` // Apply dynamic font size
          // Removed temporary border, padding, and margin
        }}
      >
        {formatDetails(hymn.detaille)}
      </div>
    </div>
  );
};

export default HymnDetail;
