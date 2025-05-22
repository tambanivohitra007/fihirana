import React from 'react';
import { Home, Tag, Users, Star } from 'lucide-react';

const BottomNavigationBar = ({ onNavigate, currentPage }) => {
    const navItems = [
        { name: 'list', label: 'Hira', icon: Home },
        { name: 'themes', label: 'Lohahevitra', icon: Tag },
        { name: 'authors', label: 'Mpanoratra', icon: Users },
        { name: 'favorites', label: 'Ankafizina', icon: Star },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-sky-700 via-sky-600 to-sky-500 dark:bg-gradient-to-t dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-white shadow-t-md z-40 lg:hidden">
            <ul className="flex justify-around items-center h-16">
                {navItems.map(item => (
                    <li key={item.name} className="flex-1">
                        <button
                            onClick={() => onNavigate(item.name)}
                            className={`flex flex-col items-center justify-center w-full h-full p-2 rounded-none transition-colors duration-200 
                                        ${currentPage === item.name ? 'bg-sky-700 dark:bg-sky-900' : 'hover:bg-sky-500 dark:hover:bg-sky-700'}`}
                        >
                            <item.icon size={22} className="mb-0.5" />
                            <span className="text-xs">{item.label}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default BottomNavigationBar;
