import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { logoutUser } from '../../utils/auth';
import { useTheme } from '../../hooks/useTheme';
import ThemeToggle from '../common/ThemeToggle';

interface Props {
  show: boolean;
  showLogout?: boolean;
}

const Navbar: React.FC<Props> = ({ show, showLogout = true }) => {
  const navigate = useNavigate();
  const user = useAuth();
  const { isDark } = useTheme();

  const handleUserIconClick = () => navigate('/manajemen-user');

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 flex flex-col items-center pt-4 sm:pt-6 md:pt-8 lg:pt-10 px-3 sm:px-6 transition-all duration-500 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}
    >
      {/* Judul Utama */}
      <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-6xl font-light tracking-wide drop-shadow-lg text-center leading-tight text-white">
        Selamat Datang di{' '}
        <span className="font-black text-yellow-400 drop-shadow-[0_2px_10px_rgba(250,204,21,0.6)]">
          SMART CITY
        </span>
      </h1>

      <div className="mt-3 sm:mt-4 md:mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-4">
        {/* Badge Kabupaten */}
        <div className="backdrop-blur-md px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 rounded-full shadow-xl cursor-default bg-white/10 border border-white/20 hover:bg-white/20 transition-colors duration-500">
          <span className="text-[10px] sm:text-xs md:text-sm lg:text-base font-bold tracking-[0.2em] sm:tracking-[0.3em] drop-shadow-md text-white">
            KABUPATEN DEMAK
          </span>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-2">
                <div className="text-right hidden sm:block">
                  <div className={`text-xs sm:text-sm ${isDark ? 'text-blue-50' : 'text-white/90'}`}>
                    <span className="font-semibold">{user.nama || user.username}</span>
                  </div>
                  <div className={`text-[10px] sm:text-xs ${isDark ? 'text-blue-200' : 'text-white/70'}`}>
                    {user.role?.toUpperCase() || '-'}
                  </div>
                </div>

                <button
                  onClick={handleUserIconClick}
                  className="p-2 sm:p-2.5 bg-blue-600 hover:bg-blue-500 rounded-full transition-colors shadow-lg hover:shadow-blue-500/50 flex items-center justify-center"
                  aria-label="Buka Manajemen User"
                  title="Buka Manajemen User"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </button>
              </div>

              {showLogout && (
                <button
                  onClick={handleLogout}
                  className="text-[10px] sm:text-sm bg-red-600 hover:bg-red-500 text-white px-2 sm:px-3 py-1 rounded-md shadow-sm transition-colors"
                >
                  Logout
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="p-2 sm:p-2.5 rounded-full transition-colors shadow-lg flex items-center justify-center bg-blue-600 hover:bg-blue-500 hover:shadow-blue-500/50"
                aria-label="Login"
                title="Login"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </button>
              <span className="text-xs sm:text-sm text-blue-100">
                Login
              </span>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
