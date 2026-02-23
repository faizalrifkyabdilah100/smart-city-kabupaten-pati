import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SmartCityLayout from '../components/layout/SmartCityLayout';
import { motion } from 'framer-motion';
import { mapLocations } from '../data/dashboardData';
import { formatTanggal } from '../utils/formatTanggal';
import { useTheme } from '../hooks/useTheme';
import { fetchTrafficData, transformTrafficData } from '../services/trafficApi';
import { fetchCctvData } from '../services/cctvApi';
import type { CctvMain } from '../services/cctvApi';
import { fetchServerData, fetchServerData2, calcPercent, formatGB, formatMHz, getUsageColor } from '../services/serverApi';
import type { ServerData } from '../services/serverApi';
import { ServerPanel } from '../components/kominfo/ServerPanel';
import { ServerGauges } from '../components/kominfo/ServerGauges';
import { TrafficCard } from '../components/kominfo/TrafficCard';
import { ModalOverlay } from '../components/common/ModalOverlay';

const DEFAULT_MAP_URL = 'https://www.google.com/maps?q=-6.7578,111.1245&z=13&output=embed';

/** Mini Donut Chart untuk satu metrik (CPU/Memory/Storage) */
// MiniGauge dipindahkan ke components/kominfo/ServerGauges.tsx
// ServerPanel dipindahkan ke components/kominfo/ServerPanel.tsx

