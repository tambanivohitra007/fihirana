import React from 'react';
import { ArrowLeft, ListFilter } from 'lucide-react';
import colors from '../colors';

const SelectionListPage = ({ title, items, onSelectItem, onBack, isDarkMode }) => (
  <div 
    className="p-4 md:p-6" // Removed card-like styling from the main container
    style={{ 
      background: isDarkMode ? colors.darkBg : colors.lightBg, // Use main background colors
    }}
  >
    <button
        onClick={onBack}
        className="mb-6 flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
        style={{ 
          background: isDarkMode ? colors.darkButtonSecondaryBg : colors.buttonSecondaryBg, 
          color: isDarkMode ? colors.darkButtonSecondaryText : colors.buttonSecondaryText,
          // Removed border and shadow from back button, assuming it's part of the page, not a card
        }}
        onMouseOver={e => e.currentTarget.style.background = isDarkMode ? colors.darkButtonSecondaryHoverBg : colors.buttonSecondaryHoverBg}
        onMouseOut={e => e.currentTarget.style.background = isDarkMode ? colors.darkButtonSecondaryBg : colors.buttonSecondaryBg}
      >
        <ArrowLeft size={20} className="mr-2" /> Miverina
      </button>
    <h2 
      className="text-2xl font-bold mb-4"
      style={{ color: isDarkMode ? colors.darkPrimaryText : colors.lightPrimaryText }} // Use primary text colors
    >
      {title}
    </h2>
    {items.length > 0 ? (
      <ul className="space-y-3"> 
        {items.map(item => {
          // Define colors based on mode for clarity
          const originalBg = isDarkMode ? colors.darkCardListItemBg : colors.cardListItemBg;
          const originalTextColor = isDarkMode ? colors.darkCardTitle : colors.cardTitle;
          const originalBorderColor = isDarkMode ? colors.darkCardListItemBorder : colors.cardListItemBorder;

          // Updated hoverBg to be more subtle, not the full gradient
          const hoverBg = isDarkMode ? colors.darkSidebarActiveBg : colors.lightSidebarActiveBg; 
          const hoverTextColor = isDarkMode ? colors.darkSidebarActiveText : '#fff'; // White text on hover for light mode
          const hoverBorderColor = isDarkMode ? colors.darkAccent : colors.lightAccent;

          return (
            <li 
              key={item} 
              onClick={() => onSelectItem(item)}
              className="p-4 rounded-lg cursor-pointer transition-all duration-200 ease-in-out" // Removed shadow-md and hover:shadow-lg
              style={{ 
                color: originalTextColor,
                background: originalBg, 
                border: `1px solid ${originalBorderColor}`,
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = hoverBg;
                e.currentTarget.style.color = hoverTextColor;
                e.currentTarget.style.borderColor = hoverBorderColor;
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'none'; // Ensure no shadow on hover
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = originalBg;
                e.currentTarget.style.color = originalTextColor;
                e.currentTarget.style.borderColor = originalBorderColor;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none'; // Ensure no shadow on mouse out
              }}
            >
              {item}
            </li>
          );
        })}
      </ul>
    ) : (
      // Centered empty state, styled as a card itself for prominence
      <div 
        className="text-center py-10 p-6 rounded-lg shadow-xl"
        style={{
          background: isDarkMode ? colors.darkCard : colors.cardBg,
          boxShadow: isDarkMode ? colors.darkCardShadow : colors.cardShadow,
          border: `1px solid ${isDarkMode ? colors.darkCardBorder : colors.cardBorder}`
        }}
      >
        <ListFilter size={48} className="mx-auto mb-4" style={{ color: isDarkMode ? colors.darkIconColor : colors.iconColor }} />
        <p className="text-xl" style={{ color: isDarkMode ? colors.darkTextSecondary : colors.lightTextSecondary }}>
          Tsy misy azo isafidianana.
        </p>
        <p className="text-sm mt-2" style={{ color: isDarkMode ? colors.darkTextTertiary : colors.lightTextTertiary }}>
          Andramo sivana hafa na jereo amin'ny manaraka.
        </p>
      </div>
    )}
  </div>
);

export default SelectionListPage;
