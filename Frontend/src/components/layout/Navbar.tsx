import React from 'react';

interface Props {
  show: boolean;
}

const Navbar: React.FC<Props> = ({ show }) => {
  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-40 flex flex-col items-center pt-10 transition-all duration-500 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}
    >
      
      {/* 1. JUDUL UTAMA (DIPERBESAR LAGI) */}
      {/* Perubahan: 
          - Mobile: text-3xl -> text-4xl
          - Desktop (md): text-5xl -> text-6xl 
      */}
      <h1 className="text-white text-4xl md:text-6xl font-light tracking-wide drop-shadow-lg text-center leading-tight">
        Selamat Datang di <span className="font-black text-yellow-400 drop-shadow-[0_2px_10px_rgba(250,204,21,0.6)]">SMART CITY</span>
      </h1>


      {/* 3. BADGE INSTANSI (DIPERBESAR LAGI) */}
      {/* Perubahan:
          - Mobile: text-xs -> text-sm
          - Desktop (md): text-sm -> text-base (atau text-lg jika ingin lebih besar lagi)
          - Padding (px-8 py-2) dipertahankan agar proporsional
      */}
      <div className="mt-6 bg-white/10 backdrop-blur-md border border-white/20 px-8 py-2.5 rounded-full shadow-xl hover:bg-white/20 transition-colors cursor-default">
         <span className="text-white text-sm md:text-base font-bold tracking-[0.3em] drop-shadow-md">
            KABUPATEN PATI
         </span>
      </div>

    </nav>
  );
};

export default Navbar;