const Kominfo: React.FC = () => {
  const [mapSrc, setMapSrc] = useState(DEFAULT_MAP_URL);
  const { isDark } = useTheme();

  // === EXPAND SERVER DETAIL STATE ===
  const [expandedServer, setExpandedServer] = useState<{ server: ServerData; source: string } | null>(null);

  // === EXPAND TRAFFIC DETAIL STATE ===
  const [expandedTraffic, setExpandedTraffic] = useState<{ name: string; download: string; upload: string; status: string; usage: number; color: string } | null>(null);

  // === TRAFFIC DATA STATE ===
  const [trafficData, setTrafficData] = useState<ReturnType<typeof transformTrafficData> | null>(null);
  const [trafficLoading, setTrafficLoading] = useState(true);

  // === CCTV DATA STATE ===
  const [cctvData, setCctvData] = useState<CctvMain | null>(null);

  // === SERVER MONITORING STATE ===
  const [serverData, setServerData] = useState<ServerData[] | null>(null);
  const [serverLoading, setServerLoading] = useState(true);

  // === SERVER MONITORING 2 STATE ===
  const [serverData2, setServerData2] = useState<ServerData[] | null>(null);
  const [serverLoading2, setServerLoading2] = useState(true);

  useEffect(() => {
    // Load CCTV data dari backend
    const loadCctv = async () => {
      const data = await fetchCctvData();
      if (data) {
        setCctvData(data.main);
      }
    };
    loadCctv();
  }, []);

  // Auto-refresh traffic setiap 1 detik
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
    const interval = setInterval(loadTraffic, 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Auto-refresh server monitoring setiap 1 detik
  useEffect(() => {
    let isMounted = true;

    const loadServers = async () => {
      const data = await fetchServerData();
      if (data && isMounted) {
        setServerData(data);
      }
      if (isMounted) setServerLoading(false);
    };

    loadServers();
    const interval = setInterval(loadServers, 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Auto-refresh server monitoring 2 setiap 5 detik
  useEffect(() => {
    let isMounted = true;

    const loadServers2 = async () => {
      const data = await fetchServerData2();
      if (data && isMounted) {
        setServerData2(data);
      }
      if (isMounted) setServerLoading2(false);
    };

    loadServers2();
    const interval = setInterval(loadServers2, 5000);

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
  const headingStyle = 'text-white';
  const subTextStyle = isDark ? 'text-slate-400' : 'text-blue-100';

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

          {/* === SERVER MONITORING === */}
          {/* === SERVER MONITORING 1 (ServerPanel Reusable) === */}
          <ServerPanel
            title="Server Monitoring"
            data={serverData}
            loading={serverLoading}
            isDark={isDark}
            onExpand={(server) => setExpandedServer({ server, source: 'Server Monitoring' })}
            accentColor={isDark ? 'bg-cyan-400' : 'bg-blue-500'}
            pulseColor={isDark ? 'bg-cyan-400' : 'bg-blue-500'}
            hoverBorderColor="hover:border-cyan-400/30"
            apiHint="SERVER_API_URL"
          />

          {/* === SERVER MONITORING 2 === */}
          {/* === SERVER MONITORING 2 (ServerPanel Reusable) === */}
          <ServerPanel
            title="Server Monitoring 2"
            data={serverData2}
            loading={serverLoading2}
            isDark={isDark}
            onExpand={(server) => setExpandedServer({ server, source: 'Server Monitoring 2' })}
            accentColor={isDark ? 'bg-purple-400' : 'bg-purple-500'}
            pulseColor={isDark ? 'bg-purple-400' : 'bg-purple-500'}
            hoverBorderColor="hover:border-purple-400/30"
            apiHint="SERVER_API_URL_2"
          />

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
                    <p className={`text-[10px] sm:text-xs ${subTextStyle}`}>{cctvData?.location || 'Memuat...'}</p>
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
                      <span className="text-[10px] sm:text-xs font-bold text-red-400">{cctvData?.status || 'Live'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 bg-black/60 overflow-hidden">
                  {cctvData?.streamUrl ? (
                    <iframe
                      title="CCTV Live Stream"
                      src={`${cctvData.streamUrl}${cctvData.streamUrl.includes('?') ? '&' : '?'}autoplay=1&muted=1`}
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
                    <TrafficCard
                      key={idx}
                      isp={isp}
                      loading={trafficLoading}
                      isDark={isDark}
                      onExpand={setExpandedTraffic}
                    />
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

      {/* === EXPANDED SERVER DETAIL OVERLAY === */}
      <ModalOverlay
        isOpen={!!expandedServer}
        onClose={() => setExpandedServer(null)}
        isDark={isDark}
      >
        {expandedServer && (
          <>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className={`text-[10px] sm:text-xs font-mono mb-1 ${isDark ? 'text-cyan-400' : 'text-cyan-300'}`}>
                  {expandedServer.source}
                </p>
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  🖥️ {expandedServer.server.label}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                {expandedServer.server.error ? (
                  <span className="text-xs px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-semibold">
                    Offline
                  </span>
                ) : (
                  <span className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 font-semibold">
                    Online
                  </span>
                )}
                <button
                  onClick={() => setExpandedServer(null)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white bg-white/10 hover:bg-red-500/20 hover:text-red-400 transition-colors text-sm"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Body */}
            {expandedServer.server.error ? (
              <div className={`rounded-xl p-6 border text-center ${isDark ? 'bg-red-900/10 border-red-500/20' : 'bg-red-500/10 border-red-400/20'}`}>
                <svg className="w-12 h-12 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-red-400 text-sm sm:text-base font-semibold mb-1">Server Tidak Merespons</p>
                <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-500' : 'text-blue-300'}`}>{expandedServer.server.error}</p>
              </div>
            ) : expandedServer.server.resources ? (
              <div className={`rounded-xl p-4 sm:p-6 border ${isDark ? 'bg-slate-800/30 border-white/5' : 'bg-white/5 border-white/10'}`}>
                {/* Reusable Server Gauges */}
                <ServerGauges
                  resources={expandedServer.server.resources}
                  isDark={isDark}
                  expanded
                />

                {/* Detail Table */}
                <div className={`mt-6 rounded-lg border overflow-hidden ${isDark ? 'border-white/10' : 'border-white/15'}`}>
                  <table className="w-full text-xs sm:text-sm">
                    <thead>
                      <tr className={isDark ? 'bg-slate-800/60' : 'bg-white/10'}>
                        <th className="text-left px-3 py-2 text-slate-400 font-semibold">Metrik</th>
                        <th className="text-right px-3 py-2 text-slate-400 font-semibold">Terpakai</th>
                        <th className="text-right px-3 py-2 text-slate-400 font-semibold">Kapasitas</th>
                        <th className="text-right px-3 py-2 text-slate-400 font-semibold">%</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className={`border-t ${isDark ? 'border-white/5' : 'border-white/10'}`}>
                        <td className="px-3 py-2 text-white font-medium">⚡ CPU</td>
                        <td className="px-3 py-2 text-right text-white">{formatMHz(expandedServer.server.resources.cpu.usedMHz)}</td>
                        <td className="px-3 py-2 text-right text-slate-400">{formatMHz(expandedServer.server.resources.cpu.capacityMHz)}</td>
                        <td className="px-3 py-2 text-right font-bold" style={{ color: getUsageColor(calcPercent(expandedServer.server.resources.cpu.usedMHz, expandedServer.server.resources.cpu.capacityMHz)) }}>
                          {calcPercent(expandedServer.server.resources.cpu.usedMHz, expandedServer.server.resources.cpu.capacityMHz)}%
                        </td>
                      </tr>
                      <tr className={`border-t ${isDark ? 'border-white/5' : 'border-white/10'}`}>
                        <td className="px-3 py-2 text-white font-medium">🧠 Memory</td>
                        <td className="px-3 py-2 text-right text-white">{formatGB(expandedServer.server.resources.memory.usedGB)}</td>
                        <td className="px-3 py-2 text-right text-slate-400">{formatGB(expandedServer.server.resources.memory.capacityGB)}</td>
                        <td className="px-3 py-2 text-right font-bold" style={{ color: getUsageColor(calcPercent(expandedServer.server.resources.memory.usedGB, expandedServer.server.resources.memory.capacityGB)) }}>
                          {calcPercent(expandedServer.server.resources.memory.usedGB, expandedServer.server.resources.memory.capacityGB)}%
                        </td>
                      </tr>
                      <tr className={`border-t ${isDark ? 'border-white/5' : 'border-white/10'}`}>
                        <td className="px-3 py-2 text-white font-medium">💾 Storage</td>
                        <td className="px-3 py-2 text-right text-white">{formatGB(expandedServer.server.resources.storage.usedGB)}</td>
                        <td className="px-3 py-2 text-right text-slate-400">{formatGB(expandedServer.server.resources.storage.capacityGB)}</td>
                        <td className="px-3 py-2 text-right font-bold" style={{ color: getUsageColor(calcPercent(expandedServer.server.resources.storage.usedGB, expandedServer.server.resources.storage.capacityGB)) }}>
                          {calcPercent(expandedServer.server.resources.storage.usedGB, expandedServer.server.resources.storage.capacityGB)}%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}
          </>
        )}
      </ModalOverlay>

      {/* === EXPANDED TRAFFIC DETAIL OVERLAY === */}
      <ModalOverlay
        isOpen={!!expandedTraffic}
        onClose={() => setExpandedTraffic(null)}
        isDark={isDark}
        maxWidth="max-w-md"
      >
        {expandedTraffic && (
          <>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: expandedTraffic.color }}></div>
                <div>
                  <p className={`text-[10px] sm:text-xs font-mono mb-0.5 ${isDark ? 'text-cyan-400' : 'text-cyan-300'}`}>
                    Internet Traffic
                  </p>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    {expandedTraffic.name}
                  </h2>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 font-semibold">
                  {expandedTraffic.status}
                </span>
                <button
                  onClick={() => setExpandedTraffic(null)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white bg-white/10 hover:bg-red-500/20 hover:text-red-400 transition-colors text-sm"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Traffic Stats */}
            <div className={`rounded-xl p-4 sm:p-6 border ${isDark ? 'bg-slate-800/30 border-white/5' : 'bg-white/5 border-white/10'}`}>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Download */}
                <div className={`rounded-xl p-4 border text-center ${isDark ? 'bg-slate-900/50 border-white/5' : 'bg-white/5 border-white/10'}`}>
                  <p className={`text-xs uppercase tracking-wider mb-2 ${isDark ? 'text-slate-500' : 'text-blue-300'}`}>
                    ↓ RX (Download)
                  </p>
                  <p className="text-2xl sm:text-3xl font-black text-cyan-400">
                    {expandedTraffic.download}
                  </p>
                </div>
                {/* Upload */}
                <div className={`rounded-xl p-4 border text-center ${isDark ? 'bg-slate-900/50 border-white/5' : 'bg-white/5 border-white/10'}`}>
                  <p className={`text-xs uppercase tracking-wider mb-2 ${isDark ? 'text-slate-500' : 'text-blue-300'}`}>
                    ↑ TX (Upload)
                  </p>
                  <p className="text-2xl sm:text-3xl font-black text-blue-400">
                    {expandedTraffic.upload}
                  </p>
                </div>
              </div>

              {/* Usage Bar Large */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-blue-200'}`}>
                    Proporsi Total Traffic
                  </span>
                  <span className="text-sm font-bold text-white">
                    {expandedTraffic.usage}%
                  </span>
                </div>
                <div className={`w-full h-4 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-white/15'}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${expandedTraffic.usage}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: expandedTraffic.color }}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </ModalOverlay>

    </SmartCityLayout >
  );
};

export default Kominfo;