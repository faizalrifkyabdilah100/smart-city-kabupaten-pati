import React from 'react';
import { useTheme } from '../../hooks/useTheme';

const ThemeToggle: React.FC = () => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className={`
        relative w-14 h-7 sm:w-16 sm:h-8 rounded-full p-1 
        transition-all duration-500 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${isDark
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 focus:ring-purple-400 focus:ring-offset-slate-900 shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                    : 'bg-gradient-to-r from-amber-400 to-orange-400 focus:ring-amber-400 focus:ring-offset-white shadow-[0_0_15px_rgba(251,191,36,0.4)]'
                }
      `}
            title={isDark ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {/* Sliding Circle */}
            <div
                className={`
          absolute top-[3px] sm:top-[3px] w-[22px] h-[22px] sm:w-[26px] sm:h-[26px] 
          rounded-full shadow-lg
          transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]
          flex items-center justify-center
          ${isDark
                        ? 'translate-x-[25px] sm:translate-x-[29px] bg-indigo-900'
                        : 'translate-x-[1px] bg-white'
                    }
        `}
            >
                {/* Moon Icon (Dark Mode) */}
                <svg
                    className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-all duration-500 ${isDark ? 'opacity-100 rotate-0 scale-100 text-yellow-300' : 'opacity-0 rotate-90 scale-50 text-yellow-300'}`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>

                {/* Sun Icon (Light Mode) */}
                <svg
                    className={`w-3 h-3 sm:w-3.5 sm:h-3.5 absolute transition-all duration-500 ${!isDark ? 'opacity-100 rotate-0 scale-100 text-amber-500' : 'opacity-0 -rotate-90 scale-50 text-amber-500'}`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                </svg>
            </div>

            {/* Sparkle effects */}
            <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full transition-all duration-700 ${isDark ? 'bg-purple-400 opacity-60 animate-ping' : 'bg-amber-300 opacity-60 animate-ping'}`} />
            <div className={`absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 rounded-full transition-all duration-700 delay-300 ${isDark ? 'bg-indigo-400 opacity-40 animate-ping' : 'bg-orange-300 opacity-40 animate-ping'}`} />
        </button>
    );
};

export default ThemeToggle;
