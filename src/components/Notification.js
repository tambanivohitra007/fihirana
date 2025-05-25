import React, { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import colors from '../colors';

const Notification = ({ message, type = 'info', onClose, isDarkMode, duration = 3000 }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) {
    return null;
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="mr-2 flex-shrink-0" />;
      case 'error':
        return <AlertTriangle size={20} className="mr-2 flex-shrink-0" />;
      case 'info':
      default:
        return <Info size={20} className="mr-2 flex-shrink-0" />;
    }
  };

  const bgColor = isDarkMode 
    ? (type === 'error' ? colors.darkErrorBg || '#5A2E2E' : type === 'success' ? colors.darkSuccessBg || '#2A4B35' : colors.darkInfoBg || colors.darkModalBg || '#2D3748')
    : (type === 'error' ? colors.lightErrorBg || '#FFF5F5' : type === 'success' ? colors.lightSuccessBg || '#F0FFF4' : colors.lightInfoBg || colors.lightModalBg || '#EBF8FF');
  
  const textColor = isDarkMode 
    ? (type === 'error' ? colors.darkErrorText || '#FED7D7' : type === 'success' ? colors.darkSuccessText || '#C6F6D5' : colors.darkInfoText || colors.darkText || '#FFFFFF')
    : (type === 'error' ? colors.lightErrorText || '#C53030' : type === 'success' ? colors.lightSuccessText || '#2F855A' : colors.lightInfoText || colors.lightText || '#1A202C');

  const iconColor = isDarkMode
    ? (type === 'error' ? colors.darkErrorIcon || '#F56565' : type === 'success' ? colors.darkSuccessIcon || '#68D391' : colors.darkInfoIcon || colors.darkSidebarText || '#63B3ED')
    : (type === 'error' ? colors.lightErrorIcon || '#E53E3E' : type === 'success' ? colors.lightSuccessIcon || '#38A169' : colors.lightInfoIcon || colors.lightSidebarText || '#3182CE');

  return (
    <div 
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 p-3 rounded-md shadow-xl flex items-center z-50 transition-all duration-300 ease-in-out"
      style={{ 
        backgroundColor: bgColor, 
        color: textColor,
        minWidth: '280px', 
        maxWidth: 'calc(100% - 32px)', // Max width with some padding from screen edges
      }}
      role="alert"
    >
      <span style={{ color: iconColor }} className="flex-shrink-0">{getIcon()}</span>
      <span className="flex-grow text-sm mx-2 break-words">{message}</span>
      <button 
        onClick={onClose} 
        className="ml-auto p-1 rounded-full hover:bg-black/10 flex-shrink-0"
        aria-label="Close notification"
        style={{ color: textColor }} // Ensure close button matches text color for contrast
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default Notification;
