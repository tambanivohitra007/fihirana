// src/colors.js
// Centralized color and gradient variables for easy theme changes

const colors = {
  // Backgrounds
  darkBg: '#212226',
  lightBg: '#ffffff',
  // Gradients
  darkGradient: '#212226',
  lightGradient: 'linear-gradient(90deg, #028174 70%, #028180 100%)',
  // Accent (for rings, highlights, etc.)
  darkAccent: '#F14666',
  lightAccent: '#028174',
  // Card backgrounds
  darkCard: '#23262f', // slightly lighter than darkBg for contrast
  lightCard: '#f8fafc', // slightly off-white for card contrast
  // Card styles
  cardBg: '#fff',
  cardShadow: '0 2px 12px 0 rgba(60,72,100,0.07)',
  cardBorder: '#e6eaf3',
  cardTitle: '#2e3a53',
  cardSubtitle: '#7b8ca6',
  cardMuted: '#b0b8c9',
  // Dark mode card styles
  darkCardShadow: '0 2px 12px 0 rgba(0,0,0,0.25)',
  darkCardBorder: '#23262f',
  darkCardTitle: '#fff',
  darkCardSubtitle: '#b0b8c9',
  darkCardMuted: '#7b8ca6',
  // Text colors
  darkText: '#ffffff', // main text in dark mode
  lightText: '#212226', // main text in light mode
  darkTextSecondary: '#b0b3b8', // muted/secondary text in dark mode
  lightTextSecondary: '#64748b', // muted/secondary text in light mode
  // Border colors
  darkBorder: '#393a3f',
  lightBorder: '#e2e8f0',
  // Button styles
  buttonPrimaryBg: '#20c997',
  buttonPrimaryText: '#fff',
  buttonPrimaryHover: '#17a589',
  buttonSecondaryBg: '#f4f7fa',
  buttonSecondaryText: '#20c997',
  buttonSecondaryHover: '#e6eaf3',
  // Dark mode button styles
  darkButtonPrimaryBg: '#20c997',
  darkButtonPrimaryText: '#fff',
  darkButtonPrimaryHover: '#17a589',
  darkButtonSecondaryBg: '#23262f',
  darkButtonSecondaryText: '#20c997',
  darkButtonSecondaryHover: '#2e3a53',
  // Icon colors
  iconBlue: '#3b82f6',
  iconRed: '#ef4444',
  iconGreen: '#22c55e',
  iconPurple: '#a78bfa',
  // Dark mode icon colors
  darkIconBlue: '#3b82f6',
  darkIconRed: '#ef4444',
  darkIconGreen: '#22c55e',
  darkIconPurple: '#a78bfa',
  // Sidebar specific
  // Dark Mode Sidebar
  darkSidebarBg: '#2e3a53', // deep blue
  darkSidebarActiveBg: '#364257', // lighter blue for selected/hover
  darkSidebarText: '#b0b8c9', // muted text
  darkSidebarActiveText: '#fff', // white for active
  darkSidebarDivider: '#3f4d67', // subtle divider

  // Light Mode Sidebar
  lightSidebarBg: '#ffffff', // white background
  lightSidebarActiveBg: '#e0e7ff', // a light blue/purple for active/hover // This is not directly used for active item bg anymore, but kept for other potential uses
  lightSidebarText: '#4a5568', // a mid-gray for text
  lightSidebarActiveText: '#ffffff', // main accent color for active text - CHANGED TO WHITE FOR BETTER CONTRAST ON GRADIENT
  lightSidebarDivider: '#e2e8f0', // light gray divider
};

export default colors;
