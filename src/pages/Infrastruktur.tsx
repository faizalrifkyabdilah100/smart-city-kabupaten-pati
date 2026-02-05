import React from 'react';
import SmartCityLayout from '../components/SmartCityLayout';

const Infrastruktur: React.FC = () => {
  return (
    <SmartCityLayout>
      <div className="w-full h-full flex flex-col justify-between">
        
        {/* === HEADER AREA === */}
        <div className="w-full p-8 flex justify-between items-start animate-slide-down">
            <div>
               <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-lg">
                 Dashboard <span className="text-yellow-400">Infrastruktur</span>
               </h1>
               <p className="text-blue-200 text-lg mt-2 font-light">Monitoring pembangunan & tata ruang kota</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 text-white font-mono">
               {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
        </div>

        {/* === CONTENT AREA === */}
        <div className="flex-1 flex items-center justify-center">
            <div className="text-white/50 text-xl font-light italic border-2 border-dashed border-yellow-400/30 bg-yellow-400/5 rounded-3xl p-10 backdrop-blur-sm">
               [ Widget CCTV Jalan & Laporan Perbaikan ]
            </div>
        </div>

      </div>
    </SmartCityLayout>
  );
};

export default Infrastruktur;