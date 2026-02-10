import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  show: boolean;
  showLogout?: boolean;
}

type UserInfo = {
  id?: number;
  username?: string;
  nama?: string;
  role?: string;
  opd?: string;
};

const Navbar: React.FC<Props> = ({ show, showLogout = true }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    // Fungsi untuk update user dari localStorage
    const updateUser = () => {
      try {
        const raw = localStorage.getItem('user_data');
        if (raw) setUser(JSON.parse(raw));
        else setUser(null);
      } catch (e) {
        setUser(null);
      }
    };

    // Update saat mount
    updateUser();

    // Listen untuk perubahan storage (dari tab lain atau PopupView)
    const handleStorageChange = () => {
      updateUser();
    };

    // Listen untuk custom event dari PopupView
    const handleLoginSuccess = () => {
      updateUser();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('user_login_success', handleLoginSuccess as EventListener);
    window.addEventListener('user_logout_success', handleLoginSuccess as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('user_login_success', handleLoginSuccess as EventListener);
      window.removeEventListener('user_logout_success', handleLoginSuccess as EventListener);
    };
  }, []);

  const handleUserIconClick = () => {
    navigate('/manajemen-user');
  };

  const handleLogout = () => {
    localStorage.removeItem('user_data');
    setUser(null);
    
    // Trigger event untuk update UI
    window.dispatchEvent(new Event('user_logout_success'));
    
    navigate('/');
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-40 flex flex-col items-center pt-10 transition-all duration-500 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}
    >
      <h1 className="text-white text-4xl md:text-6xl font-light tracking-wide drop-shadow-lg text-center leading-tight">
        Selamat Datang di <span className="font-black text-yellow-400 drop-shadow-[0_2px_10px_rgba(250,204,21,0.6)]">SMART CITY</span>
      </h1>

      <div className="mt-6 flex items-center gap-4">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2.5 rounded-full shadow-xl hover:bg-white/20 transition-colors cursor-default">
           <span className="text-white text-sm md:text-base font-bold tracking-[0.3em] drop-shadow-md">
              KABUPATEN PATI
           </span>
        </div>

        <div className="ml-2 flex items-center gap-3">
          {user ? (
            <>
              {/* Info User dan Icon User */}
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-sm text-slate-200">
                    <span className="font-semibold">{user.nama || user.username}</span>
                  </div>
                  <div className="text-xs text-slate-300">{user.role?.toUpperCase() || '-'}</div>
                </div>
                
                {/* Icon User - Clickable */}
                <button 
                  onClick={handleUserIconClick}
                  className="ml-2 p-2.5 bg-blue-600 hover:bg-blue-500 rounded-full transition-colors shadow-lg hover:shadow-blue-500/50 flex items-center justify-center"
                  title="Buka Manajemen User"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </button>
              </div>
              
              {/* Logout Button - Hanya tampil jika showLogout true */}
              {showLogout && (
                <button 
                  onClick={handleLogout} 
                  className="text-sm bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-md shadow-sm transition-colors"
                >
                  Logout
                </button>
              )}
            </>
          ) : (
            <>
              {/* Icon Login - Clickable */}
              <button 
                onClick={() => navigate('/login')}
                className="p-2.5 bg-blue-600 hover:bg-blue-500 rounded-full transition-colors shadow-lg hover:shadow-blue-500/50 flex items-center justify-center"
                title="Login"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </button>
              <span className="text-sm text-slate-300">Login</span>
            </>
          )}
        </div>
      </div>

    </nav>
  );
};

export default Navbar;