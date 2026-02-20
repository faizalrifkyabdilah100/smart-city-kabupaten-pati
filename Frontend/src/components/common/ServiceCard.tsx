import React from 'react';
import { type Service } from '../../types/index';
import { useTheme } from '../../hooks/useTheme';

interface Props {
  service: Service;
  show: boolean;
}

const ServiceCard: React.FC<Props> = ({ service, show }) => {
  const { isDark } = useTheme();

  // Responsive radius: smaller on mobile, larger on desktop
  const getRadius = () => {
    if (typeof window === 'undefined') return 340;
    const w = window.innerWidth;
    if (w < 640) return 150;   // mobile
    if (w < 768) return 200;   // small tablet
    if (w < 1024) return 260;  // tablet
    return 340;                // desktop
  };

  const radius = getRadius();
  const radian = (service.angle * Math.PI) / 180;

  const x = show ? Math.cos(radian) * radius : 0;
  const y = show ? Math.sin(radian) * radius : 0;

  const scaleClass = show ? 'scale-100 opacity-100' : 'scale-0 opacity-0';

  return (
    <div
      className={`absolute flex flex-col items-center justify-center transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1) z-30 ${scaleClass}`}
      style={{ transform: `translate(${x}px, ${y}px)` }}
    >
      <div className="relative flex flex-col items-center justify-center cursor-pointer group transform transition-all duration-300 hover:scale-110 hover:-translate-y-2 active:scale-95">

        {/* === 1. EFEK GLOW === */}
        <div className={`absolute inset-0 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-100 ${isDark ? 'bg-white/30' : 'bg-blue-400/30'}`}></div>

        {/* === 2. GAMBAR IKON (RESPONSIVE) === */}
        <div className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 mb-1 sm:mb-2 transition-all duration-300 drop-shadow-2xl">
          <img
            src={service.icon}
            alt={service.title}
            className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)]"
          />
        </div>

        {/* === 3. TEKS JUDUL (RESPONSIVE) === */}
        <div className="text-center mt-[-8px] sm:mt-[-12px] lg:mt-[-15px] transition-all duration-300 relative z-10 px-0 flex justify-center">
          <p className="max-w-[100px] sm:max-w-[130px] lg:max-w-[160px] mx-auto text-[10px] sm:text-xs md:text-sm lg:text-base font-black leading-tight uppercase tracking-wide text-white drop-shadow-[0_3px_3px_rgba(0,0,0,0.9)] group-hover:text-cyan-300 transition-colors">
            {service.title}
          </p>
        </div>
      </div>

    </div>
  );
};

export default ServiceCard;