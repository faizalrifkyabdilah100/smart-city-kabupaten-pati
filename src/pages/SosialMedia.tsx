import React from 'react';
import SmartCityLayout from '../components/layout/SmartCityLayout';

const SosialMedia: React.FC = () => {
  return (
    <SmartCityLayout>
      <div className="w-full h-full flex flex-col justify-between">
        
        {/* === HEADER AREA === */}
        <div className="w-full p-8 flex justify-between items-start animate-slide-down">
            <div>
               <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-lg">
                 Portal <span className="text-purple-400">Kominfo</span>
               </h1>
               <p className="text-blue-200 text-lg mt-2 font-light">Berita terkini & Kanal Sosial Media Resmi</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 text-white font-mono">
               {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
        </div>

        {/* === CONTENT AREA === */}
        <div className="flex-1 flex items-center justify-center">
            <div className="text-white/50 text-xl font-light italic border-2 border-dashed border-purple-400/30 bg-purple-400/5 rounded-3xl p-10 backdrop-blur-sm">
               [ Feed Instagram & Berita Pemkab ]
            </div>
        </div>

      </div>
    </SmartCityLayout>
  );
};

export default SosialMedia;