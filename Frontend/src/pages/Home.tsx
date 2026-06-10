import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { services } from '../data/services';
import { type Service } from '../types';
import ServiceCard from '../components/common/ServiceCard';
import Navbar from '../components/layout/Navbar';
import SmartCityLayout from '../components/layout/SmartCityLayout';
import logoSmartCity from '../assets/images/logo-smart-city2.png';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

const Home: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const user = useAuth();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  // Modifikasi services berdasarkan login status
  const displayServices = services.map((item) => {
    if (item.title === 'Login' && user) {
      return {
        ...item,
        title: 'Manajemen User',
        icon: '/user.png',
        path: '/manajemen-user'
      };
    }
    if (item.title === 'Login' && !user) {
      return item;
    }
    return item;
  });

  // FUNGSI NAVIGASI
  const handleCardClick = (item: Service) => {
    if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <SmartCityLayout showDock={false}>

      {/* Container Utama Home */}
      <div className="flex-1 flex items-center justify-center relative z-10">

        {/* Navbar (Sembunyi kalau lagi hover/popup) */}
        <Navbar show={!isHovered} />

        {/* === ORBIT SYSTEM === */}
        {/* Responsive: scale down on smaller screens */}
        <div
          className={`relative flex items-center justify-center 
            w-[400px] h-[400px] 
            sm:w-[550px] sm:h-[550px] 
            md:w-[700px] md:h-[700px] 
            lg:w-[900px] lg:h-[900px] 
            transition-all duration-700 ease-in-out`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => {
            // Untuk mobile: toggle isHovered on tap
            if (window.innerWidth < 768) {
              setIsHovered(!isHovered);
            }
          }}
        >
          {/* Garis Lingkaran Orbit */}
          <div className={`absolute 
            w-[320px] h-[320px] 
            sm:w-[420px] sm:h-[420px] 
            md:w-[550px] md:h-[550px] 
            lg:w-[680px] lg:h-[680px] 
            border rounded-full transition-all duration-700 border-white/20 ${isHovered ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}></div>

          {/* === LOGO TENGAH === */}
          <div className={`absolute z-20 flex flex-col items-center justify-center transition-all duration-700 ease-out ${isHovered ? 'scale-100' : 'scale-125'}`}>
            <div className={`absolute inset-0 bg-radial-gradient rounded-full from-white/20 to-transparent blur-3xl transition-all duration-500 ${isHovered ? 'w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96 opacity-60' : 'w-40 h-40 sm:w-56 sm:h-56 lg:w-80 lg:h-80 opacity-40 animate-pulse'}`}></div>

            <div className="relative w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-80 lg:h-80 flex items-center justify-center transition-all duration-500 z-50">
              <img src={logoSmartCity} alt="Smart City Logo" className="w-full h-full object-contain drop-shadow-[0_0_25px_rgba(255,255,255,0.5)]" />
            </div>

            <div className="absolute -bottom-12 sm:-bottom-14 lg:-bottom-16 flex flex-col items-center transition-all duration-300 w-full">
              <span className="text-sm sm:text-base md:text-lg lg:text-xl font-extrabold tracking-[0.15em] sm:tracking-[0.2em] uppercase pb-2 whitespace-nowrap text-yellow-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] border-b-2 border-yellow-400/50">
                Portal Layanan Terpadu
              </span>
              <span className={`text-[8px] sm:text-[10px] mt-2 sm:mt-3 tracking-widest uppercase font-semibold px-2 sm:px-3 py-1 rounded-full backdrop-blur-sm border text-cyan-200 bg-black/20 border-white/10 transition-all duration-500 ${isHovered ? 'opacity-0 translate-y-5' : 'opacity-100 animate-bounce'}`}>
                Sentuh Untuk Akses Menu
              </span>
            </div>
          </div>

          {/* === ITEMS ORBIT (MENU) === */}
          {displayServices.map((item) => (
            <div
              key={item.id}
              onClick={(e) => {
                if (isHovered) {
                  e.stopPropagation();
                  handleCardClick(item);
                }
              }}
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
              style={{ pointerEvents: 'auto' }}
            >
              <ServiceCard service={item} show={isHovered} />
            </div>
          ))}
        </div>


        {/* Footer Logo Kecil */}
        <div className={`absolute bottom-4 right-4 sm:bottom-6 sm:right-6 opacity-80 hover:opacity-100 transition-all duration-500 cursor-pointer z-50`}>
          <div className="w-10 h-10 sm:w-12 sm:h-12 backdrop-blur-sm rounded-lg shadow-lg flex items-center justify-center p-1.5 sm:p-2 border bg-white/10 border-white/20">
            <img src={logoSmartCity} alt="logo footer" className="w-full h-full object-contain" />
          </div>
        </div>

      </div>
    </SmartCityLayout>
  );
};

export default Home;