import React, { useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import colors from '../colors';

const SearchBar = ({ onSearch, currentSearchTerm, isDarkMode, onClose, autoFocus }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleInputChange = (event) => {
    onSearch(event.target.value);
  };

  return (
    <div
      className="w-full flex items-center relative p-2"
      style={{
        // background: isDarkMode ? colors.darkCard : colors.cardBg,
        // boxShadow: isDarkMode ? colors.darkCardShadow : colors.cardShadow,
        // border: `1px solid ${isDarkMode ? colors.darkCardBorder : colors.cardBorder}`
      }}
    >
      <Search 
        className="absolute left-4 top-1/2 transform -translate-y-1/2" 
        size={20} 
        style={{ color: isDarkMode ? colors.darkIconColor : colors.iconColor }} 
      />
      <input
        ref={inputRef}
        type="text"
        className="w-full bg-transparent pl-10 pr-10 py-2 rounded-lg focus:outline-none border"
        style={{
          color: isDarkMode ? colors.darkText : colors.cardTitle,
          borderColor: isDarkMode ? colors.darkBorder : colors.lightBorder,
          fontSize: '1rem',
          fontWeight: 400,
        }}
        placeholder="Karohy hira, laharana, sns..."
        value={currentSearchTerm}
        onChange={handleInputChange}
      />
      {onClose && (
        <button 
          onClick={onClose} 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Close search bar"
        >
          <X size={20} style={{ color: isDarkMode ? colors.darkIconColor : colors.iconColor }} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
