import React, { useState, useEffect } from 'react';
import SmartCityLayout from '../components/layout/SmartCityLayout';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// IMPORT TIPE & DATA DARI LUAR (CLEAN CODE)
import { type WidgetId } from '../types';
import {
  dataAdiwiyata, dataTPA, dataKomposisi,
  dataSampah, dataRTH, dataPerusahaan
} from '../data/dashboardData';
import { useTheme } from '../hooks/useTheme';
import { useThemeStyles } from '../hooks/useThemeStyles';
import { PageHeader } from '../components/common/PageHeader';

// === KOMPONEN UTAMA ===
const LingkunganHidup: React.FC = () => {
  const [activeId, setActiveId] = useState<WidgetId | null>(null);
  const { isDark } = useTheme();
  const { headingStyle, subTextStyle, innerBoxStyle, closeButtonStyle } = useThemeStyles();

  useEffect(() => {
    if (!activeId) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setActiveId(null); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [activeId]);

  // === CHART STYLE HELPERS ===
  const axisColor = isDark ? '#94a3b8' : '#bfdbfe';
  const tooltipBg = isDark ? '#0f172a' : '#1e3a8a';
  const tooltipBorder = isDark ? '#334155' : '#3b82f6';
  const tooltipText = isDark ? '#ffffff' : '#ffffff';
  const cursorFill = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.08)';

  // === FUNGSI RENDER KONTEN ===
  const renderContent = (id: WidgetId, isExpanded: boolean) => {
    const chartHeight = isExpanded ? "100%" : "180px";
    const pieHeight = isExpanded ? "400px" : "190px";

    switch (id) {
      case 'tpa':
        return (
          <div className="flex-1 flex flex-col justify-center gap-3 sm:gap-4 h-full">
            <div className={`flex justify-between ${isExpanded ? 'text-sm sm:text-lg' : 'text-[10px] sm:text-xs'} ${isDark ? 'text-blue-200' : 'text-blue-100'}`}>
              <span>Terisi: <b>{dataTPA.terisi.toLocaleString()} Ton</b></span>
              <span>Kapasitas: <b>{dataTPA.kapasitas.toLocaleString()} Ton</b></span>
            </div>

            <div className={`w-full ${isExpanded ? 'h-6 sm:h-8' : 'h-3 sm:h-4'} rounded-full overflow-hidden relative border shadow-inner ${isDark ? 'bg-slate-800 border-slate-600' : 'bg-white/20 border-white/30'}`}>
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
              <p className={`text-[9px] sm:text-[10px] uppercase tracking-widest mb-1 ${subTextStyle}`}>Estimasi Penuh</p>
              <div className={`flex items-baseline justify-center gap-1.5 sm:gap-2 ${isExpanded ? 'scale-125 sm:scale-150 mt-4' : ''} text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]`}>
                <span className="text-2xl sm:text-4xl font-black">{dataTPA.sisaTahun}</span>
                <span className={`text-[10px] sm:text-xs font-bold mr-1 sm:mr-2 ${subTextStyle}`}>TH</span>
                <span className="text-2xl sm:text-4xl font-black">{dataTPA.sisaHari}</span>
                <span className={`text-[10px] sm:text-xs font-bold ${subTextStyle}`}>HARI</span>
              </div>
            </div>
          </div>
        );

      case 'sampah':
        return (
          <div style={{ height: chartHeight }} className="w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataSampah} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke={axisColor} fontSize={isExpanded ? 12 : 9} tickLine={false} dy={5} />
                <YAxis stroke={axisColor} fontSize={isExpanded ? 12 : 9} tickLine={false} />
                <Tooltip cursor={{ fill: cursorFill }} contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: tooltipText, borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="ton" fill="#38bdf8" radius={[6, 6, 0, 0]} barSize={isExpanded ? 40 : 25}>
                  <defs>
                    <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isDark ? "#38bdf8" : "#0284c7"} stopOpacity={0.9} />
                      <stop offset="95%" stopColor={isDark ? "#38bdf8" : "#0284c7"} stopOpacity={0.4} />
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
                <XAxis dataKey="name" stroke={axisColor} fontSize={isExpanded ? 12 : 9} tickLine={false} axisLine={false} dy={5} />
                <YAxis stroke={axisColor} fontSize={isExpanded ? 12 : 9} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: tooltipText, borderRadius: '8px', fontSize: '12px' }} cursor={{ fill: cursorFill }} itemStyle={{ color: tooltipText }} />
                <Bar dataKey="value" radius={[6, 6, 6, 6]} barSize={isExpanded ? 40 : 25}>
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
                <XAxis dataKey="name" stroke={axisColor} fontSize={isExpanded ? 12 : 9} tickLine={false} dy={5} />
                <YAxis stroke={axisColor} fontSize={isExpanded ? 12 : 9} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: tooltipText, borderRadius: '8px', fontSize: '12px' }} cursor={{ fill: cursorFill }} />
                <Bar dataKey="jumlah" fill="#4ade80" radius={[6, 6, 0, 0]} barSize={isExpanded ? 40 : 30}>
                  <defs>
                    <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isDark ? "#4ade80" : "#16a34a"} stopOpacity={0.9} />
                      <stop offset="95%" stopColor={isDark ? "#4ade80" : "#16a34a"} stopOpacity={0.4} />
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
                <Pie data={dataKomposisi} cx="50%" cy="50%" innerRadius={isExpanded ? 60 : 35} outerRadius={isExpanded ? 100 : 60} paddingAngle={5} dataKey="value">
                  {dataKomposisi.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '8px', padding: '10px', fontSize: '12px' }} itemStyle={{ color: tooltipText }} />
                <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: isExpanded ? '12px' : '10px', fontWeight: 500, color: isDark ? '#cbd5e1' : '#e2e8f0' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );

      case 'rth':
        return (
          <div className="flex flex-col items-center justify-center h-full pb-4 sm:pb-6 z-10 relative">
            <div className={`relative w-full ${isExpanded ? 'h-48 sm:h-64' : 'h-24 sm:h-32'} mb-2 flex items-center justify-center`}>
              <img
                src="/peta-pati-clean.png"
                alt="Peta Sebaran RTH Pati"
                className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(74,222,128,0.4)] opacity-90 transition-transform duration-700"
                style={{ filter: "hue-rotate(90deg) brightness(1.2)" }}
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <span className={`${isExpanded ? 'text-4xl sm:text-6xl' : 'text-2xl sm:text-4xl'} font-black text-white`} style={{ textShadow: '0 0 20px rgba(74,222,128,0.8)' }}>
                  {dataRTH.persen}%
                </span>
              </div>
            </div>
            <div className="flex gap-3 sm:gap-6 mt-1 text-center z-20 w-full justify-center px-2 sm:px-4">
              <div className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg border w-1/2 ${innerBoxStyle}`}>
                <p className={`text-[8px] sm:text-[10px] uppercase tracking-wider font-semibold ${isDark ? 'text-blue-200/70' : 'text-white/55'}`}>Luas Area</p>
                <p className={`${isExpanded ? 'text-base sm:text-xl' : 'text-xs sm:text-sm'} font-bold ${headingStyle}`}>{dataRTH.luas.toLocaleString()} Ha</p>
              </div>
              <div className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg border w-1/2 ${innerBoxStyle}`}>
                <p className={`text-[8px] sm:text-[10px] uppercase tracking-wider font-semibold ${isDark ? 'text-blue-200/70' : 'text-white/55'}`}>Target</p>
                <p className={`${isExpanded ? 'text-base sm:text-xl' : 'text-xs sm:text-sm'} font-bold ${headingStyle}`}>{dataRTH.target}%</p>
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
      className={`border rounded-2xl p-3 sm:p-4 md:p-5 transition-all duration-300 h-[200px] sm:h-[220px] md:h-[240px] flex flex-col shadow-xl group cursor-pointer relative overflow-hidden ${isDark
        ? 'bg-slate-900/40 backdrop-blur-md border-white/20 hover:border-cyan-400/50 hover:scale-[1.02] active:scale-[0.98]'
        : 'bg-white/10 backdrop-blur-md border-white/20 hover:border-white/45 hover:scale-[1.02] active:scale-[0.98]'
        }`}
    >
      <div className="flex justify-between items-start mb-2">
        {title}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] sm:text-xs font-mono px-2 py-1 rounded text-cyan-400 bg-black/50">
          Click to Expand ↗
        </div>
      </div>
      {children}
      <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-3xl transition-colors ${isDark ? 'bg-white/5 group-hover:bg-cyan-400/10' : 'bg-white/5 group-hover:bg-cyan-400/10'}`}></div>
    </motion.div>
  );

  return (
    <SmartCityLayout>
      <div className="w-full h-full flex flex-col">

        {/* HEADER */}
        <div className="px-3 sm:px-4 md:px-6 lg:px-8">
          <PageHeader
            title="Dashboard"
            titleAccent="Lingkungan Hidup"
            titleAccentColor="text-green-400"
          />
        </div>

        {/* CONTENT GRID */}
        <div className="flex-1 flex flex-col justify-center overflow-y-auto px-3 sm:px-4 md:px-6 pb-24 no-scrollbar z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 max-w-[1400px] w-full mx-auto">

            <WidgetCard id="tpa" title={<h3 className={`text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 ${headingStyle}`}>🚛 Status TPA <span className="bg-red-500/20 text-red-400 text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded animate-pulse border border-red-500/30">CRITICAL</span></h3>}>
              {renderContent('tpa', false)}
            </WidgetCard>

            <WidgetCard id="sampah" title={<h3 className={`text-xs sm:text-sm font-bold ${headingStyle}`}>🏙️ Produksi Sampah (Ton)</h3>}>
              {renderContent('sampah', false)}
            </WidgetCard>

            <WidgetCard id="perusahaan" title={<h3 className={`text-xs sm:text-sm font-bold ${headingStyle}`}>🏭 Status Ketaatan Perusahaan</h3>}>
              {renderContent('perusahaan', false)}
            </WidgetCard>

            <WidgetCard id="adiwiyata" title={<h3 className={`text-xs sm:text-sm font-bold flex items-center gap-2 ${headingStyle}`}>🏆 Sekolah Adiwiyata</h3>}>
              {renderContent('adiwiyata', false)}
            </WidgetCard>

            <WidgetCard id="komposisi" title={<h3 className={`text-xs sm:text-sm font-bold ${headingStyle}`}>📊 Komposisi Sampah</h3>}>
              {renderContent('komposisi', false)}
            </WidgetCard>

            <WidgetCard id="rth" title={<h3 className={`text-xs sm:text-sm font-bold z-10 relative ${headingStyle}`}>🌳 Ruang Terbuka Hijau</h3>}>
              {renderContent('rth', false)}
              <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-gradient-to-t from-green-900/20 via-transparent to-transparent z-0 pointer-events-none"></div>
            </WidgetCard>

          </div>
        </div>

        {/* === EXPANDED OVERLAY === */}
        <AnimatePresence>
          {activeId && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveId(null)}
                className={`absolute inset-0 backdrop-blur-md cursor-pointer ${isDark ? 'bg-slate-900/30' : 'bg-slate-900/20'}`}
              />

              <motion.div
                layoutId={`card-${activeId}`}
                className={`border rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 w-full max-w-5xl h-[85vh] sm:h-[80vh] md:h-[600px] relative shadow-2xl flex flex-col z-[101] overflow-hidden ${isDark
                  ? 'bg-slate-900 border-white/20'
                  : 'bg-blue-900 border-white/20 backdrop-blur-xl'
                  }`}
              >
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h2 className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-wide flex items-center gap-2 sm:gap-3 ${headingStyle}`}>
                    {activeId === 'tpa' && '🚛 Status TPA & Kapasitas'}
                    {activeId === 'sampah' && '🏙️ Detail Produksi Sampah per Kecamatan'}
                    {activeId === 'perusahaan' && '🏭 Laporan Ketaatan Perusahaan'}
                    {activeId === 'adiwiyata' && '🏆 Statistik Sekolah Adiwiyata'}
                    {activeId === 'komposisi' && '📊 Analisa Komposisi Sampah'}
                    {activeId === 'rth' && '🌳 Peta Sebaran Ruang Terbuka Hijau'}
                  </h2>
                  <button
                    onClick={(e) => { e.stopPropagation(); setActiveId(null); }}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors shrink-0 text-sm sm:text-base ${closeButtonStyle}`}
                  >
                    ✕
                  </button>
                </div>

                <div className={`flex-1 w-full h-full rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border ${isDark
                  ? 'bg-slate-800/30 border-white/5'
                  : 'bg-white/5 border-white/10'
                  }`}>
                  {renderContent(activeId, true)}
                </div>

                <div className={`absolute bottom-3 sm:bottom-4 right-4 sm:right-6 text-[10px] sm:text-sm ${subTextStyle}`}>
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