import React from 'react';
import { BookOpen, Heart } from 'lucide-react';
import colors from '../colors';

const HymnListItem = ({ hymn, onSelect, isFavorite, onToggleFavorite, isDarkMode }) => (
  <li
    key={hymn.Id_}
    className="rounded-xl mb-4"
    style={{
      background: isDarkMode ? colors.darkCard : colors.cardBg,
      boxShadow: isDarkMode ? colors.darkCardShadow : colors.cardShadow,
      border: `1px solid ${isDarkMode ? colors.darkCardBorder : colors.cardBorder}`
    }}
    onClick={() => onSelect(hymn)}
  >
    <div className="p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-lg font-medium" style={{ color: isDarkMode ? colors.darkCardTitle : colors.cardTitle }}>{hymn.num}. {hymn.Titre}</span>
        {onToggleFavorite && (
          <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(hymn.Id_); }}
            className="ml-2 px-3 py-1 rounded-lg text-xs font-medium transition-colors"
            style={{
              background: isFavorite
                ? (isDarkMode ? colors.darkButtonPrimaryBg : colors.buttonPrimaryBg)
                : (isDarkMode ? colors.darkButtonSecondaryBg : colors.buttonSecondaryBg),
              color: isFavorite
                ? (isDarkMode ? colors.darkButtonPrimaryText : colors.buttonPrimaryText)
                : (isDarkMode ? colors.darkButtonSecondaryText : colors.buttonSecondaryText)
            }}
          >
            {isFavorite ? 'Ankafizina' : 'Ankafizo'}
          </button>
        )}
      </div>
      <div className="text-sm mb-1" style={{ color: isDarkMode ? colors.darkCardSubtitle : colors.cardSubtitle }}>
        {hymn.Auteur}
      </div>
      <div className="text-xs" style={{ color: isDarkMode ? colors.darkCardMuted : colors.cardMuted }}>
        {hymn.Theme1}{hymn.Theme2 ? ` - ${hymn.Theme2}` : ''}
      </div>
    </div>
  </li>
);

export default HymnListItem;
