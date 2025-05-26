import React, { useState, useEffect } from 'react';
import { Heart, Share2, ZoomIn, ZoomOut, AlignLeft, AlignCenter, AlignRight, Settings, X } from 'lucide-react';
import { useSwipeable } from 'react-swipeable';
import colors from '../colors';

const HymnDetail = ({ hymn, onBack, isFavorite, onToggleFavorite, isDarkMode, onSwipeNext, onSwipePrev, showNotification, lyricAlignment, onSetLyricAlignment }) => {
  const [fontSize, setFontSize] = useState(16);
  const [isControlPanelOpen, setIsControlPanelOpen] = useState(false);

  const Lieblingslied = hymn && hymn.Titel && hymn.Titel.includes("Jeso no");

  const handleZoomIn = () => setFontSize(prevSize => Math.min(prevSize + 2, 48));
  const handleZoomOut = () => setFontSize(prevSize => Math.max(prevSize - 2, 10));

  const toggleControlPanel = () => setIsControlPanelOpen(!isControlPanelOpen);

  const handleAlignment = (alignment) => {
    // setLyricAlignment(alignment); // Removed: Call prop handler instead
    onSetLyricAlignment(alignment); // Use the handler passed from App.js
    // Optional: show notification for alignment change
    // if (showNotification) showNotification(`Alignement des paroles : ${alignment}`, 'info');
  };

  // Reset font size, alignment, and close panel when hymn changes
  useEffect(() => {
    setFontSize(16); 
    // setLyricAlignment('left'); // Removed: Alignment is global
    setIsControlPanelOpen(false); 
  }, [hymn]); 

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (onSwipeNext) onSwipeNext();
    },
    onSwipedRight: () => {
      if (onSwipePrev) onSwipePrev();
    },
    preventScrollOnSwipe: false,
    trackMouse: true
  });

  const handleShare = async () => {
    if (!hymn) {
      if (showNotification) {
        showNotification('Aucun cantique à partager.', 'warning');
      } else {
        alert('Aucun cantique à partager.');
      }
      return;
    }

    const shareData = {
      title: hymn.Titre,
      text: `Cantique: ${hymn.Titre}\\n\\n${hymn.detaille ? hymn.detaille.split('\\n').slice(0, 5).join('\\n') + (hymn.detaille.split('\\n').length > 5 ? '...' : '') : 'Contenu non disponible.'}\\n\\n(Partagé depuis Fihirana App)`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        if (showNotification) {
          showNotification('Cantique partagé avec succès !', 'success');
        }
      } else {
        await navigator.clipboard.writeText(`Title: ${shareData.title}\\nText: ${shareData.text}\\nURL: ${shareData.url}`);
        if (showNotification) {
          showNotification('Contenu copié dans le presse-papiers !', 'info');
        } else {
          alert('Contenu copié dans le presse-papiers ! Vous pouvez le partager.');
        }
      }
    } catch (error) {
      console.error('Error sharing hymn:', error);
      if (showNotification) {
        showNotification(`Erreur lors du partage: ${error.message}`, 'error');
      } else {
        alert(`Erreur lors du partage: ${error.message}`);
      }
    }
  };

  const formatDetails = (details) => {
    if (typeof details !== 'string' || !details.trim()) {
      return <p style={{ color: isDarkMode ? colors.darkCardMuted : colors.cardMuted }}><em>Tsy misy tononkira ho an\\'ity hira ity.</em></p>;
    }

    const lines = details.split('\\n');
    let inIsanAndininySection = false; // True if current line is effectively AFTER "ISAN'ANDININY" and before next stanza number

    return lines.map((line, index) => {
      const originalLine = line; // Keep original for indentation checking
      const lineContent = line.trim();

      if (lineContent === "") {
        return <br key={index} />;
      }

      let specialStyle = {};
      const isIndented = originalLine.startsWith('  ');

      // Apply base styling if we are in an active ISAN'ANDININY section (for lines AFTER the marker)
      if (inIsanAndininySection) {
        specialStyle = { fontWeight: 'bold', fontStyle: 'italic' };
      }

      // Rule 1: Check for lines starting with a digit (stanza numbers)
      // These reset the ISAN'ANDININY section styling for subsequent lines and have their own style.
      if (/^\\d/.test(lineContent)) {
        inIsanAndininySection = false;
        specialStyle = { fontWeight: 'bold', marginTop: '0.5em', marginBottom: '0.25em' };
      }
      // Rule 2: Check for "ISAN'ANDININY" line itself
      // This line is styled, and activates the section for *subsequent* lines.
      // Regex to match exact "ISAN'ANDININY" (case-insensitive, standard apostrophe)
      else if (/^ISAN'ANDININY$/i.test(lineContent)) {
        specialStyle = { fontWeight: 'bold', marginTop: '0.5em', marginBottom: '0.25em' };
        inIsanAndininySection = true; // Activate for lines that FOLLOW this one
      }
      // Rule 3: Check for "Réf." (Chorus) lines
      // These are always italic and have margins. Boldness is retained if inIsanAndininySection is true.
      else if (/^(refrain|chorus|réf\\.?):?/i.test(lineContent)) {
        specialStyle.fontStyle = 'italic'; // Ensure italic
        specialStyle.marginTop = '0.5em';
        specialStyle.marginBottom = '0.25em';
        // If inIsanAndininySection was true, fontWeight: 'bold' is already in specialStyle.
      }
      // Rule 4: Check for other structural headers (Andininy, Tonony, etc.)
      // These have margins. Boldness/italicness is retained if inIsanAndininySection is true.
      else if (/^(fiverenana|tontonana|andininy|verse|tonony\\s*\\d*):?/i.test(lineContent)) {
        specialStyle.marginTop = '0.5em';
        specialStyle.marginBottom = '0.25em';
        specialStyle.fontWeight = 'bold';
        // If inIsanAndininySection was true, fontWeight: 'bold' and fontStyle: 'italic' are already in specialStyle.
      }
      // Rule 5: Regular lyric lines
      // If inIsanAndininySection is true, they already received bold+italic styling.
      // Otherwise, specialStyle remains {} (or as set by other rules if any, though unlikely for plain lyrics).

      return (
        <span key={index} style={{ display: 'block', marginLeft: isIndented ? '2em' : '0', ...specialStyle }}>
          {lineContent}
        </span>
      );
    });
  };

  if (!hymn) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4"
             style={{
               background: isDarkMode ? colors.darkCard : colors.cardBg,
               color: isDarkMode ? colors.darkCardSubtitle : colors.cardSubtitle
             }}>
            <p>Mifidiana hira azafady.</p>
        </div>
    );
  }

  return (
    <div {...swipeHandlers} className="max-w-2xl mx-auto p-4 md:p-6 rounded-xl select-none"
         style={{
           background: isDarkMode ? colors.darkCard : colors.cardBg,
           boxShadow: isDarkMode ? colors.darkCardShadow : colors.cardShadow,
           border: `1px solid ${isDarkMode ? colors.darkCardBorder : colors.cardBorder}`,
           touchAction: 'pan-y'
         }}>
      <div className="flex justify-between items-start mb-4">
        {/* Left side: Favorite and Share buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onToggleFavorite(hymn.Id_)}
            className={`p-2 rounded-full transition-colors ${isFavorite ? 'text-red-500 bg-red-100 dark:text-red-400 dark:bg-red-900' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            style={!isFavorite ? { color: isDarkMode ? colors.darkIconColor : colors.iconColor } : {}}
            aria-label={isFavorite ? "Esory amin\\'ny ankafizina" : "Ampio amin\\'ny ankafizina"}
          >
            <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-full transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
            style={{ color: isDarkMode ? colors.darkIconColor : colors.iconColor }}
            aria-label="Partager ce cantique"
          >
            <Share2 size={24} />
          </button>
        </div>

        {/* Right side: Hymn Number (Large) */}
        <div className="text-right"> 
          <h2 className="text-5xl font-bold" style={{ color: isDarkMode ? colors.hymnNumberColor : colors.hymnNumberColor2 }}>
            {hymn.num}
          </h2>
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-1 text-center" style={{ color: isDarkMode ? colors.darkTitle : colors.title }}>
        {hymn.Titre}
      </h1>
      {Lieblingslied && (
          <p className="text-sm text-center mb-3" style={{ color: isDarkMode ? colors.darkMuted : colors.muted }}>
              (Ein Lieblingslied von Jeso)
          </p>
      )}
      {/* Display Auteur */}
      {hymn.Auteur && (
        <p className="text-sm text-center mb-1" style={{ color: isDarkMode ? colors.darkMuted : colors.muted }}>
          Auteur: {hymn.Auteur}
        </p>
      )}
      {hymn.Compositeur && (
        <p className="text-sm text-center mb-1" style={{ color: isDarkMode ? colors.darkMuted : colors.muted }}>
          Compositeur: {hymn.Compositeur}
        </p>
      )}
      {hymn.Tonalite && (
        <p className="text-sm text-center mb-1" style={{ color: isDarkMode ? colors.darkMuted : colors.muted }}>
          Tonalité: {hymn.Tonalite}
        </p>
      )}
      {hymn.Theme1 && (
        <p className="text-sm text-center mb-3" style={{ color: isDarkMode ? colors.darkMuted : colors.muted }}> {/* mb-3 for last item in block */}
          Thème: {hymn.Theme1}
        </p>
      )}

      <div
        className={`text-base whitespace-pre-line mt-4 break-words ${lyricAlignment === 'left' ? 'text-left' : lyricAlignment === 'center' ? 'text-center' : 'text-right'}`}
        style={{
          fontSize: `${fontSize}px`,
          color: isDarkMode ? colors.darkText : colors.text,
          lineHeight: '1.8'
        }}
      >
        {formatDetails(hymn.detaille)}
      </div>

      <div className="fixed bottom-16 right-4 z-50">
        <button
          onClick={toggleControlPanel}
          className="p-4 rounded-full shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{
            backgroundColor: isDarkMode ? colors.darkAccent : colors.accent,
            color: isDarkMode ? colors.darkButtonText : colors.buttonText,
            borderColor: isDarkMode ? colors.darkAccentBorder : colors.accentBorder
          }}
          aria-label={isControlPanelOpen ? "Fermer les contrôles" : "Ouvrir les contrôles"}
        >
          {isControlPanelOpen ? <X size={24} /> : <Settings size={24} />}
        </button>
      </div>

      {isControlPanelOpen && (
        <div
          className={`fixed bottom-32 right-4 z-40 p-3 rounded-lg shadow-xl transition-all duration-300 ease-in-out transform ${
            isControlPanelOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{
            background: isDarkMode ? colors.darkCard : colors.cardBg,
            border: `1px solid ${isDarkMode ? colors.darkCardBorder : colors.cardBorder}`
          }}
        >
          <div className="flex items-center justify-around space-x-2 mb-2">
            <button
              onClick={handleZoomOut}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              style={{ color: isDarkMode ? colors.darkIconColor : colors.iconColor }}
              aria-label="Zoom arrière"
            >
              <ZoomOut size={22}/>
            </button>
            <span className="text-sm w-10 text-center" style={{ color: isDarkMode ? colors.darkMuted : colors.muted }}>{fontSize}px</span>
            <button
              onClick={handleZoomIn}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              style={{ color: isDarkMode ? colors.darkIconColor : colors.iconColor }}
              aria-label="Zoom avant"
            >
              <ZoomIn size={22}/>
            </button>
          </div>
          <div className="flex items-center justify-around space-x-2 border-t pt-2" style={{ borderColor: isDarkMode ? colors.darkBorder : colors.border }}>
            <button
              onClick={() => handleAlignment('left')}
              className={`p-2 rounded-full ${lyricAlignment === 'left' ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-300') : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              style={{ color: isDarkMode ? colors.darkIconColor : colors.iconColor }}
              aria-label="Aligner à gauche"
            >
              <AlignLeft size={20}/>
            </button>
            <button
              onClick={() => handleAlignment('center')}
              className={`p-2 rounded-full ${lyricAlignment === 'center' ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-300') : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              style={{ color: isDarkMode ? colors.darkIconColor : colors.iconColor }}
              aria-label="Aligner au centre"
            >
              <AlignCenter size={20}/>
            </button>
            <button
              onClick={() => handleAlignment('right')}
              className={`p-2 rounded-full ${lyricAlignment === 'right' ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-300') : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              style={{ color: isDarkMode ? colors.darkIconColor : colors.iconColor }}
              aria-label="Aligner à droite"
            >
              <AlignRight size={20}/>
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 text-center">
        <button
            onClick={onBack}
            className="px-6 py-2 rounded-lg transition-colors"
            style={{
                backgroundColor: isDarkMode ? colors.hymnNumberColor : colors.hymnNumberColor2,
                color: isDarkMode ? colors.lightText : colors.darkText,
                border: `1px solid ${isDarkMode ? colors.darkButtonBorder : colors.buttonBorder}`
            }}
        >
            Hiverina
        </button>
      </div>
    </div>
  );
};

export default HymnDetail;
