// src/App.js
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ListMusic, Download, XCircle, AlertTriangle, WifiOff, Menu, Star, Info as InfoIconLucide, Search, SlidersHorizontal, X } from 'lucide-react'; // Added X for clear button
import colors from './colors';

// Import separated components
import HymnListItem from './components/HymnListItem';
import HymnDetail from './components/HymnDetail';
import SearchBar from './components/SearchBar';
import SidebarMenu from './components/SidebarMenu';
import BottomNavigationBar from './components/BottomNavigationBar';
import SelectionListPage from './components/SelectionListPage';
import AboutPage from './components/AboutPage'; // Assuming AboutPage.js is in src/components/
import NumericInputDialog from './components/NumericInputDialog'; // Import the new component

const App = () => {
  // State for hymn data and UI
  const [allHymns, setAllHymns] = useState([]); 
  const [isLoading, setIsLoading] = useState(true); // Data is loading initially
  const [error, setError] = useState(null); // No fetch error for static data initially

  // State for search and filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [activeThemeFilter, setActiveThemeFilter] = useState(null);
  const [activeAuthorFilter, setActiveAuthorFilter] = useState(null);

  // State for navigation and selected hymn
  const [selectedHymn, setSelectedHymn] = useState(null);
  const [currentPage, setCurrentPage] = useState('list'); 

  // PWA specific states
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // UI states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false); // New state for global search bar

  const sidebarTitleText = useMemo(() => {
    return isDarkMode ? colors.darkSidebarTitleText : colors.lightSidebarTitleText;
  }, [isDarkMode]);

  const headerBg = useMemo(() => isDarkMode ? (colors.darkHeaderBg || colors.darkSidebarBg) : (colors.lightHeaderBg || colors.lightSidebarBg), [isDarkMode]);
  const headerText = useMemo(() => isDarkMode ? (colors.darkHeaderText || colors.darkSidebarText) : (colors.lightHeaderText || colors.lightSidebarText), [isDarkMode]);

  // Favorites state
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('fihiranaFavorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  // Numeric Input Dialog State
  const [isNumericInputDialogOpen, setIsNumericInputDialogOpen] = useState(false);
  const [numericInputValue, setNumericInputValue] = useState('');

  // Effect for Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
    // setIsSidebarOpen(false); // User might want to keep sidebar open
  };

  const toggleSearchBar = () => {
    setIsSearchBarVisible(prev => !prev);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    if (isSearchBarVisible) { // If global search is active
      // Navigate to list page to show results, even if term is cleared (to show all hymns)
      // or if user just opened search on a non-list page.
      if (currentPage !== 'list' || term.trim() !== '') {
         setCurrentPage('list');
      }
      if (term.trim() === '' && currentPage !== 'list' && isSearchBarVisible) {
        setCurrentPage('list'); // If search is cleared from non-list page, go to list
      }
    }
  };

  const clearAllFilters = () => {
    setActiveThemeFilter(null);
    setActiveAuthorFilter(null);
    setSearchTerm('');
    // Optionally, navigate back to the main list if not already there
    // setCurrentPage('list'); 
  };

  const handleThemeSelection = (theme) => {
    setActiveThemeFilter(theme);
    setActiveAuthorFilter(null); // Clear author filter when theme is selected
    setCurrentPage('list');
    setIsSidebarOpen(false); // Close sidebar
  };

  const handleAuthorSelection = (author) => {
    setActiveAuthorFilter(author);
    setActiveThemeFilter(null); // Clear theme filter when author is selected
    setCurrentPage('list');
    setIsSidebarOpen(false); // Close sidebar
  };

  // Effect for Storing Favorites
  useEffect(() => {
    localStorage.setItem('fihiranaFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (hymnId) => {
    setFavorites(prevFavorites => 
      prevFavorites.includes(hymnId)
        ? prevFavorites.filter(id => id !== hymnId)
        : [...prevFavorites, hymnId]
    );
  };

  // Effect for PWA Install Prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
      setShowInstallButton(true);
      console.log("beforeinstallprompt fired");
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // Effect for Online/Offline Status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Effect for PWA Manifest and Service Worker
  useEffect(() => {
    // Manifest
    const manifest = {
      short_name: "Fihirana",
      name: "Fihirana Malagasy",
      icons: [
        { src: "https://placehold.co/192x192/0077b6/ffffff?text=Fs", type: "image/png", sizes: "192x192", purpose: "any maskable" },
        { src: "https://placehold.co/512x512/0077b6/ffffff?text=FihiranaS", type: "image/png", sizes: "512x512", purpose: "any maskable" }
      ],
      start_url: "/fihirana/",
      display: "standalone",
      theme_color: "#0077b6",
      background_color: "#ffffff",
      description: "Fampiharana hijerena ny hira ao amin'ny Tiona Advantista Malagasy. Rindrasoftware 2025"
    };
    const manifestBlob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
    const manifestURL = URL.createObjectURL(manifestBlob);
    const linkElement = document.createElement('link');
    linkElement.rel = 'manifest';
    linkElement.href = manifestURL;
    document.head.appendChild(linkElement);

    // Service Worker
    const swContent = `
      const CACHE_NAME = 'fihirana-pwa-static-cache-v5'; // Incremented cache version
      const urlsToCache = [
        '/',
        '/index.html', // Main HTML file
        // Add paths to your JS and CSS bundles if they are not inlined or handled by CRA's SW
        // e.g., '/static/js/bundle.js', '/static/css/main.css'
        'https://placehold.co/192x192/0077b6/ffffff?text=Fs', // Placeholder icon
        'https://placehold.co/512x512/0077b6/ffffff?text=FihiranaS' // Placeholder icon
      ];

      self.addEventListener('install', event => {
        self.skipWaiting(); 
        event.waitUntil(
          caches.open(CACHE_NAME)
            .then(cache => {
              console.log('Opened cache for static PWA (v5)');
              const validUrlsToCache = urlsToCache.filter(url => !url.startsWith('blob:'));
              return cache.addAll(validUrlsToCache);
            })
            .catch(err => console.error('Failed to open cache or add urls: ', err))
        );
      });

      self.addEventListener('fetch', event => {
        if (event.request.method !== 'GET' || event.request.url.startsWith('blob:')) {
          event.respondWith(fetch(event.request));
          return;
        }
        event.respondWith(
          caches.match(event.request)
            .then(response => {
              if (response) {
                return response; // Serve from cache
              }
              // Not in cache, fetch from network
              return fetch(event.request).then(
                networkResponse => {
                  if(!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    return networkResponse;
                  }
                  const responseToCache = networkResponse.clone();
                  caches.open(CACHE_NAME)
                    .then(cache => {
                      cache.put(event.request, responseToCache);
                    });
                  return networkResponse;
                }
              ).catch(() => {
                // Network fetch failed, try to return a fallback for navigation
                if (event.request.mode === 'navigate') {
                  return caches.match('/index.html');
                }
              });
            })
        );
      });

      self.addEventListener('activate', event => {
        const cacheWhitelist = [CACHE_NAME];
        event.waitUntil(
          caches.keys().then(cacheNames => {
            return Promise.all(
              cacheNames.map(cacheName => {
                if (cacheWhitelist.indexOf(cacheName) === -1) {
                  console.log('Deleting old cache:', cacheName);
                  return caches.delete(cacheName);
                }
                return null; // Explicitly return null for non-deletion cases
              })
            );
          }).then(() => self.clients.claim()) 
        );
      });
    `;
    const swBlob = new Blob([swContent], { type: 'application/javascript' });
    const swURL = URL.createObjectURL(swBlob);

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register(swURL)
          .then(registration => console.log('ServiceWorker (static data v5) registration successful with scope: ', registration.scope))
          .catch(error => console.log('ServiceWorker (static data v5) registration failed: ', error));
      });
    }

    return () => {
      // Clean up manifest link if component unmounts
      if (document.head.contains(linkElement)) {
         document.head.removeChild(linkElement);
      }
    };
  }, []);

  // Fetch hymns data from fihirana.json
  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/fihirana.json')
      .then((response) => {
        if (!response.ok) throw new Error('Tsy afaka naka angona.');
        return response.json();
      })
      .then((data) => {
        setAllHymns(data.hiras || []);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  // PWA Install Button Handler
  const handleInstallClick = async () => {
    if (!installPrompt) return;
    const { outcome } = await installPrompt.prompt();
    console.log(`User response to the install prompt: ${outcome}`);
    setInstallPrompt(null);
    setShowInstallButton(false);
  };

  // Memoized data for lists
  const uniqueThemes = useMemo(() => {
    if (!allHymns) return [];
    const themes = new Set();
    allHymns.forEach(hymn => {
      if (hymn.Theme1) themes.add(hymn.Theme1);
    });
    return Array.from(themes).sort();
  }, [allHymns]);

  const uniqueAuthors = useMemo(() => {
    if (!allHymns) return [];
    const authors = new Set();
    allHymns.forEach(hymn => {
      if (hymn.Auteur) authors.add(hymn.Auteur);
    });
    return Array.from(authors).sort();
  }, [allHymns]);

  const filteredHymns = useMemo(() => {
    if (!allHymns) return [];
    return allHymns
      .filter(hymn => {
        const searchLower = searchTerm.toLowerCase();
        const titleMatch = hymn.Titre.toLowerCase().includes(searchLower);
        const numMatch = hymn.num.toString().includes(searchLower);
        
        let themeMatch = true;
        if (activeThemeFilter) {
          themeMatch = hymn.Theme1 === activeThemeFilter;
        }
        
        let authorMatch = true;
        if (activeAuthorFilter) {
          authorMatch = hymn.Auteur === activeAuthorFilter;
        }

        return (titleMatch || numMatch) && themeMatch && authorMatch;
      });
  }, [allHymns, searchTerm, activeThemeFilter, activeAuthorFilter]);

  const favoriteHymns = useMemo(() => {
    return allHymns.filter(hymn => favorites.includes(hymn.Id_));
  }, [allHymns, favorites]);

  // Numeric Input Dialog Handlers
  const openNumericInputDialog = () => {
    setNumericInputValue(''); // Clear previous input
    setIsNumericInputDialogOpen(true);
  };

  const closeNumericInputDialog = () => {
    setIsNumericInputDialogOpen(false);
    // setNumericInputValue(''); // Optionally clear input on close, or keep for re-opening
  };

  const handleNumericInputClear = () => {
    setNumericInputValue('');
  };

  const handleNumericInputEnter = (value) => {
    if (!value) {
      closeNumericInputDialog();
      return;
    }
    // const hymnNumber = parseInt(value, 10);
    // if (isNaN(hymnNumber)) {
    //   console.warn("Invalid hymn number entered:", value);
    //   closeNumericInputDialog();
    //   return;
    // }

    // Ensure we are comparing string with string, as hymn.num is a string in JSON
    const hymnNumberString = value.trim(); 
    console.log(`[App.js] handleNumericInputEnter: Searching for hymn number (string): '${hymnNumberString}'`);

    const targetHymn = allHymns.find(hymn => hymn.num === hymnNumberString);

    if (targetHymn) {
      console.log("[App.js] handleNumericInputEnter: Found targetHymn:", targetHymn);
      handleSelectHymn(targetHymn);
    } else {
      console.warn(`[App.js] handleNumericInputEnter: Hymn number '${hymnNumberString}' not found.`);
      alert(`Tsy misy hira mifandraika amin\'ny laharana : ${hymnNumberString}`); // Display alert
    }
    closeNumericInputDialog();
  };

  // Navigation and Selection Handlers
  const handleSelectHymn = useCallback((hymn) => {
    console.log("[App.js] handleSelectHymn called. Hymn data:", hymn); // Log 1: Check if function is called and with what data
    if (hymn && typeof hymn === 'object' && hymn.Id_ !== undefined) { // Basic check for a valid hymn object
        setSelectedHymn(hymn);
        setCurrentPage('detail');
        console.log("[App.js] State updated: selectedHymn set, currentPage set to 'detail'. Hymn ID:", hymn.Id_); // Log 2: Confirm state setters are called
    } else {
        console.error("[App.js] handleSelectHymn called with invalid or null hymn data:", hymn); // Log 3: Error if hymn data is bad
        // Prevent further execution if hymn data is invalid to avoid errors
        return;
    }
    setIsSidebarOpen(false);
    window.scrollTo(0, 0);
  }, [setSelectedHymn, setCurrentPage, setIsSidebarOpen]); // Added stable setters to dependency array

  const handleBackToList = useCallback(() => {
    setSelectedHymn(null);
    // Logic to determine which list to return to
    if (activeThemeFilter || activeAuthorFilter) {
        setCurrentPage('list'); 
    } else if (currentPage === 'favorites') {
        setCurrentPage('favorites');
    } else {
        setCurrentPage('list');
    }
  }, [activeThemeFilter, activeAuthorFilter, currentPage]);

  const handleNavigate = (page) => {
    setCurrentPage(page);
    setSelectedHymn(null); 
    // Reset search term if navigating away from list and search bar is not globally visible
    // or if navigating to a page that isn't 'list' while search bar is open (user might want to start fresh)
    if (page !== 'list' && isSearchBarVisible) {
        // setSearchTerm(''); // Optional: clear search term when navigating away with search bar open
    } else if (page !== 'list' && !isSearchBarVisible) {
        setSearchTerm(''); // Clear search if navigating away and search bar is closed
    }

    if (page !== 'list') {
        if (currentPage === 'list' && (activeAuthorFilter || activeThemeFilter)) {
            // Keep filters if navigating from list to e.g. about, then back to list
        } else {
            setActiveThemeFilter('');
            setActiveAuthorFilter('');
        }
    }
    setIsSidebarOpen(false);
    setIsSearchBarVisible(false); // Close search bar on navigation
    window.scrollTo(0,0);
  };
  
  const handleThemeSelect = (theme) => {
    setActiveThemeFilter(theme);
    setActiveAuthorFilter(''); 
    setCurrentPage('list');
    setIsSidebarOpen(false);
  };

  const handleAuthorSelect = (author) => {
    setActiveAuthorFilter(author);
    setActiveThemeFilter(''); 
    setCurrentPage('list');
    setIsSidebarOpen(false);
  };

  // Page Rendering Logic
  const renderPage = () => {
    // console.log(`[App.js] renderPage: currentPage='${currentPage}'. selectedHymn ID: ${selectedHymn ? selectedHymn.Id_ : 'null'}`);
    switch (currentPage) {
      case 'list':
        return (
          <>
            {/* Display active filters and clear button */}
            {(activeThemeFilter || activeAuthorFilter) && (
              <div 
                className="mb-4 p-3 rounded-lg flex justify-between items-center shadow" 
                style={{ 
                  background: isDarkMode ? colors.darkCard : colors.lightCard, 
                  color: isDarkMode ? colors.darkText : colors.lightText, 
                  border: `1px solid ${isDarkMode ? colors.darkBorder : colors.lightBorder}` 
                }}
              >
                <div>
                  {activeThemeFilter && <span className="font-semibold">Lohahevitra: {activeThemeFilter}</span>}
                  {activeAuthorFilter && <span className="font-semibold">Mpanoratra: {activeAuthorFilter}</span>}
                </div>
                <button
                  onClick={clearAllFilters}
                  className="p-1 rounded-full hover:bg-gray-500/20 transition-colors"
                  aria-label="Esory ny sivana"
                  style={{ color: isDarkMode ? (colors.darkIcon || '#9CA3AF') : (colors.lightIcon || '#6B7280') }}
                >
                  <X size={20} />
                </button>
              </div>
            )}
            {/* SearchBar is now global, remove from here */}
            {filteredHymns.length === 0 && (searchTerm || activeAuthorFilter || activeThemeFilter) && !isLoading && (
              <div className="text-center py-10" style={{ color: isDarkMode ? colors.darkMutedText : colors.lightMutedText }}>
                <XCircle size={48} className="mx-auto mb-2" />
                <p>Tsy misy hira mifanaraka amin'ny sivana.</p>
              </div>
            )}
             {filteredHymns.length === 0 && !searchTerm && !activeAuthorFilter && !activeThemeFilter && !isLoading && (
              <div className="text-center py-10" style={{ color: isDarkMode ? colors.darkMutedText : colors.lightMutedText }}>
                <ListMusic size={48} className="mx-auto mb-2" />
                <p>Tsy misy hira.</p> {/* Or message indicating no hymns loaded if allHymns is empty */}
              </div>
            )}
            {filteredHymns.length > 0 && (
              <ul className="space-y-2">
                {filteredHymns.map(hymn => (
                  <HymnListItem
                    key={hymn.Id_}
                    hymn={hymn}
                    onSelect={() => handleSelectHymn(hymn)}
                    isDarkMode={isDarkMode}
                    isFavorite={favorites.includes(hymn.Id_)}
                    onToggleFavorite={() => toggleFavorite(hymn.Id_)}
                  />
                ))}
              </ul>
            )}
          </>
        );
      case 'detail':
        return selectedHymn ? (
          <HymnDetail 
            hymn={selectedHymn} 
            onBack={handleBackToList} 
            isDarkMode={isDarkMode} 
            isFavorite={favorites.includes(selectedHymn.Id_)}
            onToggleFavorite={() => toggleFavorite(selectedHymn.Id_)}
          />
        ) : (
          <div>Mifidiana hira...</div>
        );
      case 'themes':
        return <SelectionListPage title="Lohahevitra" items={uniqueThemes} onSelect={handleThemeSelect} isDarkMode={isDarkMode} />;
      case 'authors':
        return <SelectionListPage title="Mpanoratra" items={uniqueAuthors} onSelect={handleAuthorSelect} isDarkMode={isDarkMode} />;
      case 'favorites':
        return (
          <>
            <h2 className="text-xl font-semibold mb-4" style={{ color: isDarkMode ? colors.darkText : colors.lightText }}>Hira Ankafizina</h2>
            {favoriteHymns.length === 0 ? (
              <div className="text-center py-10" style={{ color: isDarkMode ? colors.darkMutedText : colors.lightMutedText }}>
                <Star size={48} className="mx-auto mb-2" />
                <p>Tsy misy hira ankafizina voatahiry.</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {favoriteHymns
                  .filter(hymn => { // Apply search term to favorites as well
                    const searchLower = searchTerm.toLowerCase();
                    const titleMatch = hymn.Titre.toLowerCase().includes(searchLower);
                    const numMatch = hymn.num.toString().includes(searchLower);
                    return titleMatch || numMatch;
                  })
                  .map(hymn => (
                  <HymnListItem
                    key={hymn.Id_}
                    hymn={hymn}
                    onSelect={() => handleSelectHymn(hymn)}
                    isDarkMode={isDarkMode}
                    isFavorite={true}
                    onToggleFavorite={() => toggleFavorite(hymn.Id_)}
                  />
                ))}
                 {favoriteHymns.filter(hymn => {
                    const searchLower = searchTerm.toLowerCase();
                    const titleMatch = hymn.Titre.toLowerCase().includes(searchLower);
                    const numMatch = hymn.num.toString().includes(searchLower);
                    return titleMatch || numMatch;
                  }).length === 0 && searchTerm && (
                    <div className="text-center py-10" style={{ color: isDarkMode ? colors.darkMutedText : colors.lightMutedText }}>
                        <XCircle size={48} className="mx-auto mb-2" />
                        <p>Tsy misy ankafizina mifanaraka amin'ny sivana "{searchTerm}".</p>
                    </div>
                )}
              </ul>
            )}
          </>
        );
      case 'about':
        return <AboutPage isDarkMode={isDarkMode} />;
      default:
        return <div>Pejy tsy hita</div>;
    }
  };

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}> {/* Changed flex-col to flex */}
      <SidebarMenu
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNavigate={handleNavigate}
        onToggleDarkMode={toggleDarkMode}
        isDarkMode={isDarkMode}
        currentPage={currentPage}
        onOpenNumericInput={openNumericInputDialog}
        onInstallClick={handleInstallClick}
        showInstallButton={showInstallButton}
      />

      {/* Main content area - removed conditional margin, flex-1 handles width */}
      <div className="flex-1 flex flex-col">
        {/* Unified Top Bar */}
        <div 
          className="p-4 flex justify-between items-center shadow-md sticky top-0 z-30 h-16" // Added h-16 for fixed height
          style={{ backgroundColor: headerBg, color: headerText }}
        >
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="p-2 rounded-md lg:hidden mr-2" // Hamburger only for small screens
            >
              <Menu size={28} />
            </button>
            
            <span className="text-lg sm:text-xl font-semibold truncate" style={{ color: sidebarTitleText }}>
              {currentPage === 'detail' && selectedHymn ? `${selectedHymn.num}. ${selectedHymn.Titre}` : 
               currentPage === 'themes' ? 'Lohahevitra' :
               currentPage === 'authors' ? 'Mpanoratra' :
               currentPage === 'favorites' ? 'Ankafizina' :
               currentPage === 'about' ? 'Momba ny Application' :
               'Fihirana Malagasy '}
            </span>
          </div>
          <button onClick={toggleSearchBar} className="p-2 rounded-md">
            <Search size={24} />
          </button>
        </div>

        {/* Conditionally rendered SearchBar */}
        {isSearchBarVisible && (
          <div className="sticky top-16 z-20 shadow-md border-b" style={{borderColor: isDarkMode ? colors.darkBorder : colors.lightBorder, background: headerBg}}> {/* Match header bg */}
               <SearchBar 
                  onSearch={handleSearchChange} 
                  currentSearchTerm={searchTerm} 
                  isDarkMode={isDarkMode}
                  onClose={toggleSearchBar} // Pass toggleSearchBar to allow SearchBar to close itself
                  autoFocus={true} // Add autoFocus prop
               />
          </div>
        )}

        {/* Main Content */}
        <main className={`flex-1 p-4 overflow-y-auto ${isSearchBarVisible ? 'pt-2' : ''}`}>
          {isLoading && <div className="flex justify-center items-center h-full"><ListMusic className="animate-spin text-blue-500" size={48}/></div> /* Basic LoadingSpinner */}
          {error && <div className="text-red-500 text-center p-4">{error}</div> /* Basic ErrorMessage */}
          {!isLoading && !error && renderPage()}
          {isOffline && ( // Keep offline indicator at the bottom of main content, less intrusive
            <div className="mt-4 w-full bg-yellow-500 text-black text-center py-2 flex items-center justify-center rounded-md">
                <WifiOff size={20} className="mr-2" /> Tsy Misy Internet
            </div>
          )}
        </main>

        {/* Bottom Navigation Bar - ensure it's not shown when hymn detail is open */}
        {!selectedHymn && currentPage !== 'detail' && (
            <BottomNavigationBar currentPage={currentPage} onNavigate={handleNavigate} isDarkMode={isDarkMode} />
        )}
      </div>

      {isNumericInputDialogOpen && (
        <NumericInputDialog
          isOpen={isNumericInputDialogOpen}
          onClose={closeNumericInputDialog}
          onEnter={handleNumericInputEnter}
          value={numericInputValue}
          onChange={setNumericInputValue}
          onClear={handleNumericInputClear}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};

export default App;
