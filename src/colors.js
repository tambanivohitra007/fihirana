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

  // General Title colors (New - for use in components like HymnDetail)
  title: '#2e3a53', // Based on cardTitle
  darkTitle: '#fff', // Based on darkCardTitle

  // Card List Item specific borders (New)
  cardListItemBorder: '#e2e8f0', // Based on lightBorder
  darkCardListItemBorder: '#393a3f', // Based on darkBorder

  // Card List Item specific backgrounds and hover states (New)
  // Assuming cardListItemBg might be similar to lightCard, and darkCardListItemBg to darkCard
  // If you haven't defined cardListItemBg and darkCardListItemBg, you should add them.
  // For example:
  // cardListItemBg: '#f8fafc', // Example: similar to lightCard
  // darkCardListItemBg: '#23262f', // Example: similar to darkCard

  cardListItemBgHover: '#eef1f5', // Slightly darker for light mode items
  darkCardListItemBgHover: '#2a2e37', // Slightly darker for dark mode items

  // Text colors
  darkText: '#ffffff', // main text in dark mode
  lightText: '#212226', // main text in light mode
  darkTextSecondary: '#b0b3b8', // muted/secondary text in dark mode
  lightTextSecondary: '#64748b', // muted/secondary text in light mode
  darkTextTertiary: '#7b8ca6', // for even more muted text in dark mode
  lightTextTertiary: '#a0aec0', // for even more muted text in light mode
  // Border colors
  darkBorder: '#393a3f',
  lightBorder: '#e2e8f0',

  // Muted text colors (New - for general use, distinct from cardMuted)
  muted: '#64748b', // Based on lightTextSecondary
  darkMuted: '#b0b3b8', // Based on darkTextSecondary

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
  iconColor: '#aaa', // Default icon color for light mode (using lightTextSecondary)
  // Dark mode icon colors
  darkIconBlue: '#3b82f6',
  darkIconRed: '#ef4444',
  darkIconGreen: '#22c55e',
  darkIconPurple: '#a78bfa',
  darkIconColor: '#b0b3b8', // Default icon color for dark mode (using darkTextSecondary)

  // Special color for Hymn Number (New)
  hymnNumberColor: '#FFD700', // Gold color, can be adjusted to a more orange-gold if needed e.g., #FFA500 (Orange) or #FFBF00 (Amber/Orange-Gold)
  hymnNumberColor2: '#FFA500', // Gold color, can be adjusted to a more orange-gold if needed e.g., #FFA500 (Orange) or #FFBF00 (Amber/Orange-Gold)

  // Sidebar specific
  // Dark Mode Sidebar
  darkSidebarBg: '#212226', // deep blue
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

  // Modal and Input specific colors (New)
  darkModalBg: '#2D3748', // Dark background for modals
  lightModalBg: '#FFFFFF', // Light background for modals
  darkInputBg: '#4A5568',  // Dark background for input fields
  lightInputBg: '#EDF2F7', // Light background for input fields

  // Warning/Offline Banner colors
  darkWarningBg: '#4A2E2E', // Darker red for warning background
  lightWarningBg: '#FFF9DB', // Light yellow for warning background
  darkWarningText: '#FED7D7', // Light red text for dark warning
  lightWarningText: '#744210', // Dark yellow/brown text for light warning

  // Notification Colors (New)
  darkErrorBg: '#5A2E2E',
  lightErrorBg: '#FFF5F5',
  darkErrorText: '#FED7D7',
  lightErrorText: '#C53030',
  darkErrorIcon: '#F56565',
  lightErrorIcon: '#E53E3E',

  darkSuccessBg: '#2A4B35',
  lightSuccessBg: '#F0FFF4',
  darkSuccessText: '#C6F6D5',
  lightSuccessText: '#2F855A',
  darkSuccessIcon: '#68D391',
  lightSuccessIcon: '#38A169',

  darkInfoBg: '#2D3748', // Can reuse modal or a new specific color
  lightInfoBg: '#EBF8FF', // Can reuse modal or a new specific color
  darkInfoText: '#FFFFFF',
  lightInfoText: '#1A202C',
  darkInfoIcon: '#63B3ED',
  lightInfoIcon: '#3182CE',
};

export default colors;
