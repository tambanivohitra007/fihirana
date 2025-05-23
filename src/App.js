// src/App.js
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ListMusic, Download, XCircle, AlertTriangle, WifiOff, Menu, Star, Info as InfoIconLucide } from 'lucide-react'; // Renamed Info to avoid conflict
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
  const [activeThemeFilter, setActiveThemeFilter] = useState(''); 
  const [activeAuthorFilter, setActiveAuthorFilter] = useState(''); 

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

  const sidebarTitleText = useMemo(() => {
    return isDarkMode ? colors.darkSidebarTitleText : colors.lightSidebarTitleText;
  }, [isDarkMode]);

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
    setIsSidebarOpen(false); // Close sidebar after action
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
    if (page !== 'list') {
        // Reset filters only if navigating away from a view that uses them
        if (currentPage === 'list' && (activeAuthorFilter || activeThemeFilter)) {
            // Keep filters if navigating from list to e.g. about, then back to list
        } else {
            setActiveThemeFilter('');
            setActiveAuthorFilter('');
        }
    }
    setIsSidebarOpen(false);
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
    console.log(`[App.js] renderPage: currentPage='${currentPage}'. selectedHymn ID: ${selectedHymn ? selectedHymn.Id_ : 'null'}`); // Log 4: Check states at render time
    switch (currentPage) {
      case 'list':
        return (
          <>
            <SearchBar
              onSearchChange={(e) => setSearchTerm(e.target.value)}
              searchTerm={searchTerm}
              isDarkMode={isDarkMode} // Pass isDarkMode
            />
            {(activeThemeFilter || activeAuthorFilter) && (
                <div className="mb-4 p-3 rounded-lg text-sm" style={{ background: isDarkMode ? colors.darkCard : colors.lightCard, color: isDarkMode ? colors.darkTextSecondary : colors.lightTextSecondary }}>
                    Mampiseho hira {activeThemeFilter ? `mikasika ny "${activeThemeFilter}"` : ''} {activeAuthorFilter ? `nosoratan'i "${activeAuthorFilter}"` : ''}.
                    <button onClick={() => { setActiveThemeFilter(''); setActiveAuthorFilter(''); setSearchTerm(''); }} className="ml-2 font-semibold" style={{ color: isDarkMode ? colors.darkError : colors.lightError }}>[Esory ny sivana]</button>
                </div>
            )}
            {showInstallButton && (
              <button
                onClick={handleInstallClick}
                className="sm:hidden w-full flex items-center justify-center px-4 py-3 mb-4 rounded-lg transition-colors duration-200"
                title="Hametraka ity fampiharana ity"
                style={{ background: isDarkMode ? colors.darkButtonPrimaryBg : colors.buttonPrimaryBg, color: isDarkMode ? colors.darkButtonPrimaryText : colors.buttonPrimaryText }}
              >
                <Download size={20} className="mr-2" /> Hametraka ny App
              </button>
            )}
            {filteredHymns.length > 0 ? (
              <ul className="space-y-1">
                {filteredHymns.map(hymn => (
                  <HymnListItem 
                    key={hymn.Id_} 
                    hymn={hymn} 
                    onSelect={handleSelectHymn}
                    isFavorite={favorites.includes(hymn.Id_)}
                    onToggleFavorite={toggleFavorite}
                    isDarkMode={isDarkMode} // Pass isDarkMode
                  />
                ))}
              </ul>
            ) : (
              <div className="text-center py-10">
                <InfoIconLucide size={48} className="mx-auto mb-4" style={{ color: isDarkMode ? colors.darkIcon : colors.lightIcon }} />
                <p className="text-xl" style={{ color: isDarkMode ? colors.darkTextSecondary : colors.lightTextSecondary }}>
                  {searchTerm || activeThemeFilter || activeAuthorFilter ? "Tsy nahitana hira mifanaraka amin'ny sivana." : "Tsy misy hira."}
                </p>
              </div>
            )}
          </>
        );
      case 'detail':
        if (selectedHymn) {
          console.log("[App.js] renderPage: Rendering HymnDetail for hymn ID:", selectedHymn.Id_); // Log 5: Confirm attempt to render HymnDetail
          return <HymnDetail hymn={selectedHymn} onBack={handleBackToList} isFavorite={favorites.includes(selectedHymn.Id_)} onToggleFavorite={toggleFavorite} isDarkMode={isDarkMode} />; // Pass isDarkMode
        } else {
          console.log("[App.js] renderPage: In 'detail' case, but selectedHymn is null. Not rendering HymnDetail."); // Log 6: selectedHymn is null
          return (
            <div className="text-center py-10">
              <AlertTriangle size={48} className="mx-auto mb-4" style={{ color: isDarkMode ? colors.darkError : colors.lightError }} />
              <p className="text-xl" style={{ color: isDarkMode ? colors.darkTextSecondary : colors.lightTextSecondary }}>
                Tsy afaka nampiseho ny antsipirian'ny hira. Misy olana angamba.
              </p>
              <button onClick={handleBackToList} className="mt-4 px-4 py-2 rounded" style={{ background: isDarkMode ? colors.darkButtonPrimaryBg : colors.buttonPrimaryBg, color: isDarkMode ? colors.darkButtonPrimaryText : colors.buttonPrimaryText }}>
                Miverina
              </button>
            </div>
          );
        }
      case 'themes':
        return <SelectionListPage title="Misafidy Lohahevitra" items={uniqueThemes} onSelectItem={handleThemeSelect} onBack={() => handleNavigate('list')} isDarkMode={isDarkMode} />; // Pass isDarkMode
      case 'authors':
        return <SelectionListPage title="Misafidy Mpanoratra" items={uniqueAuthors} onSelectItem={handleAuthorSelect} onBack={() => handleNavigate('list')} isDarkMode={isDarkMode} />; // Pass isDarkMode
      case 'favorites':
        return (
            <div className="p-4 md:p-6 rounded-lg shadow-xl" style={{ background: isDarkMode ? colors.darkCard : colors.lightCard, boxShadow: isDarkMode ? colors.darkCardShadow : colors.cardShadow }}>
                <h2 className="text-2xl font-bold mb-4" style={{ color: isDarkMode ? colors.darkPrimary : colors.lightPrimary }}>Hira Ankafizina</h2>
                {favoriteHymns.length > 0 ? (
                    <ul className="space-y-1">
                    {favoriteHymns.map(hymn => (
                        <HymnListItem 
                        key={hymn.Id_} 
                        hymn={hymn} 
                        onSelect={handleSelectHymn}
                        isFavorite={favorites.includes(hymn.Id_)}
                        onToggleFavorite={toggleFavorite}
                        isDarkMode={isDarkMode} // Pass isDarkMode
                        />
                    ))}
                    </ul>
                ) : (
                    <div className="text-center py-10">
                        <Star size={48} className="mx-auto mb-4" style={{ color: isDarkMode ? colors.darkIcon : colors.lightIcon }} />
                        <p className="text-xl" style={{ color: isDarkMode ? colors.darkTextSecondary : colors.lightTextSecondary }}>Tsy mbola misy hira ankafizina.</p>
                        <p className="text-sm mt-2" style={{ color: isDarkMode ? colors.darkTextTertiary : colors.lightTextTertiary }}>Tsindrio ny kisary fo eo akaikin'ny hira na eo amin'ny antsipiriany mba hanampiana azy eto.</p>
                    </div>
                )}
            </div>
        );
      case 'about':
        return <AboutPage onBack={() => handleNavigate('list')} isDarkMode={isDarkMode} />; // Pass isDarkMode
      default:
        return <p>Pejy tsy hita.</p>;
    }
  };

  // Loading and Error States
  if (isLoading) { 
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ background: isDarkMode ? colors.darkBg : colors.lightBg }}>
        <ListMusic className="animate-bounce" size={64} style={{ color: isDarkMode ? colors.darkPrimary : colors.lightPrimary }} />
        <p className="text-xl mt-4" style={{ color: isDarkMode ? colors.darkText : colors.lightText }}>Mandefa ny hira...</p>
      </div>
    );
  }

  if (error || !allHymns.length) { 
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center" style={{ background: isDarkMode ? colors.darkBg : colors.lightBg }}>
        <XCircle size={64} style={{ color: isDarkMode ? colors.darkError : colors.lightError }} />
        <h2 className="text-2xl font-semibold mt-4 mb-2" style={{ color: isDarkMode ? colors.darkText : colors.lightText }}>Loza Kely!</h2>
        <p className="mb-6" style={{ color: isDarkMode ? colors.darkTextSecondary : colors.lightTextSecondary }}>{error || "Tsy misy hira voatahiry ao amin'ny fampiharana."}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 rounded-lg transition-colors duration-200"
          style={{ background: isDarkMode ? colors.darkButtonPrimaryBg : colors.buttonPrimaryBg, color: isDarkMode ? colors.darkButtonPrimaryText : colors.buttonPrimaryText }}
        >
          Avereno Andramana
        </button>
      </div>
    );
  }

  const mainContentPaddingBottom = "pb-20"; // For bottom navigation bar

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'dark' : ''}`} style={{ background: isDarkMode ? colors.darkBg : colors.lightBg, color: isDarkMode ? colors.darkText : colors.lightText }}>
      <SidebarMenu 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        onNavigate={handleNavigate}
        onToggleDarkMode={toggleDarkMode}
        isDarkMode={isDarkMode}
        currentPage={currentPage} // Pass currentPage
        onOpenNumericInput={openNumericInputDialog} // Pass function to open numeric input dialog
      />
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-64 xl:ml-72' : 'lg:ml-0'}`}>
        <header
          className="border-b shadow-xl sticky top-0 z-30"
          style={{
            background: isDarkMode ? colors.darkGradient : colors.lightGradient,
            color: isDarkMode ? colors.darkText : colors.lightText, // Ensure header text color contrasts with dark gradient
            borderColor: isDarkMode ? colors.darkBorder : colors.lightBorder,
            backdropFilter: 'blur(12px)'
          }}
        >
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="p-2 rounded-full text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-sky-400 transition lg:hidden shadow-md backdrop-blur-md"
              style={{ color: isDarkMode ? colors.darkText : colors.lightText }} // Ensure menu icon color is appropriate
            >
              <Menu size={28} />
            </button>
            <button // Make this section clickable
              onClick={openNumericInputDialog}
              className="flex items-center gap-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-300 rounded-md p-1 -ml-1" // Added focus styles and padding
              title="Hitady hira araka ny laharany"
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/20 shadow-lg ring-2 ring-sky-400">
                <ListMusic size={28} className="text-sky-200" />
              </span>
              <span className="text-lg font-bold tracking-tight" style={{ color: sidebarTitleText }}>Fihirana</span>
            </button>
            {showInstallButton && (
              <button
                onClick={handleInstallClick}
                className="hidden sm:flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors duration-200 text-sm font-semibold shadow focus:outline-none focus:ring-2 focus:ring-sky-400"
                title="Hametraka ity fampiharana ity"
                style={{ color: isDarkMode ? colors.darkText : colors.lightText }} // Ensure install button text color is appropriate
              >
                <Download size={18} className="mr-2" /> Hametraka
              </button>
            )}
          </div>
        </header>

        {isOffline && (
          <div className="p-4" role="alert" style={{ background: isDarkMode ? colors.darkWarningBg : colors.lightWarningBg, color: isDarkMode ? colors.darkWarningText : colors.lightWarningText, borderColor: isDarkMode ? colors.darkWarningBorder : colors.lightWarningBorder }}>
            <div className="flex items-center">
              <WifiOff size={20} className="mr-2" />
              <p className="font-bold">Tsy misy internet!</p>
            </div>
            <p className="text-sm">Mampiasa angona voatahiry ity fampiharana ity.</p>
          </div>
        )}
        
        <main className={`flex-1 container mx-auto p-4 md:p-6 ${mainContentPaddingBottom}`}>
          {renderPage()}
        </main>

        <NumericInputDialog
          isOpen={isNumericInputDialogOpen}
          onClose={closeNumericInputDialog}
          onEnter={handleNumericInputEnter}
          value={numericInputValue}
          setValue={setNumericInputValue}
          onClear={handleNumericInputClear}
          isDarkMode={isDarkMode}
        />
        
        <BottomNavigationBar 
            onNavigate={handleNavigate} 
            currentPage={currentPage}
            isDarkMode={isDarkMode} // Pass isDarkMode
        />
        
        <footer className="text-center p-4 mt-auto transition-all duration-300 ease-in-out" style={{ background: isDarkMode ? colors.darkFooterBg : colors.lightCard, color: isDarkMode ? colors.darkTextSecondary : colors.lightTextSecondary, borderTop: isDarkMode ? `1px solid ${colors.darkBorder}`: 'none' }}>
          <p className="text-sm">
            Fihirana PWA &copy; {new Date().getFullYear()}. Namboarina tamim-pitiavana. 
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
