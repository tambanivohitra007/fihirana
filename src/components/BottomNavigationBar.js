import React from 'react';
import { Home, Tag, Users, Star } from 'lucide-react';
import colors from '../colors';

const BottomNavigationBar = ({ onNavigate, currentPage, isDarkMode }) => {
    const navItems = [
        { name: 'list', label: 'Hira', icon: Home },
        { name: 'themes', label: 'Lohahevitra', icon: Tag },
        { name: 'authors', label: 'Mpanoratra', icon: Users },
        { name: 'favorites', label: 'Ankafizina', icon: Star },
    ];

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-40 flex justify-around items-center h-16 shadow-2xl backdrop-blur-md lg:hidden"
            style={{ 
                background: isDarkMode ? colors.darkBottomNavBg : colors.lightGradient, 
                color: isDarkMode ? colors.darkBottomNavText : colors.lightText 
            }}
        >
            <ul className="flex justify-around items-center h-16 w-full"> {/* Added w-full */}
                {navItems.map(item => (
                    <li key={item.name} className="flex-1">
                        <button
                            onClick={() => onNavigate(item.name)}
                            className={`flex flex-col items-center justify-center w-full h-full p-2 rounded-xl font-semibold transition-all duration-200 group 
                                ${currentPage === item.name 
                                    ? (isDarkMode ? 'bg-white/10 text-sky-300' : 'bg-white/20 text-sky-100 shadow-lg ring-2 ring-sky-300') 
                                    : (isDarkMode ? 'text-slate-400 hover:bg-white/5 hover:text-sky-400' : 'text-white hover:bg-white/10 hover:text-sky-100')}`}
                        >
                            <item.icon 
                                size={22} 
                                className={`mb-0.5 ${currentPage === item.name 
                                    ? (isDarkMode ? 'text-sky-300' : 'text-sky-100') 
                                    : (isDarkMode ? 'text-slate-400 group-hover:text-sky-400' : 'text-white group-hover:text-sky-100')}`}
                            />
                            <span 
                                className={`text-xs tracking-wide ${currentPage === item.name 
                                    ? (isDarkMode ? 'text-sky-300' : 'text-white') 
                                    : (isDarkMode ? 'text-slate-400 group-hover:text-sky-400' : 'text-white')}`}
                            >
                                {item.label}
                            </span>
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default BottomNavigationBar;
