/**
 * ServerPanel Component
 * Reusable panel untuk menampilkan daftar server monitoring (CPU/Memory/Storage)
 */
import { motion } from 'framer-motion';
import { ServerGauges } from './ServerGauges';
import type { ServerData } from '../../services/serverApi';

interface ServerPanelProps {
    title: string;
    data: ServerData[] | null;
    loading: boolean;
    isDark: boolean;
    onExpand: (server: ServerData) => void;
    accentColor: string; // e.g. 'bg-cyan-400'
    pulseColor: string; // e.g. 'bg-cyan-400'
    hoverBorderColor: string; // e.g. 'hover:border-cyan-400/30'
    apiHint: string; // Nama variabel .env untuk pesan error
}

export const ServerPanel = ({
    title, data, loading, isDark, onExpand,
    accentColor, pulseColor, hoverBorderColor, apiHint
}: ServerPanelProps) => {

    const cardStyle = isDark
        ? 'bg-slate-900/40 backdrop-blur-md border-white/20 hover:border-cyan-400/50'
        : 'bg-blue-950/30 backdrop-blur-md border-white/30 hover:border-cyan-200/50';

    const headingStyle = 'text-white';

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`w-full lg:w-80 border rounded-2xl p-3 shadow-xl transition-all flex flex-col overflow-hidden shrink-0 ${cardStyle}`}
        >
            <h3 className={`font-bold text-sm mb-3 px-1 flex items-center gap-2 transition-colors duration-500 ${headingStyle}`}>
                <span className={`w-2 h-2 rounded-full animate-pulse ${pulseColor}`}></span>
                {title} {data ? `(${data.length})` : ''}
            </h3>

            <div className="flex-1 overflow-y-auto no-scrollbar max-h-[300px] lg:max-h-none">
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="text-center">
                            <div className={`w-6 h-6 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-2 ${accentColor.replace('bg-', 'border-')}`}></div>
                            <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-blue-200'}`}>Memuat server...</p>
                        </div>
                    </div>
                ) : !data || data.length === 0 ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="text-center">
                            <svg className="w-10 h-10 text-slate-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                            </svg>
                            <p className={`text-[11px] font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-blue-200'}`}>
                                Belum ada data server
                            </p>
                            <p className={`text-[9px] ${isDark ? 'text-slate-600' : 'text-blue-300/60'}`}>
                                Isi {apiHint} di backend/.env
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {data.map((server, idx) => (
                            <div
                                key={idx}
                                onClick={() => onExpand(server)}
                                className={`rounded-xl p-2.5 border transition-all cursor-pointer group ${isDark
                                    ? `bg-slate-800/50 border-white/10 ${hoverBorderColor} hover:bg-slate-800/70`
                                    : `bg-white/10 border-white/15 ${hoverBorderColor.replace('cyan-400', 'cyan-200')} hover:bg-white/20`
                                    }`}
                            >
                                {/* Server Name + Status */}
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-[10px] sm:text-[11px] font-bold ${headingStyle}`}>
                                        🖥️ {server.label}
                                    </span>
                                    {server.error ? (
                                        <span className="text-[7px] sm:text-[8px] px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                                            Offline
                                        </span>
                                    ) : (
                                        <span className="text-[7px] sm:text-[8px] px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                                            Online
                                        </span>
                                    )}
                                </div>

                                {server.error ? (
                                    /* Server Error State */
                                    <div className={`rounded-lg p-2 border text-center ${isDark ? 'bg-red-900/10 border-red-500/20' : 'bg-red-500/10 border-red-400/20'}`}>
                                        <p className="text-[8px] sm:text-[9px] text-red-400">⚠️ {server.error}</p>
                                    </div>
                                ) : server.resources ? (
                                    /* Server Resource Gauges (Reusable Component) */
                                    <ServerGauges resources={server.resources} isDark={isDark} />
                                ) : null}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};
