// src/App.js
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ListMusic, Download, XCircle, AlertTriangle, WifiOff, Menu, Star, Info as InfoIconLucide } from 'lucide-react'; // Renamed Info to avoid conflict

// Import separated components
import HymnListItem from './components/HymnListItem';
import HymnDetail from './components/HymnDetail';
import SearchBar from './components/SearchBar';
import SidebarMenu from './components/SidebarMenu';
import BottomNavigationBar from './components/BottomNavigationBar';
import SelectionListPage from './components/SelectionListPage';
import AboutPage from './components/AboutPage'; // Assuming AboutPage.js is in src/components/

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

  // Favorites state
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('fihiranaFavorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

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
      name: "Fihirana PWA (Static)",
      icons: [
        { src: "https://placehold.co/192x192/0077b6/ffffff?text=Fs", type: "image/png", sizes: "192x192", purpose: "any maskable" },
        { src: "https://placehold.co/512x512/0077b6/ffffff?text=FihiranaS", type: "image/png", sizes: "512x512", purpose: "any maskable" }
      ],
      start_url: ".",
      display: "standalone",
      theme_color: "#0077b6",
      background_color: "#ffffff",
      description: "Fampiharana hijerena ny hira ao amin'ny Fihirana FFPM (static data)."
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

  // Navigation and Selection Handlers
  const handleSelectHymn = useCallback((hymn) => {
    setSelectedHymn(hymn);
    setCurrentPage('detail');
    setIsSidebarOpen(false); 
    window.scrollTo(0, 0);
  }, []);

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
    switch (currentPage) {
      case 'list':
        return (
          <>
            <SearchBar
              onSearchChange={(e) => setSearchTerm(e.target.value)}
              searchTerm={searchTerm}
            />
            {(activeThemeFilter || activeAuthorFilter) && (
                <div className="mb-4 p-3 bg-sky-100 dark:bg-slate-700 rounded-lg text-sm text-sky-700 dark:text-sky-300">
                    Mampiseho hira {activeThemeFilter ? `mikasika ny "${activeThemeFilter}"` : ''} {activeAuthorFilter ? `nosoratan'i "${activeAuthorFilter}"` : ''}.
                    <button onClick={() => { setActiveThemeFilter(''); setActiveAuthorFilter(''); setSearchTerm(''); }} className="ml-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold">[Esory ny sivana]</button>
                </div>
            )}
            {showInstallButton && (
              <button
                onClick={handleInstallClick}
                className="sm:hidden w-full flex items-center justify-center px-4 py-3 mb-4 bg-sky-500 hover:bg-sky-400 text-white rounded-lg transition-colors duration-200"
                title="Hametraka ity fampiharana ity"
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
                  />
                ))}
              </ul>
            ) : (
              <div className="text-center py-10">
                <InfoIconLucide size={48} className="mx-auto text-slate-400 dark:text-slate-500 mb-4" />
                <p className="text-xl text-slate-600 dark:text-slate-400">
                  {searchTerm || activeThemeFilter || activeAuthorFilter ? "Tsy nahitana hira mifanaraka amin'ny sivana." : "Tsy misy hira."}
                </p>
              </div>
            )}
          </>
        );
      case 'detail':
        return selectedHymn && <HymnDetail hymn={selectedHymn} onBack={handleBackToList} isFavorite={favorites.includes(selectedHymn.Id_)} onToggleFavorite={toggleFavorite} />;
      case 'themes':
        return <SelectionListPage title="Misafidy Lohahevitra" items={uniqueThemes} onSelectItem={handleThemeSelect} onBack={() => handleNavigate('list')} />;
      case 'authors':
        return <SelectionListPage title="Misafidy Mpanoratra" items={uniqueAuthors} onSelectItem={handleAuthorSelect} onBack={() => handleNavigate('list')} />;
      case 'favorites':
        return (
            <div className="p-4 md:p-6 bg-white dark:bg-slate-800 rounded-lg shadow-xl">
                <h2 className="text-2xl font-bold text-sky-700 dark:text-sky-400 mb-4">Hira Ankafizina</h2>
                {favoriteHymns.length > 0 ? (
                    <ul className="space-y-1">
                    {favoriteHymns.map(hymn => (
                        <HymnListItem 
                        key={hymn.Id_} 
                        hymn={hymn} 
                        onSelect={handleSelectHymn}
                        isFavorite={favorites.includes(hymn.Id_)}
                        onToggleFavorite={toggleFavorite}
                        />
                    ))}
                    </ul>
                ) : (
                    <div className="text-center py-10">
                        <Star size={48} className="mx-auto text-slate-400 dark:text-slate-500 mb-4" />
                        <p className="text-xl text-slate-600 dark:text-slate-400">Tsy mbola misy hira ankafizina.</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Tsindrio ny kisary fo eo akaikin'ny hira na eo amin'ny antsipiriany mba hanampiana azy eto.</p>
                    </div>
                )}
            </div>
        );
      case 'about':
        return <AboutPage onBack={() => handleNavigate('list')} />;
      default:
        return <p>Pejy tsy hita.</p>;
    }
  };

  // Loading and Error States
  if (isLoading) { 
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center p-4">
        <ListMusic className="text-sky-600 dark:text-sky-400 animate-bounce" size={64} />
        <p className="text-xl text-slate-700 dark:text-slate-300 mt-4">Mandefa ny hira...</p>
      </div>
    );
  }

  if (error || !allHymns.length) { 
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
        <XCircle className="text-red-500 dark:text-red-400" size={64} />
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mt-4 mb-2">Loza Kely!</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">{error || "Tsy misy hira voatahiry ao amin'ny fampiharana."}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors duration-200"
        >
          Avereno Andramana
        </button>
      </div>
    );
  }

  const mainContentPaddingBottom = "pb-20"; // For bottom navigation bar

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'dark' : ''} bg-slate-100 dark:bg-slate-900`}>
      <SidebarMenu 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        onNavigate={handleNavigate}
        onToggleDarkMode={toggleDarkMode}
        isDarkMode={isDarkMode}
      />
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-64 xl:ml-72' : 'lg:ml-0'}`}>
        <header className="bg-sky-600 dark:bg-sky-800 text-white shadow-md sticky top-0 z-30">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="p-2 rounded-md text-white hover:bg-sky-500 dark:hover:bg-sky-700 lg:hidden"
            >
              <Menu size={28} />
            </button>
            <div className="flex items-center">
              <ListMusic size={28} className="mr-3 hidden sm:block" /> 
              <h1 className="text-xl sm:text-2xl font-bold">Fihirana FFPM</h1>
            </div>
            {showInstallButton && (
              <button
                onClick={handleInstallClick}
                className="hidden sm:flex items-center px-3 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-lg transition-colors duration-200 text-sm"
                title="Hametraka ity fampiharana ity"
              >
                <Download size={18} className="mr-2" /> Hametraka
              </button>
            )}
          </div>
        </header>

        {isOffline && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 dark:bg-yellow-700 dark:text-yellow-100 dark:border-yellow-300" role="alert">
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

        <BottomNavigationBar 
            onNavigate={handleNavigate} 
            currentPage={currentPage}
        />
        
        <footer className={`bg-slate-200 dark:bg-slate-800 text-center p-4 mt-auto transition-all duration-300 ease-in-out ${isSidebarOpen && 'lg:ml-64 xl:ml-72'}`}>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Fihirana PWA &copy; {new Date().getFullYear()}. Namboarina tamim-pitiavana.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
