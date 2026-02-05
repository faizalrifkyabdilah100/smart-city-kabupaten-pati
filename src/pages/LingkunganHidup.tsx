import React, { useState } from 'react';
import SmartCityLayout from '../components/SmartCityLayout';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// === DATA DUMMY ===
const dataAdiwiyata = [
  { name: 'Nasional', jumlah: 12 },
  { name: 'Provinsi', jumlah: 25 },
  { name: 'Kabupaten', jumlah: 45 },
];

const dataTPA = {
  kapasitas: 2000,
  terisi: 1000,
  sisaTahun: 5, 
  sisaHari: 21
};

const dataKomposisi = [
  { name: 'Organik', value: 45, color: '#4ade80' },
  { name: 'Plastik', value: 25, color: '#facc15' },
  { name: 'Kaca', value: 10, color: '#60a5fa' },
  { name: 'Residu', value: 20, color: '#f87171' },
];

const dataSampah = [
  { name: 'Margorejo', ton: 120 },
  { name: 'Pati', ton: 180 },
  { name: 'Wedarijaksa', ton: 90 },
  { name: 'Trangkil', ton: 75 },
];

const dataRTH = {
  persen: 28,
  target: 30,
  luas: 12450 
};

const dataPerusahaan = [
  { name: 'Green', value: 15, color: '#4ade80' }, 
  { name: 'Yellow', value: 8, color: '#facc15' },
  { name: 'Red', value: 3, color: '#f87171' }, 
];

// === TYPE DEFINITIONS ===
type WidgetId = 'tpa' | 'sampah' | 'perusahaan' | 'adiwiyata' | 'komposisi' | 'rth';

