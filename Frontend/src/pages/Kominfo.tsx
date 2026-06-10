import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SmartCityLayout from '../components/layout/SmartCityLayout';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { useThemeStyles } from '../hooks/useThemeStyles';
import { fetchTrafficData, transformTrafficData } from '../services/trafficApi';
import { fetchCctvData } from '../services/cctvApi';
import type { CctvMain } from '../services/cctvApi';
import { fetchServerData, fetchServerData2, fetchVmServerData, calcPercent, formatGB, formatMHz, getUsageColor } from '../services/serverApi';
import type { ServerData } from '../services/serverApi';
import { ServerPanel } from '../components/kominfo/ServerPanel';
import { ServerGauges } from '../components/kominfo/ServerGauges';
import { TrafficCard } from '../components/kominfo/TrafficCard';
import { ModalOverlay } from '../components/common/ModalOverlay';
import { MenaraMap } from '../components/kominfo/MenaraMap';
import { fetchMenaraData } from '../services/menaraApi';
import type { MenaraData } from '../services/menaraApi';
import MenaraSidebar from '../components/kominfo/MenaraSidebar';
import CctvPlayer from '../components/kominfo/CctvPlayer';
import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { Spinner } from '../components/common/Spinner';

const Kominfo: React.FC = () => {
  const { isDark } = useTheme();
  const {
    cardStyle,
    cardStyleFlat,
    headingStyle,
    subTextStyle,
    cardHeaderStyle,
    sidebarStyle,
    closeButtonStyle,
  } = useThemeStyles();

  // === EXPAND SERVER DETAIL STATE ===
  const [expandedServer, setExpandedServer] = useState<{ server: ServerData; source: string } | null>(null);

  // === EXPAND TRAFFIC DETAIL STATE ===
  const [expandedTraffic, setExpandedTraffic] = useState<{ name: string; download: string; upload: string; status: string; usage: number; color: string } | null>(null);

  // === TRAFFIC DATA STATE ===
  const [trafficData, setTrafficData] = useState<ReturnType<typeof transformTrafficData> | null>(null);
  const [trafficLoading, setTrafficLoading] = useState(true);
  const [trafficError, setTrafficError] = useState(false);

  // === CCTV DATA STATE ===
  const [cctvData, setCctvData] = useState<CctvMain | null>(null);

  // === SERVER MONITORING STATE ===
  const [serverData, setServerData] = useState<ServerData[] | null>(null);
  const [serverLoading, setServerLoading] = useState(true);
  const [serverError, setServerError] = useState(false);

  // === SERVER MONITORING 2 STATE ===
  const [serverData2, setServerData2] = useState<ServerData[] | null>(null);
  const [serverLoading2, setServerLoading2] = useState(true);
  const [serverError2, setServerError2] = useState(false);

  // === VM SERVER STATE ===
  const [vmData, setVmData] = useState<ServerData[] | null>(null);
  const [vmLoading, setVmLoading] = useState(true);
  const [vmError, setVmError] = useState(false);

  // === MENARA DATA STATE ===
  const [menaraData, setMenaraData] = useState<MenaraData[]>([]);
  const [menaraLoading, setMenaraLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-6.7578, 111.1245]);
  const [mapZoom, setMapZoom] = useState(13);

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

  // Auto-refresh traffic & server monitoring setiap 2 detik (Consolidated)
  useEffect(() => {
    let isMounted = true;

    const loadRealtimeData = async () => {
      const [rawTraffic, rawServers] = await Promise.all([
        fetchTrafficData(),
        fetchServerData()
      ]);

      if (!isMounted) return;

      if (rawTraffic) {
        setTrafficData(transformTrafficData(rawTraffic));
        setTrafficError(false);
      } else {
        setTrafficError(true);
      }
      setTrafficLoading(false);

      if (rawServers) {
        setServerData(rawServers);
        setServerError(false);
      } else {
        setServerError(true);
      }
      setServerLoading(false);
    };

    loadRealtimeData();
    const interval = setInterval(loadRealtimeData, 2000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Auto-refresh server monitoring 2
  useEffect(() => {
    let isMounted = true;

    const loadServers2 = async () => {
      const data = await fetchServerData2();
      if (data && isMounted) {
        setServerData2(data);
        setServerError2(false);
      } else if (isMounted) {
        setServerError2(true);
      }
      if (isMounted) setServerLoading2(false);
    };

    loadServers2();
    const interval = setInterval(loadServers2, 500000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Auto-refresh VM monitoring setiap 10 detik
  useEffect(() => {
    let isMounted = true;

    const loadVms = async () => {
      const data = await fetchVmServerData();
      if (data && isMounted) {
        setVmData(data);
        setVmError(false);
      } else if (isMounted) {
        setVmError(true);
      }
      if (isMounted) setVmLoading(false);
    };

    loadVms();
    const interval = setInterval(loadVms, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Fetch Menara Data
  useEffect(() => {
    const loadMenara = async () => {
      const data = await fetchMenaraData();
      setMenaraData(data);
      setMenaraLoading(false);
    };
    loadMenara();
  }, []);

  const handleLocationClick = useCallback((lat: number, lng: number) => {
    setMapCenter([lat, lng]);
    setMapZoom(17);
  }, []);

  return (
    <SmartCityLayout>
      <div className="w-full flex flex-col gap-3 px-3 sm:px-4 lg:px-6 pb-6">

        {/* === HEADER === */}
        <PageHeader
          title="Portal"
          titleAccent="Kominfo"
          titleAccentColor="text-purple-400"
          subtitle="Dashboard Informasi & Monitoring Media Sosial"
        />

        {/* === MAIN LAYOUT === */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-12 gap-3 sm:gap-4 z-10 w-full lg:flex-1" style={{ minHeight: 0 }}>

          {/* === SERVER MONITORING === */}
          <div className="flex flex-col gap-3 sm:gap-4 lg:col-span-1 xl:col-span-3 min-h-0">
            <ServerPanel
              title="Server Monitoring"
              data={serverData}
              loading={serverLoading}
              error={serverError}
              isDark={isDark}
              onExpand={(server) => setExpandedServer({ server, source: 'Server Monitoring' })}
              accentColor={isDark ? 'bg-cyan-400' : 'bg-blue-500'}
              pulseColor={isDark ? 'bg-cyan-400' : 'bg-blue-500'}
              hoverBorderColor="hover:border-cyan-400/30"
              apiHint="SERVER_API_URL"
            />

            <ServerPanel
              title="Status Server Provider"
              data={vmData}
              loading={vmLoading}
              error={vmError}
              isDark={isDark}
              onExpand={(server) => setExpandedServer({ server, source: 'Status Server Provider' })}
              accentColor={isDark ? 'bg-emerald-400' : 'bg-emerald-500'}
              pulseColor={isDark ? 'bg-emerald-400' : 'bg-emerald-500'}
              hoverBorderColor="hover:border-emerald-400/30"
              apiHint="VM_SERVER_API"
            />
          </div>

          {/* === SERVER MONITORING 2 === */}
          <div className="flex flex-col gap-3 sm:gap-4 lg:col-span-1 xl:col-span-3 min-h-0">
            <ServerPanel
              title="Server Monitoring 2"
              data={serverData2}
              loading={serverLoading2}
              error={serverError2}
              isDark={isDark}
              onExpand={(server) => setExpandedServer({ server, source: 'Server Monitoring 2' })}
              accentColor={isDark ? 'bg-purple-400' : 'bg-purple-500'}
              pulseColor={isDark ? 'bg-purple-400' : 'bg-purple-500'}
              hoverBorderColor="hover:border-purple-400/30"
              apiHint="SERVER_API_URL_2"
            />
          </div>

          {/* === KANAN: CCTV + METRICS + MAP === */}
          <div className="lg:col-span-2 xl:col-span-6 flex flex-col gap-3 sm:gap-4 min-w-0">

            {/* === ROW ATAS: CCTV + INTERNET TRAFFIC === */}
            <div className="flex flex-col md:flex-row gap-3 sm:gap-4 md:h-[350px]">

              {/* CCTV Live Feed */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`md:flex-[3] w-full border rounded-2xl overflow-hidden shadow-xl flex flex-col min-h-[200px] sm:min-h-[250px] md:min-h-0 min-w-0 ${cardStyleFlat}`}
              >
                <div className={`border-b px-3 sm:px-5 py-2 flex justify-between items-center shrink-0 ${cardHeaderStyle}`}>
                  <div>
                    <h3 className={`font-bold text-xs sm:text-sm ${headingStyle}`}>CCTV Live Feed</h3>
                    <p className={`text-[10px] sm:text-xs ${subTextStyle}`}>{cctvData?.location || 'Memuat...'}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      to="/cctv-monitor"
                      className="backdrop-blur-md bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 hover:border-cyan-400/50 px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium text-cyan-400 hover:text-cyan-300 shadow-lg transition-all duration-300 flex items-center gap-1.5"
                    >
                      Lihat Semua CCTV
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-[10px] sm:text-xs font-bold text-red-400">{cctvData?.status || 'Live'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 bg-black/60 overflow-hidden">
                  <CctvPlayer streamUrl={cctvData?.streamUrl} />
                </div>
              </motion.div>

              {/* Internet Traffic */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`md:flex-[2] w-full border rounded-2xl p-3 shadow-xl transition-all flex flex-col overflow-hidden min-w-0 ${cardStyle}`}
              >
                <h3 className={`font-bold text-xs sm:text-sm mb-2 px-1 flex items-center gap-2 ${headingStyle}`}>
                  <span className={`w-2 h-2 rounded-full animate-pulse ${trafficError ? 'bg-red-400' : 'bg-cyan-400'}`}></span>
                  Internet Traffic
                  {trafficError && (
                    <span className="text-[8px] font-medium text-red-400/80 bg-red-400/10 border border-red-400/20 px-1.5 py-0.5 rounded">
                      Offline
                    </span>
                  )}
                </h3>

                <div className="flex-1 overflow-y-auto no-scrollbar space-y-1.5 sm:space-y-2">
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

            {/* === ROW BAWAH: MAP + DAFTAR MENARA === */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`md:h-[450px] border rounded-2xl overflow-hidden shadow-xl flex flex-col ${cardStyleFlat}`}
            >
              <div className={`border-b px-3 sm:px-5 py-2 shrink-0 ${isDark
                ? 'bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border-white/10'
                : 'bg-gradient-to-r from-cyan-900/15 to-blue-900/15 border-white/10'
                }`}>
                <h3 className={`font-bold text-xs sm:text-sm ${headingStyle}`}>Map Pemetaan Menara</h3>
              </div>
              <div className="flex-1 flex flex-col sm:flex-row min-h-0">
                {/* Map */}
                <div className="flex-1 overflow-hidden min-h-[180px] sm:min-h-0 relative">
                  {menaraLoading ? (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800/20">
                      <Spinner size="md" color="border-cyan-400" label="Memuat Peta Menara..." isDark={isDark} />
                    </div>
                  ) : (
                    <MenaraMap
                      data={menaraData}
                      center={mapCenter}
                      zoom={mapZoom}
                    />
                  )}
                </div>

                {/* Sidebar Menara */}
                <div className={`w-full sm:w-48 lg:w-56 sm:border-l border-t sm:border-t-0 p-2 sm:p-3 overflow-y-auto no-scrollbar shrink-0 ${sidebarStyle}`}>
                  <div className="flex justify-between items-center mb-2 px-1">
                    <h4 className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-300">Daftar Menara</h4>
                    <span className="text-[9px] text-cyan-400 font-mono">{menaraData.length}</span>
                  </div>
                  <MenaraSidebar
                    data={menaraData}
                    loading={menaraLoading}
                    onItemClick={handleLocationClick}
                  />
                </div>
              </div>
            </motion.div>

          </div>
        </div>

      </div>

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
                <StatusBadge
                  status={expandedServer.server.error ? 'Offline' : 'Online'}
                  size="sm"
                />
                <button
                  onClick={() => setExpandedServer(null)}
                  className={closeButtonStyle}
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
                <StatusBadge status={expandedTraffic.status} size="sm" />
                <button
                  onClick={() => setExpandedTraffic(null)}
                  className={closeButtonStyle}
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

    </SmartCityLayout>
  );
};

export default Kominfo;