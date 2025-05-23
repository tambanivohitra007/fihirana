import React from 'react';
import { X, Delete, CornerDownLeft } from 'lucide-react';
import colors from '../colors';

const NumericInputDialog = ({ isOpen, onClose, onEnter, value, setValue, onClear, isDarkMode }) => {
  if (!isOpen) return null;

  const handleDigitClick = (digit) => {
    if ((value + digit).length <= 4) { // Limit to 4 digits, adjust if needed
      setValue(value + digit);
    }
  };

  const buttons = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    'C', '0', '↵' // C for Clear, ↵ for Enter
  ];

  const buttonBg = isDarkMode ? (colors.darkButtonSecondaryBg || '#4A5568') : (colors.lightButtonSecondaryBg || '#E2E8F0');
  const buttonText = isDarkMode ? (colors.darkButtonSecondaryText || '#E2E8F0') : (colors.lightButtonSecondaryText || '#2D3748');
  const dialogBg = isDarkMode ? (colors.darkModalBg || '#2D3748') : (colors.lightModalBg || '#FFFFFF');
  const dialogTextColor = isDarkMode ? colors.darkText : colors.lightText;
  const inputBg = isDarkMode ? (colors.darkInputBg || '#4A5568') : (colors.lightInputBg || '#EDF2F7');
  const inputBorder = isDarkMode ? colors.darkBorder : colors.lightBorder;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-opacity duration-300 ease-in-out" onClick={onClose}>
      <div 
        className="p-5 sm:p-6 rounded-xl shadow-2xl w-full max-w-xs transform transition-all duration-300 ease-in-out" 
        style={{ background: dialogBg, color: dialogTextColor }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside dialog
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg sm:text-xl font-semibold">Hira laharana faha-</h3>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full hover:bg-gray-500/20 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="Akatona"
          >
            <X size={24} />
          </button>
        </div>
        <input
          type="text"
          readOnly
          value={value}
          className="w-full p-3 mb-4 text-2xl sm:text-3xl text-right rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500"
          style={{ background: inputBg, borderColor: inputBorder, color: dialogTextColor }}
          placeholder="0"
        />
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {buttons.map((btnStr) => {
            let action;
            let IconComponent = null;
            let displayLabel = btnStr;
            let ariaLabel = `Isa ${btnStr}`;
            let extraClasses = "text-xl sm:text-2xl";

            if (btnStr === 'C') {
              action = onClear;
              IconComponent = Delete;
              displayLabel = <IconComponent size={24} className="mx-auto" />;
              ariaLabel = "Fafana";
              extraClasses = "py-3 sm:py-4";
            } else if (btnStr === '↵') {
              action = () => onEnter(value);
              IconComponent = CornerDownLeft;
              displayLabel = <IconComponent size={24} className="mx-auto" />;
              ariaLabel = "Ampidirina";
              extraClasses = "py-3 sm:py-4 bg-sky-500 hover:bg-sky-600 text-white dark:bg-sky-600 dark:hover:bg-sky-700";
            } else { // Digit button
              action = () => handleDigitClick(btnStr);
            }

            return (
              <button
                key={btnStr}
                onClick={action}
                aria-label={ariaLabel}
                className={`p-3 sm:p-4 font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400 dark:focus:ring-offset-gray-800 transition-all duration-150 ease-in-out active:transform active:scale-95 flex items-center justify-center ${extraClasses}`}
                style={ btnStr !== '↵' ? { background: buttonBg, color: buttonText } : {} }
              >
                {displayLabel}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NumericInputDialog;