// === KOMPONEN UTAMA ===
const LingkunganHidup: React.FC = () => {
  const [activeId, setActiveId] = useState<WidgetId | null>(null);

  // === FUNGSI RENDER KONTEN ===
  const renderContent = (id: WidgetId, isExpanded: boolean) => {
    const chartHeight = isExpanded ? "100%" : "180px"; 
    const pieHeight = isExpanded ? "400px" : "190px"; 

    switch (id) {
      case 'tpa':
        return (
          <div className="flex-1 flex flex-col justify-center gap-4 h-full">
            <div className={`flex justify-between ${isExpanded ? 'text-lg' : 'text-xs'} text-blue-200`}>
              <span>Terisi: <b>1.000 Ton</b></span>
              <span>Kapasitas: <b>2.000 Ton</b></span>
            </div>
            
            <div className={`w-full ${isExpanded ? 'h-8' : 'h-4'} bg-slate-800 rounded-full overflow-hidden relative border border-slate-600 shadow-inner`}>
              <div 
                className="h-full bg-gradient-to-r from-green-500 via-yellow-400 to-red-500 relative"
                style={{ width: `${(dataTPA.terisi / dataTPA.kapasitas) * 100}%` }}
              >
                  <div className="absolute inset-0 w-full h-full animate-[slide_1s_linear_infinite]" 
                        style={{ backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem' }}>
                  </div>
              </div>
            </div>

            <div className="mt-1 text-center">
              <p className="text-slate-400 text-[10px] uppercase tracking-widest mb-1">Estimasi Penuh</p>
              <div className={`flex items-baseline justify-center gap-2 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] ${isExpanded ? 'scale-150 mt-4' : ''}`}>
                  <span className="text-4xl font-black">{dataTPA.sisaTahun}</span>
                  <span className="text-xs font-bold text-slate-400 mr-2">TH</span>
                  <span className="text-4xl font-black">{dataTPA.sisaHari}</span>
                  <span className="text-xs font-bold text-slate-400">HARI</span>
              </div>
            </div>
          </div>
        );

      case 'sampah':
        return (
          <div style={{ height: chartHeight }} className="w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataSampah} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={isExpanded ? 14 : 10} tickLine={false} dy={5} />
                <YAxis stroke="#94a3b8" fontSize={isExpanded ? 14 : 10} tickLine={false} />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '8px' }} />
                <Bar dataKey="ton" fill="#38bdf8" radius={[6, 6, 0, 0]} barSize={isExpanded ? 60 : 35}>
                   <defs>
                      <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.9}/>
                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.4}/>
                      </linearGradient>
                   </defs>
                   {dataSampah.map((_entry, index) => <Cell key={`cell-${index}`} fill="url(#colorBar)" />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case 'perusahaan':
        return (
          <div style={{ height: chartHeight }} className="w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataPerusahaan} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={isExpanded ? 14 : 11} tickLine={false} axisLine={false} dy={5} />
                <YAxis stroke="#94a3b8" fontSize={isExpanded ? 14 : 11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '8px' }} cursor={{fill: 'rgba(255,255,255,0.05)'}} itemStyle={{ color: '#fff' }}/>
                <Bar dataKey="value" radius={[6, 6, 6, 6]} barSize={isExpanded ? 60 : 35}>
                   {dataPerusahaan.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={2} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case 'adiwiyata':
        return (
          <div style={{ height: chartHeight }} className="w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={dataAdiwiyata} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                 <XAxis dataKey="name" stroke="#94a3b8" fontSize={isExpanded ? 14 : 11} tickLine={false} dy={5} />
                 <YAxis stroke="#94a3b8" fontSize={isExpanded ? 14 : 11} tickLine={false} />
                 <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '8px' }} cursor={{fill: 'rgba(255,255,255,0.05)'}}/>
                 <Bar dataKey="jumlah" fill="#4ade80" radius={[6, 6, 0, 0]} barSize={isExpanded ? 60 : 40}>
                     <defs>
                        <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4ade80" stopOpacity={0.9}/>
                          <stop offset="95%" stopColor="#4ade80" stopOpacity={0.4}/>
                        </linearGradient>
                     </defs>
                     <Cell fill="url(#colorGreen)" />
                     <Cell fill="url(#colorGreen)" />
                     <Cell fill="url(#colorGreen)" />
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
          </div>
        );

      case 'komposisi':
        return (
          <div style={{ height: pieHeight }} className="w-full flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={dataKomposisi}
                   cx="50%"
                   cy="50%"
                   innerRadius={isExpanded ? 80 : 50}
                   outerRadius={isExpanded ? 120 : 75}
                   paddingAngle={5}
                   dataKey="value"
                 >
                   {dataKomposisi.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
                 </Pie>
                 <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', padding: '10px' }} itemStyle={{ color: '#fff' }} />
                 <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" iconSize={10} wrapperStyle={{ fontSize: isExpanded ? '14px' : '11px', fontWeight: 500 }} />
               </PieChart>
             </ResponsiveContainer>
          </div>
        );

      case 'rth':
        return (
          <div className="flex flex-col items-center justify-center h-full pb-6 z-10 relative">
             <div className={`relative w-full ${isExpanded ? 'h-64' : 'h-32'} mb-2 flex items-center justify-center`}>
                <img 
                  src="/peta-pati-clean.png" 
                  alt="Peta Sebaran RTH Pati" 
                  className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(74,222,128,0.4)] opacity-90 transition-transform duration-700"
                  style={{ filter: "hue-rotate(90deg) brightness(1.2)" }} 
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                   <span className={`${isExpanded ? 'text-6xl' : 'text-4xl'} font-black text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]`} style={{ textShadow: '0 0 20px rgba(74,222,128,0.8)' }}>
                      {dataRTH.persen}%
                   </span>
                </div>
             </div>
             <div className="flex gap-6 mt-1 text-center z-20 w-full justify-center px-4">
                <div className="bg-slate-950/40 px-4 py-2 rounded-lg backdrop-blur-md border border-white/10 w-1/2">
                   <p className="text-slate-300 text-[10px] uppercase tracking-wider font-semibold">Luas Area</p>
                   <p className={`text-white ${isExpanded ? 'text-xl' : 'text-sm'} font-bold`}>{dataRTH.luas.toLocaleString()} Ha</p>
                </div>
                <div className="bg-slate-950/40 px-4 py-2 rounded-lg backdrop-blur-md border border-white/10 w-1/2">
                   <p className="text-slate-300 text-[10px] uppercase tracking-wider font-semibold">Target</p>
                   <p className={`text-white ${isExpanded ? 'text-xl' : 'text-sm'} font-bold`}>{dataRTH.target}%</p>
                </div>
             </div>
          </div>
        );
    }
  };

  const WidgetCard = ({ id, title, children }: { id: WidgetId, title: React.ReactNode, children: React.ReactNode }) => (
    <motion.div 
      layoutId={`card-${id}`} 
      onClick={() => setActiveId(id)}
      className="bg-slate-900/40 backdrop-blur-md border border-white/20 rounded-2xl p-5 hover:border-cyan-400/50 hover:scale-[1.02] transition-all duration-300 h-[240px] flex flex-col shadow-xl group cursor-pointer relative overflow-hidden"
    >
       <div className="flex justify-between items-start mb-2">
          {title}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-cyan-400 font-mono bg-black/50 px-2 py-1 rounded">
             Click to Expand ↗
          </div>
       </div>
       {children}
       <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-cyan-400/10 transition-colors"></div>
    </motion.div>
  );

  return (
    <SmartCityLayout>
      <div className="w-full h-full flex flex-col">
        
        {/* HEADER */}
        <div className="w-full px-8 py-4 flex flex-row justify-between items-center animate-slide-down shrink-0 z-20">
            <div>
               <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight drop-shadow-lg">
                 Dashboard <span className="text-green-400">Lingkungan Hidup</span>
               </h1>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-white font-mono text-xs md:text-sm shadow-lg">
               {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
        </div>

        {/* CONTENT GRID */}
        <div className="flex-1 flex flex-col justify-center overflow-y-auto px-6 pb-24 no-scrollbar z-10"> 
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[1400px] w-full mx-auto">

            <WidgetCard id="tpa" title={<h3 className="text-white text-sm font-bold flex items-center gap-2">🚛 Status TPA <span className="bg-red-500/20 text-red-300 text-[10px] px-2 py-0.5 rounded animate-pulse border border-red-500/30">CRITICAL</span></h3>}>
              {renderContent('tpa', false)}
            </WidgetCard>

            <WidgetCard id="sampah" title={<h3 className="text-white text-sm font-bold">🏙️ Produksi Sampah (Ton)</h3>}>
              {renderContent('sampah', false)}
            </WidgetCard>

            <WidgetCard id="perusahaan" title={<h3 className="text-white text-sm font-bold">🏭 Status Ketaatan Perusahaan</h3>}>
              {renderContent('perusahaan', false)}
            </WidgetCard>

            <WidgetCard id="adiwiyata" title={<h3 className="text-white text-sm font-bold flex items-center gap-2">🏆 Sekolah Adiwiyata</h3>}>
              {renderContent('adiwiyata', false)}
            </WidgetCard>

            <WidgetCard id="komposisi" title={<h3 className="text-white text-sm font-bold">📊 Komposisi Sampah</h3>}>
              {renderContent('komposisi', false)}
            </WidgetCard>

            <WidgetCard id="rth" title={<h3 className="text-white text-sm font-bold z-10 relative">🌳 Ruang Terbuka Hijau</h3>}>
               {renderContent('rth', false)}
               <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-gradient-to-t from-green-900/20 via-transparent to-transparent z-0 pointer-events-none"></div>
            </WidgetCard>

          </div>
        </div>

        {/* === EXPANDED OVERLAY === */}
        <AnimatePresence>
          {activeId && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
               {/* UPDATE DISINI: 
                 - Opacity diturunkan jadi 30% (bg-slate-900/30)
                 - Blur dinaikkan (backdrop-blur-md)
                 Efek: Frosted Glass
               */}
               <motion.div 
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 1 }} 
                 exit={{ opacity: 0 }}
                 onClick={() => setActiveId(null)} 
                 className="absolute inset-0 bg-slate-900/30 backdrop-blur-md cursor-pointer" 
               />

               <motion.div 
                  layoutId={`card-${activeId}`} 
                  className="bg-slate-900 border border-white/20 rounded-3xl p-8 w-full max-w-5xl h-[600px] relative shadow-2xl flex flex-col z-[101] overflow-hidden"
               >
                  <div className="flex justify-between items-center mb-6">
                     <h2 className="text-3xl font-bold text-white tracking-wide flex items-center gap-3">
                        {activeId === 'tpa' && '🚛 Status TPA & Kapasitas'}
                        {activeId === 'sampah' && '🏙️ Detail Produksi Sampah per Kecamatan'}
                        {activeId === 'perusahaan' && '🏭 Laporan Ketaatan Perusahaan'}
                        {activeId === 'adiwiyata' && '🏆 Statistik Sekolah Adiwiyata'}
                        {activeId === 'komposisi' && '📊 Analisa Komposisi Sampah'}
                        {activeId === 'rth' && '🌳 Peta Sebaran Ruang Terbuka Hijau'}
                     </h2>
                     <button 
                       onClick={(e) => { e.stopPropagation(); setActiveId(null); }}
                       className="w-10 h-10 rounded-full bg-white/10 hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center transition-colors"
                     >
                       ✕
                     </button>
                  </div>

                  <div className="flex-1 w-full h-full bg-slate-800/30 rounded-2xl p-6 border border-white/5">
                     {renderContent(activeId, true)}
                  </div>

                  <div className="absolute bottom-4 right-6 text-slate-500 text-sm">
                    Tekan ESC atau klik luar untuk menutup
                  </div>
               </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </SmartCityLayout>
  );
};

export default LingkunganHidup;