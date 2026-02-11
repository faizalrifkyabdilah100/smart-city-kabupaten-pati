import React, { useState } from 'react';
import SmartCityLayout from '../components/layout/SmartCityLayout';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { dataKominfoCharts, dataTrafikInternet, cctv, mapLocations } from '../data/dashboardData';

const Kominfo: React.FC = () => {
  const [mapZoom] = useState(1);

  return (
    <SmartCityLayout>
      <div className="w-full flex flex-col gap-3 px-6 pb-6">

        {/* === HEADER === */}
        <div className="w-full py-3 flex justify-between items-start animate-slide-down shrink-0 z-20">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight drop-shadow-lg">
              Portal <span className="text-purple-400">Kominfo</span>
            </h1>
            <p className="text-slate-300 text-sm md:text-base font-light">Dashboard Informasi & Monitoring Media Sosial</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-white font-mono text-xs md:text-sm shadow-lg">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>

        {/* === MAIN LAYOUT: LEFT (full height) + RIGHT (2 rows) === */}
        <div className="flex gap-4 z-10" style={{ height: '720px' }}>

          {/* ============================= */}
          {/* === KIRI: DATA ANALYTICS (FULL HEIGHT) === */}
          {/* ============================= */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-80 bg-slate-900/40 backdrop-blur-md border border-white/20 rounded-2xl p-3 shadow-xl hover:border-cyan-400/50 transition-all flex flex-col overflow-hidden shrink-0"
          >
            <h3 className="text-white font-bold text-sm mb-3 px-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
              Data Analytics (15 Metrics)
            </h3>

            <div className="flex-1 overflow-y-auto no-scrollbar">
              <div className="grid grid-cols-3 gap-1.5">
                {dataKominfoCharts.map((chart, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-800/50 rounded-lg p-2 border border-white/10 hover:border-cyan-400/30 transition-all group cursor-pointer"
                    title={chart.title}
                  >
                    <p className="text-[9px] text-slate-300 font-semibold text-center mb-1 truncate group-hover:text-cyan-300 transition-colors">
                      {chart.title}
                    </p>
                    <ResponsiveContainer width="100%" height={65}>
                      <PieChart>
                        <Pie
                          data={chart.data}
                          cx="50%"
                          cy="50%"
                          innerRadius={12}
                          outerRadius={22}
                          paddingAngle={1.5}
                          dataKey="value"
                        >
                          {chart.data.map((entry, i) => (
                            <Cell key={`cell-${i}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>

                    {/* Mini Legend */}
                    <div className="text-[7px] text-slate-400 mt-1 space-y-0.5">
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

          {/* ============================= */}
          {/* === KANAN: 2 ROWS (CCTV+METRICS di atas, MAP di bawah) === */}
          {/* ============================= */}
          <div className="flex-1 flex flex-col gap-4 min-w-0">

            {/* === ROW ATAS: CCTV + SERVER METRICS === */}
            <div className="flex gap-4" style={{ height: '340px' }}>

              {/* CCTV Live Feed */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-[540px] bg-slate-900/40 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-xl flex flex-col shrink-0"
              >
                <div className="bg-gradient-to-r from-purple-900/20 to-cyan-900/20 border-b border-white/10 px-5 py-2 flex justify-between items-center shrink-0">
                  <div>
                    <h3 className="text-white font-bold text-sm">CCTV Live Feed</h3>
                    <p className="text-slate-400 text-xs">{cctv.location}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-400 text-xs font-bold">{cctv.status}</span>
                  </div>
                </div>
                <div className="flex-1 bg-black/60 overflow-hidden">
                  {cctv.streamUrl ? (
                    <iframe
                      title="CCTV Live Stream"
                      src={cctv.streamUrl}
                      width="100%"
                      height="100%"
                      className="border-0 w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-800/20 via-slate-900/50 to-slate-800/20 flex items-center justify-center">
                      <div className="text-center">
                        <svg className="w-12 h-12 text-slate-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <p className="text-slate-400 text-sm">Live Video Stream</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Internet Traffic */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-1 bg-slate-900/40 backdrop-blur-md border border-white/20 rounded-2xl p-3 shadow-xl hover:border-cyan-400/50 transition-all flex flex-col overflow-hidden min-w-0"
              >
                <h3 className="text-white font-bold text-sm mb-3 px-1 flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                  Internet Traffic
                </h3>

                <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
                  {/* Summary Stats Row */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-800/50 rounded-lg p-2 border border-white/10">
                      <p className="text-[9px] text-slate-400 uppercase tracking-wider">Bandwidth</p>
                      <p className="text-cyan-400 text-lg font-bold">{dataTrafikInternet.totalBandwidth}</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-2 border border-white/10">
                      <p className="text-[9px] text-slate-400 uppercase tracking-wider">Active Users</p>
                      <p className="text-green-400 text-lg font-bold">{dataTrafikInternet.activeUsers}</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-2 border border-white/10">
                      <p className="text-[9px] text-slate-400 uppercase tracking-wider">Total Requests</p>
                      <p className="text-purple-400 text-lg font-bold">{dataTrafikInternet.totalRequests}</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-2 border border-white/10">
                      <p className="text-[9px] text-slate-400 uppercase tracking-wider">Uptime</p>
                      <p className="text-emerald-400 text-lg font-bold">{dataTrafikInternet.uptime}</p>
                    </div>
                  </div>

                  {/* ISP Details */}
                  <div className="space-y-2">
                    {dataTrafikInternet.isp.map((isp, idx) => (
                      <div key={idx} className="bg-slate-800/50 rounded-lg p-2.5 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white text-xs font-semibold">{isp.name}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                            {isp.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mb-2">
                          <div>
                            <p className="text-[8px] text-slate-500">↓ Download</p>
                            <p className="text-xs text-cyan-300 font-bold">{isp.download}</p>
                          </div>
                          <div>
                            <p className="text-[8px] text-slate-500">↑ Upload</p>
                            <p className="text-xs text-blue-300 font-bold">{isp.upload}</p>
                          </div>
                          <div>
                            <p className="text-[8px] text-slate-500">⏱ Latency</p>
                            <p className="text-xs text-yellow-300 font-bold">{isp.latency}</p>
                          </div>
                        </div>
                        {/* Usage Bar */}
                        <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${isp.usage}%`, backgroundColor: isp.color }}
                          ></div>
                        </div>
                        <p className="text-[8px] text-slate-400 mt-1 text-right">{isp.usage}% capacity</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* === ROW BAWAH: MAP + LOKASI PENTING === */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 bg-slate-900/40 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-xl flex flex-col min-h-0"
            >
              <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border-b border-white/10 px-5 py-2 shrink-0">
                <h3 className="text-white font-bold text-sm">Peta Interaktif Pati</h3>
              </div>
              <div className="flex-1 flex min-h-0">
                {/* Map */}
                <div className="flex-1 overflow-hidden">
                  <iframe
                    title="Google Map Pati"
                    src={`https://www.google.com/maps?q=-6.7578,111.1245&z=${Math.round(mapZoom * 13)}&output=embed`}
                    width="100%"
                    height="100%"
                    className="border-0"
                  />
                </div>

                {/* Sidebar Lokasi Penting */}
                <div className="w-56 bg-slate-900/60 border-l border-white/10 p-3 overflow-y-auto no-scrollbar shrink-0">
                  <h4 className="text-white text-xs font-semibold mb-2 uppercase tracking-wider text-slate-300">Lokasi Penting</h4>
                  <div className="space-y-1.5">
                    {mapLocations.map(loc => (
                      <button
                        key={loc.id}
                        className="w-full text-left bg-slate-800/40 hover:bg-slate-700/60 rounded-lg p-2 flex items-center gap-2.5 transition-all border border-transparent hover:border-cyan-400/30"
                        onClick={() => {
                          const iframe = document.querySelector<HTMLIFrameElement>('iframe[title="Google Map Pati"]');
                          if (iframe) {
                            iframe.src = `https://www.google.com/maps?q=${loc.lat},${loc.lng}&z=15&output=embed`;
                          }
                        }}
                      >
                        <div className="text-lg leading-none">{loc.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-[11px] font-medium truncate">{loc.name}</div>
                          <div className="text-slate-400 text-[9px] truncate">{loc.address}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

      </div>
    </SmartCityLayout>
  );
};

export default Kominfo;