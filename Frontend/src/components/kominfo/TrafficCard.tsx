/**
 * TrafficCard Component
 * Menampilkan kartu status trafik internet untuk satu ISP (Nexa, Astinet, Indibiz)
 */


interface TrafficCardProps {
    isp: {
        name: string;
        download: string;
        upload: string;
        status: "Online" | "Offline";
        usage: number;
        color: string;
    };
    loading: boolean;
    isDark: boolean;
    onExpand: (isp: any) => void;
}

export const TrafficCard = ({ isp, loading, isDark, onExpand }: TrafficCardProps) => {
    const innerBoxStyle = isDark
        ? 'bg-slate-800/40 border-white/5'
        : 'bg-white/20 border-white/20';

    const headingStyle = 'text-white';
    const labelStyle = isDark ? 'text-slate-500' : 'text-blue-200';

    return (
        <div
            onClick={() => onExpand(isp)}
            className={`rounded-xl p-2 sm:p-2.5 border cursor-pointer transition-all group hover:scale-[1.01] ${innerBoxStyle} ${isDark ? 'hover:border-cyan-400/30' : 'hover:border-cyan-200/50'}`}
        >
            <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: isp.color }}></div>
                    <span className={`text-[10px] sm:text-[11px] font-bold ${headingStyle}`}>{isp.name}</span>
                </div>
                <span className="text-[7px] sm:text-[8px] px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                    {isp.status}
                </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
                <div className={`rounded-lg p-1.5 border ${isDark ? 'bg-slate-900/40 border-white/5' : 'bg-white/5 border-white/10'}`}>
                    <p className={`text-[6px] sm:text-[7px] uppercase tracking-wider mb-0.5 ${labelStyle}`}>↓ RX (Download)</p>
                    <p className="text-xs sm:text-sm font-bold text-cyan-400">{loading ? '...' : isp.download}</p>
                </div>
                <div className={`rounded-lg p-1.5 border ${isDark ? 'bg-slate-900/40 border-white/5' : 'bg-white/5 border-white/10'}`}>
                    <p className={`text-[6px] sm:text-[7px] uppercase tracking-wider mb-0.5 ${labelStyle}`}>↑ TX (Upload)</p>
                    <p className="text-xs sm:text-sm font-bold text-blue-400">{loading ? '...' : isp.upload}</p>
                </div>
            </div>
        </div>
    );
};
