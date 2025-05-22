import React from 'react';
import { Search } from 'lucide-react';
import colors from '../colors';

const SearchBar = ({ searchTerm, onSearchChange, isDarkMode }) => { // Added isDarkMode prop
  return (
    <div
      className="mb-4 w-full flex items-center rounded-xl relative" // Added relative positioning
      style={{
        background: isDarkMode ? colors.darkCard : colors.cardBg,
        boxShadow: isDarkMode ? colors.darkCardShadow : colors.cardShadow,
        border: `1px solid ${isDarkMode ? colors.darkCardBorder : colors.cardBorder}`
      }}
    >
      <Search 
        className="absolute left-3 top-1/2 transform -translate-y-1/2" 
        size={20} 
        style={{ color: isDarkMode ? colors.darkIconColor : colors.iconColor }} 
      />
      <input
        type="text"
        className="w-full bg-transparent pl-10 pr-4 py-3 rounded-xl focus:outline-none" // Added pl-10 for icon spacing
        style={{
          color: isDarkMode ? colors.darkText : colors.cardTitle,
          fontSize: '1rem',
          fontWeight: 400,
          '::placeholder': { color: isDarkMode ? colors.darkMutedText : colors.cardMuted }
        }}
        placeholder="Karohy hira, laharana, sns..."
        value={searchTerm}
        onChange={onSearchChange}
      />
    </div>
  );
};

export default SearchBar;
