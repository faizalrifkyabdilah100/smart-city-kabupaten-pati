import React from 'react';
import SmartCityLayout from '../components/layout/SmartCityLayout';
import { formatTanggal } from '../utils/formatTanggal';
import { useTheme } from '../hooks/useTheme';

const Kesehatan: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <SmartCityLayout>
      <div className="w-full h-full flex flex-col justify-between">

        {/* === HEADER AREA === */}
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 animate-slide-down">
          <div>
            <h1 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight drop-shadow-lg transition-colors duration-500 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Layanan <span className={`${isDark ? 'text-rose-400' : 'text-rose-600'}`}>Kesehatan</span>
            </h1>
            <p className={`text-xs sm:text-sm md:text-base lg:text-lg mt-1 sm:mt-2 font-light transition-colors duration-500 ${isDark ? 'text-blue-200' : 'text-slate-500'}`}>Informasi RS, Puskesmas & Ketersediaan Kamar</p>
          </div>

          <div className="flex items-center gap-3">
            <div className={`backdrop-blur-md px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-full border font-mono text-[10px] sm:text-xs md:text-sm transition-colors duration-500 ${isDark ? 'bg-white/10 border-white/20 text-white' : 'bg-white/60 border-white/40 text-slate-700'}`}>
              {formatTanggal()}
            </div>
          </div>
        </div>

        {/* === CONTENT AREA === */}
        <div className="flex-1 flex items-center justify-center px-3 sm:px-4">
          <div className={`text-sm sm:text-base md:text-lg lg:text-xl font-light italic border-2 border-dashed rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 backdrop-blur-sm text-center transition-colors duration-500 ${isDark
            ? 'text-white/50 border-rose-400/30 bg-rose-400/5'
            : 'text-slate-500 border-rose-300/50 bg-rose-50/50'
            }`}>
            [ Widget Antrian RS & Jadwal Dokter ]
          </div>
        </div>

      </div>
    </SmartCityLayout>
  );
};

export default Kesehatan;