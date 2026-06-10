import React from 'react';
import SmartCityLayout from '../components/layout/SmartCityLayout';
import { useTheme } from '../hooks/useTheme';
import { PageHeader } from '../components/common/PageHeader';

const Infrastruktur: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <SmartCityLayout>
      <div className="w-full h-full flex flex-col justify-between">

        {/* === HEADER AREA (Konsisten dengan Kominfo/LH) === */}
        <div className="px-3 sm:px-4 md:px-6 lg:px-8">
          <PageHeader
            title="Dashboard"
            titleAccent="Infrastruktur"
            titleAccentColor="text-yellow-400"
            subtitle="Monitoring pembangunan & tata ruang kota"
          />
        </div>

        {/* === CONTENT AREA === */}
        <div className="flex-1 flex items-center justify-center px-3 sm:px-4">
          <div className={`text-sm sm:text-base md:text-lg lg:text-xl font-light italic border-2 border-dashed rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 backdrop-blur-sm text-center transition-colors duration-500 ${isDark
            ? 'text-white/50 border-yellow-400/30 bg-yellow-400/5'
            : 'text-white/60 border-yellow-400/30 bg-yellow-400/5'
            }`}>
            [ Widget CCTV Jalan & Laporan Perbaikan ]
          </div>
        </div>

      </div>
    </SmartCityLayout>
  );
};

export default Infrastruktur;