import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import SmartCityLayout from '../components/layout/SmartCityLayout';
import { formatTanggal } from '../utils/formatTanggal';
import { fetchCctvData } from '../services/cctvApi';
import type { CctvItem } from '../services/cctvApi';

const CCTVMonitor: React.FC = () => {
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const [cctvList, setCctvList] = useState<CctvItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCctv = async () => {
            const data = await fetchCctvData();
            if (data) {
                setCctvList(data.list);
            }
            setLoading(false);
        };
        loadCctv();
    }, []);

    const cardStyle = isDark
        ? 'bg-slate-900/40 backdrop-blur-md border-white/20'
        : 'bg-blue-950/30 backdrop-blur-md border-white/30';

    const subTextStyle = isDark ? 'text-slate-400' : 'text-blue-100';

    return (
        <SmartCityLayout>
            <div className="w-full flex flex-col gap-3 px-3 sm:px-4 lg:px-6 pb-6">

                {/* === HEADER === */}
                <div className="w-full py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 animate-slide-down shrink-0 z-20">
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight drop-shadow-lg text-white">
                            Monitoring <span className="text-cyan-400">CCTV</span>
                        </h1>
                        <p className={`text-xs sm:text-sm lg:text-base font-light ${subTextStyle}`}>
                            Pantau seluruh CCTV Kabupaten Pati secara realtime
                        </p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            onClick={() => navigate('/kominfo')}
                            className="backdrop-blur-md bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 hover:border-cyan-400/50 px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs lg:text-sm font-medium text-cyan-400 hover:text-cyan-300 shadow-lg transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Kembali
                        </button>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-[10px] sm:text-xs font-bold text-red-400">LIVE</span>
                        </div>
                        <div className="backdrop-blur-md bg-white/10 border-white/20 border px-3 sm:px-4 py-1.5 rounded-full font-mono text-[10px] sm:text-xs lg:text-sm shadow-lg text-white">
                            {formatTanggal()}
                        </div>
                    </div>
                </div>

                {/* === CCTV GRID 3x3 === */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                            <p className="text-slate-400 text-sm">Memuat data CCTV...</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 z-10">
                        {cctvList.map((cam, idx) => (
                            <motion.div
                                key={cam.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.08, duration: 0.4 }}
                                className={`border rounded-2xl overflow-hidden shadow-xl flex flex-col ${cardStyle} hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300`}
                            >
                                {/* Camera Header */}
                                <div className={`border-b px-3 sm:px-4 py-2 flex justify-between items-center shrink-0 ${isDark
                                    ? 'bg-gradient-to-r from-purple-900/20 to-cyan-900/20 border-white/10'
                                    : 'bg-gradient-to-r from-purple-900/15 to-cyan-900/15 border-white/10'
                                    }`}>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-bold text-[11px] sm:text-xs text-white truncate">{cam.name}</h3>
                                        <p className={`text-[9px] sm:text-[10px] truncate ${subTextStyle}`}>{cam.location}</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                                        <span className="text-[9px] sm:text-[10px] font-bold text-red-400">Live</span>
                                    </div>
                                </div>

                                {/* Camera Stream */}
                                <div className="aspect-video bg-black/60 overflow-hidden">
                                    {cam.streamUrl ? (
                                        <iframe
                                            title={cam.name}
                                            src={`${cam.streamUrl}${cam.streamUrl.includes('?') ? '&' : '?'}autoplay=1&muted=1`}
                                            width="100%"
                                            height="100%"
                                            className="border-0 w-full h-full"
                                            allowFullScreen
                                            loading="lazy"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; autoplay *"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div className="text-center">
                                                <svg className="w-8 h-8 text-slate-500 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                                <p className="text-slate-400 text-[10px]">No Stream</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

            </div>
        </SmartCityLayout>
    );
};

export default CCTVMonitor;
