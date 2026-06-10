import React from 'react';
import { useNavigate } from 'react-router-dom';
import SmartCityLayout from '../components/layout/SmartCityLayout';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <SmartCityLayout showDock={false}>
      <div className="flex-1 flex items-center justify-center z-10 relative p-4">
        <div className="text-center">
          <div className="text-[10rem] sm:text-[14rem] font-black text-white/8 leading-none mb-2 select-none">
            404
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-white/55 text-sm sm:text-base mb-8 max-w-sm mx-auto">
            Halaman yang Anda cari tidak ada atau telah dipindahkan.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-500/20"
          >
            ← Kembali ke Beranda
          </button>
        </div>
      </div>
    </SmartCityLayout>
  );
};

export default NotFound;
