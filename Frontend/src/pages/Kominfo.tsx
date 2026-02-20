import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SmartCityLayout from '../components/layout/SmartCityLayout';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { dataKominfoCharts, cctv, mapLocations } from '../data/dashboardData';
import { formatTanggal } from '../utils/formatTanggal';
import { useTheme } from '../hooks/useTheme';
import { fetchTrafficData, transformTrafficData } from '../services/trafficApi';

const DEFAULT_MAP_URL = 'https://www.google.com/maps?q=-6.7578,111.1245&z=13&output=embed';

const Kominfo: React.FC = () => {
  const [mapSrc, setMapSrc] = useState(DEFAULT_MAP_URL);
  const { isDark } = useTheme();

  // === TRAFFIC DATA STATE ===
  const [trafficData, setTrafficData] = useState<ReturnType<typeof transformTrafficData> | null>(null);
  const [trafficLoading, setTrafficLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadTraffic = async () => {
      const raw = await fetchTrafficData();
      if (raw && isMounted) {
        setTrafficData(transformTrafficData(raw));
      }
      if (isMounted) setTrafficLoading(false);
    };

    loadTraffic();

    // Auto-refresh setiap 1 detik
    const interval = setInterval(loadTraffic, 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleLocationClick = useCallback((lat: number, lng: number) => {
    setMapSrc(`https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`);
  }, []);

  // === STYLE HELPERS ===
  // Both modes have blue background, so use glass card styling for both
  const cardStyle = isDark
    ? 'bg-slate-900/40 backdrop-blur-md border-white/20 hover:border-cyan-400/50'
    : 'bg-blue-950/30 backdrop-blur-md border-white/30 hover:border-cyan-200/50';
  const innerBoxStyle = isDark
    ? 'bg-slate-800/50 border-white/10'
    : 'bg-white/10 border-white/15';
  const headingStyle = 'text-white';
  const subTextStyle = isDark ? 'text-slate-400' : 'text-blue-100';
  const labelStyle = isDark ? 'text-slate-500' : 'text-blue-200';

  return (
    <SmartCityLayout>
      <div className="w-full flex flex-col gap-3 px-3 sm:px-4 lg:px-6 pb-6">

        {/* === HEADER === */}
        <div className="w-full py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 animate-slide-down shrink-0 z-20">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight drop-shadow-lg text-white">
              Portal <span className="text-purple-400">Kominfo</span>
            </h1>
            <p className={`text-xs sm:text-sm lg:text-base font-light ${subTextStyle}`}>Dashboard Informasi & Monitoring Media Sosial</p>
          </div>
          <div className="backdrop-blur-md bg-white/10 border-white/20 border px-3 sm:px-4 py-1.5 rounded-full font-mono text-[10px] sm:text-xs lg:text-sm shadow-lg text-white">
            {formatTanggal()}
          </div>
        </div>

        {/* === MAIN LAYOUT === */}
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 z-10 lg:flex-1" style={{ minHeight: 0 }}>

          {/* === DATA ANALYTICS === */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`w-full lg:w-80 border rounded-2xl p-3 shadow-xl transition-all flex flex-col overflow-hidden shrink-0 ${cardStyle}`}
          >
            <h3 className={`font-bold text-sm mb-3 px-1 flex items-center gap-2 transition-colors duration-500 ${headingStyle}`}>
              <span className={`w-2 h-2 rounded-full animate-pulse ${isDark ? 'bg-cyan-400' : 'bg-blue-500'}`}></span>
              Data Analytics ({dataKominfoCharts.length} Metrics)
            </h3>

            <div className="flex-1 overflow-y-auto no-scrollbar max-h-[300px] lg:max-h-none">
              <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-3 gap-1.5">
                {dataKominfoCharts.map((chart, idx) => (
                  <div
                    key={idx}
                    className={`rounded-lg p-2 border transition-all group cursor-pointer ${isDark
                      ? 'bg-slate-800/50 border-white/10 hover:border-cyan-400/30'
                      : 'bg-white border-slate-200 hover:border-blue-400/50 shadow-sm'
                      }`}
                    title={chart.title}
                  >
                    <p className={`text-[8px] sm:text-[9px] font-semibold text-center mb-1 truncate transition-colors ${isDark ? 'text-slate-300 group-hover:text-cyan-300' : 'text-slate-700 group-hover:text-blue-600'}`}>
                      {chart.title}
                    </p>
                    <ResponsiveContainer width="100%" height={55}>
                      <PieChart>
                        <Pie data={chart.data} cx="50%" cy="50%" innerRadius={10} outerRadius={18} paddingAngle={1.5} dataKey="value">
                          {chart.data.map((entry, i) => (<Cell key={`cell-${i}`} fill={entry.color} />))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>

                    {/* Mini Legend */}
                    <div className={`text-[7px] mt-1 space-y-0.5 hidden sm:block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {chart.data.slice(0, 2).map((item, i) => (
                        <div key={i} className="flex items-center gap-0.5 truncate">
                          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                          <span className="truncate">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* === KANAN: CCTV + METRICS + MAP === */}
          <div className="flex-1 flex flex-col gap-3 sm:gap-4 min-w-0">

            {/* === ROW ATAS: CCTV + INTERNET TRAFFIC === */}
            <div className="flex flex-col md:flex-row gap-3 sm:gap-4 md:h-[340px]">

              {/* CCTV Live Feed */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`w-full md:w-1/2 lg:w-[540px] border rounded-2xl overflow-hidden shadow-xl flex flex-col md:shrink-0 min-h-[200px] sm:min-h-[250px] ${isDark
                  ? 'bg-slate-900/40 backdrop-blur-md border-white/20'
                  : 'bg-blue-950/30 backdrop-blur-md border-white/30'
                  }`}
              >
                <div className={`border-b px-3 sm:px-5 py-2 flex justify-between items-center shrink-0 ${isDark
                  ? 'bg-gradient-to-r from-purple-900/20 to-cyan-900/20 border-white/10'
                  : 'bg-gradient-to-r from-purple-900/15 to-cyan-900/15 border-white/10'
                  }`}>
                  <div>
                    <h3 className={`font-bold text-xs sm:text-sm ${headingStyle}`}>CCTV Live Feed</h3>
                    <p className={`text-[10px] sm:text-xs ${subTextStyle}`}>{cctv.location}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      to="/cctv-monitor"
                      className="text-[10px] sm:text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors hover:underline underline-offset-2"
                    >
                      Lihat Semua CCTV →
                    </Link>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-[10px] sm:text-xs font-bold text-red-400">{cctv.status}</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 bg-black/60 overflow-hidden">
                  {cctv.streamUrl ? (
                    <iframe
                      title="CCTV Live Stream"
                      src={`${cctv.streamUrl}${cctv.streamUrl.includes('?') ? '&' : '?'}autoplay=1&muted=1`}
                      width="100%" height="100%" className="border-0 w-full h-full"
                      allowFullScreen loading="eager"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; autoplay *"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-800/20 via-slate-900/50 to-slate-800/20 flex items-center justify-center">
                      <div className="text-center">
                        <svg className="w-10 h-10 sm:w-12 sm:h-12 text-slate-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <p className="text-slate-400 text-xs sm:text-sm">Live Video Stream</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Internet Traffic */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex-1 border rounded-2xl p-3 shadow-xl transition-all flex flex-col overflow-hidden min-w-0 ${cardStyle}`}
              >
                <h3 className={`font-bold text-xs sm:text-sm mb-3 px-1 flex items-center gap-2 ${headingStyle}`}>
                  <span className="w-2 h-2 rounded-full animate-pulse bg-cyan-400"></span>
                  Internet Traffic
                </h3>

                <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 sm:space-y-3">
                  {(trafficData ? trafficData.isp : [
                    { name: 'Nexa', download: '...', upload: '...', status: 'Online' as const, usage: 0, color: '#ef4444' },
                    { name: 'Astinet', download: '...', upload: '...', status: 'Online' as const, usage: 0, color: '#3b82f6' },
                    { name: 'Indibiz', download: '...', upload: '...', status: 'Online' as const, usage: 0, color: '#10b981' },
                  ]).map((isp, idx) => (
                    <div key={idx} className={`rounded-xl p-2.5 sm:p-3 border ${innerBoxStyle}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: isp.color }}></div>
                          <span className={`text-[11px] sm:text-xs font-bold ${headingStyle}`}>{isp.name}</span>
                        </div>
                        <span className="text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                          {isp.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div className={`rounded-lg p-2 border ${isDark ? 'bg-slate-900/40 border-white/5' : 'bg-white/5 border-white/10'}`}>
                          <p className={`text-[7px] sm:text-[8px] uppercase tracking-wider mb-0.5 ${labelStyle}`}>↓ RX (Download)</p>
                          <p className="text-sm sm:text-base font-bold text-cyan-400">{trafficLoading ? '...' : isp.download}</p>
                        </div>
                        <div className={`rounded-lg p-2 border ${isDark ? 'bg-slate-900/40 border-white/5' : 'bg-white/5 border-white/10'}`}>
                          <p className={`text-[7px] sm:text-[8px] uppercase tracking-wider mb-0.5 ${labelStyle}`}>↑ TX (Upload)</p>
                          <p className="text-sm sm:text-base font-bold text-blue-400">{trafficLoading ? '...' : isp.upload}</p>
                        </div>
                      </div>
                      {/* Usage Bar */}
                      <div className="w-full h-1.5 rounded-full overflow-hidden bg-slate-700">
                        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${isp.usage}%`, backgroundColor: isp.color }}></div>
                      </div>
                      <p className={`text-[7px] sm:text-[8px] mt-1 text-right ${subTextStyle}`}>{isp.usage}% dari total traffic</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* === ROW BAWAH: MAP + LOKASI PENTING === */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex-1 border rounded-2xl overflow-hidden shadow-xl flex flex-col min-h-[250px] sm:min-h-[300px] ${isDark
                ? 'bg-slate-900/40 backdrop-blur-md border-white/20'
                : 'bg-blue-950/30 backdrop-blur-md border-white/30'
                }`}
            >
              <div className={`border-b px-3 sm:px-5 py-2 shrink-0 ${isDark
                ? 'bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border-white/10'
                : 'bg-gradient-to-r from-cyan-900/15 to-blue-900/15 border-white/10'
                }`}>
                <h3 className={`font-bold text-xs sm:text-sm ${headingStyle}`}>Peta Interaktif Pati</h3>
              </div>
              <div className="flex-1 flex flex-col sm:flex-row min-h-0">
                {/* Map */}
                <div className="flex-1 overflow-hidden min-h-[180px] sm:min-h-0">
                  <iframe title="Google Map Pati" src={mapSrc} width="100%" height="100%" className="border-0" />
                </div>

                {/* Sidebar Lokasi Penting */}
                <div className={`w-full sm:w-48 lg:w-56 sm:border-l border-t sm:border-t-0 p-2 sm:p-3 overflow-y-auto no-scrollbar shrink-0 ${isDark
                  ? 'bg-slate-900/60 border-white/10'
                  : 'bg-white/10 border-white/10'
                  }`}>
                  <h4 className="text-[10px] sm:text-xs font-semibold mb-2 uppercase tracking-wider text-slate-300">Lokasi Penting</h4>
                  <div className="flex sm:flex-col gap-1.5 overflow-x-auto sm:overflow-x-visible no-scrollbar pb-1 sm:pb-0">
                    {mapLocations.map(loc => (
                      <button
                        key={loc.id}
                        className={`flex-shrink-0 sm:flex-shrink sm:w-full text-left rounded-lg p-2 flex items-center gap-2 sm:gap-2.5 transition-all border min-w-[140px] sm:min-w-0 bg-white/5 hover:bg-white/15 active:bg-white/20 border-transparent hover:border-cyan-400/30`}
                        onClick={() => handleLocationClick(loc.lat, loc.lng)}
                      >
                        <div className="text-base sm:text-lg leading-none">{loc.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-[10px] sm:text-[11px] font-medium truncate ${headingStyle}`}>{loc.name}</div>
                          <div className={`text-[8px] sm:text-[9px] truncate ${subTextStyle}`}>{loc.address}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div >

      </div >
    </SmartCityLayout >
  );
};

export default Kominfo;