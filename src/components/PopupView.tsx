import React from 'react';

interface Props {
  type: string | null;
  onClose: () => void;
}

const PopupView: React.FC<Props> = ({ type, onClose }) => {
  if (!type) return null;

  // === 1. TAMPILAN KHUSUS: LOGIN ===
  if (type === 'Login') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
        {/* Tombol Close */}
        <button onClick={onClose} className="absolute top-6 right-6 text-white hover:text-red-400 transition-colors z-50">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
             <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
           </svg>
        </button>

        {/* Modal Login */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-[400px] flex flex-col items-center relative animate-scale-up border-t-4 border-yellow-400">
          
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Login Smart City</h2>
          <p className="text-sm text-gray-500 mb-6">Akses Layanan Pemerintahan Terpadu</p>

          {/* Form Input Dummy */}
          <div className="w-full space-y-4 mb-6">
            <input type="text" placeholder="NIK / Username" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            <input type="password" placeholder="Password" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          {/* Tombol Aksi */}
          <button className="w-full py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
             MASUK SEKARANG
          </button>
        </div>
      </div>
    );
  }

  // === 2. LOGIKA MENU (MENYESUAIKAN services.ts) ===
  
  let title = "";
  let iconHeader = ""; // Icon besar di atas judul popup
  let buttons: { label: string; icon: string; link?: string }[] = [];

  // --- LOGIKA PERCABANGAN (SWITCH) ---
  switch (type) {
    case 'Lingkungan Hidup':
      title = "Dinas Lingkungan Hidup";
      iconHeader = "🌿";
      buttons = [
        { label: "Bank Sampah", icon: "♻️" },
        { label: "Pengaduan Limbah", icon: "⚠️" },
        { label: "Uji Emisi", icon: "💨" },
        { label: "Taman Kota", icon: "🌳" }
      ];
      break;

    case 'Infrastruktur Pembangunan':
      title = "Layanan Infrastruktur";
      iconHeader = "🏗️";
      buttons = [
        { label: "Lapor Jalan Rusak", icon: "🚧" },
        { label: "Perizinan (PBG/IMB)", icon: "🏠" },
        { label: "PJU Mati", icon: "💡" },
        { label: "Peta Tata Ruang", icon: "🗺️" }
      ];
      break;

    case 'Kesehatan':
      title = "Dinas Kesehatan";
      iconHeader = "🏥";
      buttons = [
        { label: "Antrian Puskesmas", icon: "👨‍⚕️" },
        { label: "Ketersediaan Kamar RS", icon: "🛏️" },
        { label: "Jadwal Dokter", icon: "📅" },
        { label: "Public Safety Center", icon: "🚑" }
      ];
      break;

    case 'Sosial Media Kominfo':
      title = "Portal Informasi & Sosmed";
      iconHeader = "📢";
      buttons = [
        { label: "Instagram Kominfo", icon: "📸" },
        { label: "Youtube Official", icon: "▶️" },
        { label: "Website Kab. Pati", icon: "🌐" },
        { label: "Lapor Bupati", icon: "📨" }
      ];
      break;

    default:
      // Fallback jika ada menu baru yang belum di-handle
      title = type;
      iconHeader = "📂";
      buttons = [{ label: "Coming Soon", icon: "⏳" }];
  }


  // === 3. TAMPILAN MENU GRID (DINAMIS) ===
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
       
       {/* Tombol Close Besar */}
       <button onClick={onClose} className="absolute top-8 right-8 text-white hover:rotate-90 transition-transform duration-300 z-50">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 border-2 border-white rounded-full p-2 hover:bg-white hover:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
      </button>

      {/* Header Popup */}
      <div className="flex flex-col items-center mb-10 animate-slide-down">
         <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-4 shadow-2xl w-24 h-24 flex items-center justify-center mb-4 text-5xl">
            {iconHeader}
         </div>
         <h1 className="text-white text-3xl font-bold tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] border-b-4 border-yellow-400 pb-2">
            {title}
         </h1>
      </div>

      {/* Grid Tombol Layanan */}
      <div className="flex flex-wrap justify-center gap-6 max-w-5xl px-4 animate-scale-up">
        {buttons.map((btn, idx) => (
          <div 
            key={idx} 
            className="group bg-white/90 hover:bg-white rounded-2xl p-4 w-40 h-40 md:w-48 md:h-48 flex flex-col items-center justify-center shadow-xl cursor-pointer hover:scale-105 transition-all duration-300 border-b-4 border-transparent hover:border-blue-500"
          >
             {/* Icon Tombol */}
             <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-3 text-4xl group-hover:bg-blue-100 transition-colors shadow-inner">
               {btn.icon}
             </div>
             
             {/* Label Tombol */}
             <span className="text-center text-sm font-bold text-gray-700 leading-tight group-hover:text-blue-700 px-2">
               {btn.label}
             </span>
          </div>
        ))}
      </div>

    </div>
  );
};

export default PopupView;