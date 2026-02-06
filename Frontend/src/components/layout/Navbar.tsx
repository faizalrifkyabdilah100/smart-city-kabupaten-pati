import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  show: boolean;
}

type UserInfo = {
  id?: number;
  username?: string;
  nama?: string;
  role?: string;
  opd?: string;
};

const Navbar: React.FC<Props> = ({ show }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user_data');
      if (raw) setUser(JSON.parse(raw));
      else setUser(null);
    } catch (e) {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_data');
    // optional: remove other auth keys if any
    navigate('/login');
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
              <div className="text-sm text-slate-200">Anda: <span className="font-semibold">{user.nama || user.username}</span></div>
              <div className="text-xs text-slate-300 px-3 py-1 rounded-full bg-white/5 border border-white/10">{user.role?.toUpperCase() || '-'}</div>
              <button onClick={handleLogout} className="text-sm bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-md shadow-sm">Logout</button>
            </>
          ) : (
            <button onClick={() => navigate('/login')} className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-md">Login</button>
          )}
        </div>
      </div>

    </nav>
  );
};

export default Navbar;