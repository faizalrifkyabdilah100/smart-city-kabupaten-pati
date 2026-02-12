import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { services } from '../../data/services';
import logoSmartCity from '../../assets/images/logo-smart-city2.png';

const DockMenu: React.FC = () => {
  const [hoveredDoc, setHoveredDoc] = useState<number | null>(null);
  const navigate = useNavigate();

  // Buat home item
  const homeItem = {
    id: 0,
    title: 'Home',
    icon: logoSmartCity,
    path: '/'
  };

  // Ambil semua item KECUALI Login (id: 1), urutkan sesuai keinginan
  const dockOrder = [5, 4, 3, 2]; // Kominfo, Kesehatan, Infrastruktur, Lingkungan Hidup
  const orderedServices = dockOrder
    .map(id => services.find(item => item.id === id))
    .filter(Boolean) as typeof services;
  const dockItems = [homeItem, ...orderedServices];

  // Fungsi saat icon diklik
  const handleDockClick = (path?: string) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <div className="w-full flex justify-center pb-4 sm:pb-6 md:pb-8 lg:pb-10">
      <div className="flex items-end gap-3 sm:gap-4 md:gap-6 lg:gap-8 px-3 sm:px-4">
        {dockItems.map((item) => (
          <div
            key={item.id}
            className="group relative flex flex-col items-center"
            onMouseEnter={() => setHoveredDoc(item.id)}
            onMouseLeave={() => setHoveredDoc(null)}
            onClick={() => handleDockClick(item.path)}
          >
            {/* Tooltip */}
            <div className={`absolute -top-10 sm:-top-12 md:-top-14 bg-slate-900/90 text-cyan-400 text-[9px] sm:text-[10px] md:text-xs font-bold tracking-widest uppercase px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all duration-300 transform whitespace-nowrap ${hoveredDoc === item.id ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-90 pointer-events-none'}`}>
              {item.title}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45 border-r border-b border-cyan-500/30"></div>
            </div>

            {/* Icon */}
            <div className={`relative transition-all duration-300 cubic-bezier(0.25, 0.46, 0.45, 0.94) cursor-pointer ${hoveredDoc === item.id ? 'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 -translate-y-3 sm:-translate-y-4' : 'w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 translate-y-0'}`}>
              <div className={`absolute inset-0 bg-cyan-400/20 rounded-full blur-xl transition-opacity duration-300 ${hoveredDoc === item.id ? 'opacity-100 scale-125' : 'opacity-0 scale-0'}`}></div>
              <img src={item.icon} alt={item.title} className="w-full h-full object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] filter transition-all duration-300" />
              <div className={`absolute -bottom-3 sm:-bottom-4 left-2 right-2 h-1 bg-black/40 rounded-[100%] blur-sm transition-all duration-300 ${hoveredDoc === item.id ? 'w-[80%] mx-auto opacity-30 scale-75' : 'w-full opacity-60'}`}></div>
            </div>

            {/* Indikator */}
            <div className={`mt-2 sm:mt-3 w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full transition-all duration-500 ${hoveredDoc === item.id ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)] scale-150' : 'bg-white/20'}`}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DockMenu;