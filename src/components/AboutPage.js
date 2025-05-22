import React from 'react';
import { ArrowLeft } from 'lucide-react';
import colors from '../colors';

const AboutPage = ({ onBack, isDarkMode }) => (
    <div className="max-w-2xl mx-auto p-6 rounded-xl" 
      style={{
        background: isDarkMode ? colors.darkCard : colors.cardBg, 
        boxShadow: isDarkMode ? colors.darkCardShadow : colors.cardShadow, 
        border: `1px solid ${isDarkMode ? colors.darkCardBorder : colors.cardBorder}` 
      }}
    >
      <h2 className="text-2xl mb-2" style={{ color: isDarkMode ? colors.darkCardTitle : colors.cardTitle }}>Momba ny App</h2>
      <p className="mb-2" style={{ color: isDarkMode ? colors.darkCardSubtitle : colors.cardSubtitle }}>Fihirana PWA</p>
      <p className="text-sm" style={{ color: isDarkMode ? colors.darkCardMuted : colors.cardMuted }}>Fampiharana hijerena ny hira ao amin'ny Fihirana FFPM (static data).</p>
      <button
        onClick={onBack}
        className="mt-6 inline-flex items-center px-4 py-2 rounded-lg transition-colors duration-200"
        style={{
          background: isDarkMode ? colors.darkButtonPrimaryBg : colors.buttonPrimaryBg,
          color: isDarkMode ? colors.darkButtonPrimaryText : colors.buttonPrimaryText,
          ':hover': {
            background: isDarkMode ? colors.darkButtonPrimaryHoverBg : colors.buttonPrimaryHoverBg,
          }
        }}
      >
        <ArrowLeft size={20} className="mr-2" /> Hiverina amin'ny lisitra
      </button>
    </div>
  );

export default AboutPage;
