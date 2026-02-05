import React from 'react';
import { type Service } from '../../data/services';

interface Props {
  service: Service;
  show: boolean;
}

const ServiceCard: React.FC<Props> = ({ service, show }) => {
  // Radius orbit
  const radius = 340; 
  const radian = (service.angle * Math.PI) / 180;
  
  const x = show ? Math.cos(radian) * radius : 0;
  const y = show ? Math.sin(radian) * radius : 0;
  
  const scaleClass = show ? 'scale-100 opacity-100' : 'scale-0 opacity-0';

  return (
    <div 
      className={`absolute flex flex-col items-center justify-center transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1) z-30 ${scaleClass}`}
      style={{ transform: `translate(${x}px, ${y}px)` }}
    >
      <div className="relative flex flex-col items-center justify-center cursor-pointer group transform transition-all duration-300 hover:scale-110 hover:-translate-y-2">
        
        {/* === 1. EFEK GLOW === */}
        <div className="absolute inset-0 bg-white/30 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-100"></div>

        {/* === 2. GAMBAR IKON (BESAR) === */}
        <div className="relative w-44 h-44 mb-2 transition-all duration-300 drop-shadow-2xl">
           <img 
              src={service.icon} 
              alt={service.title} 
              className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)]"
           />
        </div>
        
        {/* === 3. TEKS JUDUL (REVISI: WRAPPING) === */}
        <div className="text-center mt-[-15px] transition-all duration-300 relative z-10 px-0 flex justify-center">
          
          {/* REVISI: max-w-[160px] akan memaksa teks panjang (Infrastruktur...) jadi 2 baris */}
          <p className="max-w-[160px] mx-auto text-sm md:text-base font-black text-white leading-tight uppercase tracking-wide drop-shadow-[0_3px_3px_rgba(0,0,0,0.9)] group-hover:text-cyan-300 transition-colors">
            {service.title}
          </p>
          
        </div>
      </div>

    </div>
  );
};

export default ServiceCard;