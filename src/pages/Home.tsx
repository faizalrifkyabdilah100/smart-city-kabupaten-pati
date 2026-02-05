import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { services, type Service } from '../data/services';
import ServiceCard from '../components/ServiceCard';
import Navbar from '../components/Navbar';
import PopupView from '../components/PopupView';
import SmartCityLayout from '../components/SmartCityLayout'; // Import Layout Baru
import logoSmartCity from '../assets/logo-smart-city2.png';

const Home: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const navigate = useNavigate();

  // MousePos sudah tidak perlu di sini lagi karena sudah diurus Layout

  const handleCardClick = (item: Service) => {
    if (item.path) {
      navigate(item.path);
    } else {
      setActivePopup(item.title);
    }
  };

  return (
    // BUNGKUS DENGAN LAYOUT
    <SmartCityLayout>
      
      {/* Konten Home langsung di sini (tanpa background div lagi) */}
      <div className="flex-1 flex items-center justify-center">
        
        {/* Navbar */}
        <Navbar show={!isHovered && !activePopup} />

        {/* === ORBIT SYSTEM === */}
        {/* Note: Kita pakai static position atau sesuaikan styling sedikit agar center */}
        <div 
          className={`relative flex items-center justify-center w-[900px] h-[900px] transition-all duration-700 ease-in-out ${activePopup ? 'scale-150 opacity-0 pointer-events-none blur-sm' : 'scale-100 opacity-100'}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Garis Lingkaran Orbit */}
          <div className={`absolute w-[680px] h-[680px] border border-white/20 rounded-full transition-all duration-700 ${isHovered ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}></div>

          {/* === LOGO TENGAH === */}
          <div className={`absolute z-20 flex flex-col items-center justify-center transition-all duration-700 ease-out ${isHovered ? 'scale-100' : 'scale-125'}`}>
            <div className={`absolute inset-0 bg-radial-gradient from-white/20 to-transparent blur-3xl rounded-full transition-all duration-500 ${isHovered ? 'w-96 h-96 opacity-60' : 'w-80 h-80 opacity-40 animate-pulse'}`}></div>
            <div className="relative w-80 h-80 flex items-center justify-center transition-all duration-500 z-50">
              <img src={logoSmartCity} alt="Smart City Logo" className="w-full h-full object-contain drop-shadow-[0_0_25px_rgba(255,255,255,0.5)]" />
            </div>
            <div className="absolute -bottom-16 flex flex-col items-center transition-all duration-300 w-full">
               <span className="text-lg md:text-xl text-yellow-400 font-extrabold tracking-[0.2em] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] border-b-2 border-yellow-400/50 pb-2 whitespace-nowrap">
                 Portal Layanan Terpadu
               </span>
               <span className={`text-[10px] text-cyan-200 mt-3 tracking-widest uppercase font-semibold bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10 transition-all duration-500 ${isHovered ? 'opacity-0 translate-y-5' : 'opacity-100 animate-bounce'}`}>
                 Sentuh Untuk Akses Menu
               </span>
            </div>
          </div>

          {/* KARTU LAYANAN */}
          {services.map((item) => (
            <div 
               key={item.id} 
               onClick={() => handleCardClick(item)} 
               className="absolute inset-0 flex items-center justify-center"
               style={{ pointerEvents: activePopup ? 'none' : 'auto' }}
            >
                <ServiceCard service={item} show={isHovered} />
            </div>
          ))}
        </div>

        <PopupView type={activePopup} onClose={() => setActivePopup(null)} />
        
        {/* Footer Logo */}
        <div className={`absolute bottom-6 right-6 opacity-80 hover:opacity-100 transition-all duration-500 cursor-pointer z-50 ${activePopup ? 'translate-y-20 opacity-0' : ''}`}>
          <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg shadow-lg flex items-center justify-center p-2 border border-white/20">
              <img src={logoSmartCity} alt="logo footer" className="w-full h-full object-contain" />
          </div>
        </div>

      </div>
    </SmartCityLayout>
  );
};

export default Home;