import React from 'react';
import { X, Home, ListMusic, Info as InfoIcon, Moon, Sun, Users, Star, Tag, Hash, Download } from 'lucide-react'; // Added Download
import colors from '../colors';

const SidebarMenu = ({ isOpen, onClose, onNavigate, onToggleDarkMode, isDarkMode, currentPage, onOpenNumericInput, onInstallClick, showInstallButton }) => { // Added onInstallClick, showInstallButton
  if (!isOpen && window.innerWidth < 1024) return null;

  const mainNavItems = [ // Renamed from navItems and removed 'about'
    { name: 'list', label: 'Hira rehetra', icon: Home },
    { name: 'themes', label: 'Lohahevitra', icon: Tag },
    { name: 'authors', label: 'Mpanoratra', icon: Users },
    { name: 'favorites', label: 'Ankafizina', icon: Star },
  ];
  const aboutItem = { name: 'about', label: 'Momba ny Application', icon: InfoIcon }; // Defined 'about' item separately

  const sidebarBg = isDarkMode ? colors.darkSidebarBg : colors.lightSidebarBg;
  const sidebarText = isDarkMode ? colors.darkSidebarText : colors.lightSidebarText;
  // Use lightGradient and darkGradient for active background
  const sidebarActiveBg = isDarkMode ? colors.darkGradient : colors.lightGradient;
  const sidebarActiveText = isDarkMode ? colors.darkSidebarActiveText : colors.lightSidebarActiveText;
  const sidebarDivider = isDarkMode ? colors.darkSidebarDivider : colors.lightSidebarDivider;
  const sidebarTitleText = isDarkMode ? colors.darkSidebarTitleText : colors.lightSidebarTitleText;
  const sidebarIconColor = isDarkMode ? colors.darkSidebarText : colors.lightSidebarText; // Default icon color
  const sidebarActiveIconColor = isDarkMode ? colors.darkSidebarActiveText : colors.lightSidebarActiveText; // Active icon color


  return (
    <>
      {isOpen && <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out lg:hidden"
        onClick={onClose}
      ></div>}
      <aside
        className={`fixed top-0 left-0 w-64 sm:w-72 h-full z-50 transform transition-transform duration-300 ease-in-out border-r ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:sticky lg:h-screen flex flex-col`} // Added flex flex-col
        style={{ background: sidebarBg, color: sidebarText, borderColor: sidebarDivider }}
      >
        <div className="flex-grow overflow-y-auto"> {/* Wrapper for scrollable content */}
          {/* Logo/Header */}
          <div className="flex items-center gap-3 px-6 py-6 mb-2">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/20 shadow-lg ring-2 ring-sky-400">
                  <ListMusic size={28} className="text-sky-200" />
            </span>
            <span className="text-lg font-bold tracking-tight" style={{ color: sidebarTitleText }}>Fihirana</span>
          </div>
          <div className="px-6 mb-2">
            <span className="text-xs uppercase tracking-wider" style={{ color: sidebarText, letterSpacing: 1 }}>Fitetezana</span>
          </div>
          <ul className="mb-4">
            {mainNavItems.map(item => ( // Changed to mainNavItems
              <li key={item.name} className="px-2">
                <button
                  onClick={() => onNavigate(item.name)}
                  className="flex items-center w-full text-left px-4 py-2.5 rounded-lg transition-colors duration-150"
                  style={{
                    background: currentPage === item.name ? sidebarActiveBg : 'transparent',
                    color: currentPage === item.name ? sidebarActiveText : sidebarText,
                    fontWeight: 400
                  }}
                  onMouseOver={e => {
                    if (currentPage !== item.name) {
                      e.currentTarget.style.background = sidebarActiveBg;
                      if (!isDarkMode) {
                        e.currentTarget.style.color = '#fff'; // White text on hover in light mode
                        // Also change icon color on hover in light mode
                        const icon = e.currentTarget.querySelector('svg');
                        if (icon) icon.style.color = '#fff';
                      }
                    }
                  }}
                  onMouseOut={e => {
                    if (currentPage !== item.name) {
                      e.currentTarget.style.background = 'transparent';
                      if (!isDarkMode) {
                        e.currentTarget.style.color = sidebarText;
                        // Revert icon color on mouse out in light mode
                        const icon = e.currentTarget.querySelector('svg');
                        if (icon) icon.style.color = sidebarIconColor;
                      }
                    }
                  }}
                >
                  <item.icon size={20} className="mr-3" style={{ color: currentPage === item.name ? sidebarActiveIconColor : sidebarIconColor }} />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="px-6 mb-2">
            <span className="text-xs uppercase tracking-wider" style={{ color: sidebarText, letterSpacing: 1 }}>Ankoatra</span>
          </div>
          <ul>
            <li className="px-2">
              <button
                onClick={() => {
                  onOpenNumericInput();
                  onClose(); // Close sidebar after clicking
                }}
                className="flex items-center w-full text-left px-4 py-2.5 rounded-lg transition-colors duration-150"
                style={{ color: sidebarText, fontWeight: 400 }}
                onMouseOver={e => {
                  e.currentTarget.style.background = (isDarkMode ? colors.darkGradient : colors.lightGradient);
                  if (!isDarkMode) {
                    e.currentTarget.style.color = '#fff';
                    const icon = e.currentTarget.querySelector('svg');
                    if (icon) icon.style.color = '#fff';
                  }
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = 'transparent';
                  if (!isDarkMode) {
                    e.currentTarget.style.color = sidebarText;
                    const icon = e.currentTarget.querySelector('svg');
                    if (icon) icon.style.color = sidebarIconColor;
                  }
                }}
              >
                <Hash size={20} className="mr-3" style={{ color: sidebarIconColor }} />
                Nomerao
              </button>
            </li>
            {/* Hametraka App button */}
            {showInstallButton && (
              <li className="px-2">
                <button
                  onClick={() => {
                    onInstallClick();
                    onClose(); // Close sidebar after clicking
                  }}
                  className="flex items-center w-full text-left px-4 py-2.5 rounded-lg transition-colors duration-150"
                  style={{ color: sidebarText, fontWeight: 400 }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = (isDarkMode ? colors.darkGradient : colors.lightGradient);
                    if (!isDarkMode) {
                      e.currentTarget.style.color = '#fff';
                      const icon = e.currentTarget.querySelector('svg');
                      if (icon) icon.style.color = '#fff';
                    }
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = 'transparent';
                    if (!isDarkMode) {
                      e.currentTarget.style.color = sidebarText;
                      const icon = e.currentTarget.querySelector('svg');
                      if (icon) icon.style.color = sidebarIconColor;
                    }
                  }}
                >
                  <Download size={20} className="mr-3" style={{ color: sidebarIconColor }} />
                  Hametraka App
                </button>
              </li>
            )}
            {/* Dark mode toggle button */}
            <li className="px-2">
              <button 
                onClick={() => {
                  onToggleDarkMode();
                  // onClose(); // Keep sidebar open for dark mode toggle, or close if preferred
                }}
                className="flex items-center w-full text-left px-4 py-2.5 rounded-lg transition-colors duration-150"
                style={{ color: sidebarText, fontWeight: 400 }}
                onMouseOver={e => {
                  e.currentTarget.style.background = (isDarkMode ? colors.darkGradient : colors.lightGradient);
                  if (!isDarkMode) {
                    e.currentTarget.style.color = '#fff'; // White text on hover in light mode
                    // Also change icon color on hover in light mode
                    const icon = e.currentTarget.querySelector('svg');
                    if (icon) icon.style.color = '#fff';
                  }
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = 'transparent';
                  if (!isDarkMode) {
                    e.currentTarget.style.color = sidebarText;
                    // Revert icon color on mouse out in light mode
                    const icon = e.currentTarget.querySelector('svg');
                    if (icon) icon.style.color = sidebarIconColor;
                  }
                }}
              >
                {isDarkMode ? <Sun size={20} className="mr-3" style={{ color: sidebarIconColor }} /> : <Moon size={20} className="mr-3" style={{ color: sidebarIconColor }} />}
                {isDarkMode ? "Hazavana" : "Maizina"}
              </button>
            </li>
          </ul>
        </div> {/* End of flex-grow wrapper for scrollable content */}

        {/* About button section at the bottom */}
        <div className="mt-auto border-t" style={{ borderColor: sidebarDivider }}>
          <ul className="py-2">
            <li className="px-2">
              <button
                onClick={() => onNavigate(aboutItem.name)}
                className="flex items-center w-full text-left px-4 py-2.5 rounded-lg transition-colors duration-150"
                style={{
                  background: currentPage === aboutItem.name ? sidebarActiveBg : 'transparent',
                  color: currentPage === aboutItem.name ? sidebarActiveText : sidebarText,
                  fontWeight: 400
                }}
                onMouseOver={e => {
                  if (currentPage !== aboutItem.name) {
                    e.currentTarget.style.background = sidebarActiveBg;
                    if (!isDarkMode) {
                      e.currentTarget.style.color = '#fff'; // White text on hover in light mode
                      const icon = e.currentTarget.querySelector('svg');
                      if (icon) icon.style.color = '#fff';
                    }
                  }
                }}
                onMouseOut={e => {
                  if (currentPage !== aboutItem.name) {
                    e.currentTarget.style.background = 'transparent';
                    if (!isDarkMode) {
                      e.currentTarget.style.color = sidebarText;
                      const icon = e.currentTarget.querySelector('svg');
                      if (icon) icon.style.color = sidebarIconColor;
                    }
                  }
                }}
              >
                <aboutItem.icon size={20} className="mr-3" style={{ color: currentPage === aboutItem.name ? sidebarActiveIconColor : sidebarIconColor }} />
                <span>{aboutItem.label}</span>
              </button>
            </li>
          </ul>
        </div>
        
        {isOpen && <button 
            onClick={onClose} 
            className="absolute top-4 right-4 lg:hidden focus:outline-none focus:ring-2 rounded-full p-1 transition"
            style={{ color: sidebarIconColor }} // Use sidebar icon color for close button
            >
          <X size={28} />
        </button>}
      </aside>
    </>
  );
};

export default SidebarMenu;
