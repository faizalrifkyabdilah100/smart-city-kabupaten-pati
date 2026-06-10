/**
 * ServerPanel Component
 * Reusable panel untuk menampilkan daftar server monitoring (CPU/Memory/Storage)
 * Refactored: uses useThemeStyles hook + StatusBadge + Spinner components.
 */
import { motion } from 'framer-motion';
import { ServerGauges } from './ServerGauges';
import type { ServerData } from '../../services/serverApi';
import { useThemeStyles } from '../../hooks/useThemeStyles';
import { StatusBadge } from '../common/StatusBadge';
import { Spinner } from '../common/Spinner';

interface ServerPanelProps {
    title: string;
    data: ServerData[] | null;
    loading: boolean;
    error?: boolean;
    isDark: boolean;
    onExpand: (server: ServerData) => void;
    accentColor: string;
    pulseColor: string;
    hoverBorderColor: string;
    apiHint: string;
    onRetry?: () => void;
}

export const ServerPanel = ({
    title, data, loading, error, isDark, onExpand,
    accentColor, pulseColor, hoverBorderColor, apiHint, onRetry
}: ServerPanelProps) => {

    const { cardStyle, headingStyle } = useThemeStyles();

    // Derive a border-color from the accent bg-color for the spinner
    const spinnerColor = accentColor.replace('bg-', 'border-');

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`w-full border rounded-2xl p-3 shadow-xl flex flex-col overflow-hidden shrink-0 ${cardStyle}`}
        >
            <h3 className={`font-bold text-sm mb-3 px-1 flex items-center gap-2 transition-colors duration-500 ${headingStyle}`}>
                <span className={`w-2 h-2 rounded-full animate-pulse ${pulseColor}`}></span>
                {title} {data ? `(${data.length})` : ''}
            </h3>

            <div className="flex-1 overflow-y-auto no-scrollbar max-h-[300px] lg:max-h-none">
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <Spinner size="sm" color={spinnerColor} label="Memuat server..." isDark={isDark} />
                    </div>
                ) : !data || data.length === 0 ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="text-center">
                            {error ? (
                                <>
                                    <svg className="w-10 h-10 text-red-400/60 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <p className="text-[11px] font-semibold mb-1 text-red-400">
                                        Gagal terhubung ke server
                                    </p>
                                    {onRetry ? (
                                        <button
                                            onClick={onRetry}
                                            className="mt-1.5 text-[10px] px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white/65 hover:text-white transition-colors"
                                        >
                                            ↺ Coba Lagi
                                        </button>
                                    ) : (
                                        <p className="text-[9px] text-white/30">Akan dicoba lagi otomatis...</p>
                                    )}
                                </>
                            ) : (
                                <>
                                    <svg className="w-10 h-10 text-slate-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                                    </svg>
                                    <p className={`text-[11px] font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-blue-200/80'}`}>
                                        Belum ada data server
                                    </p>
                                    <p className={`text-[9px] ${isDark ? 'text-slate-600' : 'text-blue-300/60'}`}>
                                        Isi {apiHint} di backend/.env
                                    </p>
                                </>
                            )}
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
                                    <StatusBadge
                                        status={server.error ? 'Offline' : 'Online'}
                                        size="xs"
                                    />
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
