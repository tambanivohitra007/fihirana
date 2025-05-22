import React from 'react';
import { X, Home, Info as InfoIcon, Moon, Sun, Users, Star, Tag } from 'lucide-react';

const SidebarMenu = ({ isOpen, onClose, onNavigate, onToggleDarkMode, isDarkMode }) => {
  if (!isOpen && window.innerWidth < 1024) return null;

  return (
    <>
      {isOpen && <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out lg:hidden"
        onClick={onClose}
      ></div>}
      <div className={`fixed top-0 left-0 w-64 sm:w-72 h-full bg-gradient-to-b from-sky-600 via-sky-500 to-sky-700 dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-white p-6 shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:sticky lg:h-screen lg:shadow-none`}>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Fihirana Menu</h2>
          <button onClick={onClose} className="lg:hidden text-sky-200 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <nav>
          <ul>
            <li className="mb-3">
              <button onClick={() => onNavigate('list')} className="flex items-center w-full text-left px-3 py-2.5 rounded-md hover:bg-sky-600 dark:hover:bg-sky-800 transition-colors">
                <Home size={20} className="mr-3" /> Hira Rehetra
              </button>
            </li>
            <li className="mb-3">
              <button onClick={() => onNavigate('themes')} className="flex items-center w-full text-left px-3 py-2.5 rounded-md hover:bg-sky-600 dark:hover:bg-sky-800 transition-colors">
                <Tag size={20} className="mr-3" /> Lohahevitra
              </button>
            </li>
            <li className="mb-3">
              <button onClick={() => onNavigate('authors')} className="flex items-center w-full text-left px-3 py-2.5 rounded-md hover:bg-sky-600 dark:hover:bg-sky-800 transition-colors">
                <Users size={20} className="mr-3" /> Mpanoratra
              </button>
            </li>
            <li className="mb-3">
              <button onClick={() => onNavigate('favorites')} className="flex items-center w-full text-left px-3 py-2.5 rounded-md hover:bg-sky-600 dark:hover:bg-sky-800 transition-colors">
                <Star size={20} className="mr-3" /> Ankafizina
              </button>
            </li>
            <li className="mb-3">
              <button onClick={() => onNavigate('about')} className="flex items-center w-full text-left px-3 py-2.5 rounded-md hover:bg-sky-600 dark:hover:bg-sky-800 transition-colors">
                <InfoIcon size={20} className="mr-3" /> Momba ny App
              </button>
            </li>
            <li className="mb-3 border-t border-sky-600 dark:border-sky-700 pt-3">
              <button onClick={onToggleDarkMode} className="flex items-center w-full text-left px-3 py-2.5 rounded-md hover:bg-sky-600 dark:hover:bg-sky-800 transition-colors">
                {isDarkMode ? <Sun size={20} className="mr-3" /> : <Moon size={20} className="mr-3" />}
                {isDarkMode ? "Hazavana" : "Maizina"}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default SidebarMenu;
