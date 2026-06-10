/**
 * TrafficCard Component
 * Menampilkan kartu status trafik internet untuk satu ISP (Nexa, Astinet, Indibiz)
 * Refactored: uses useThemeStyles hook + StatusBadge component.
 */
import { useThemeStyles } from '../../hooks/useThemeStyles';
import { StatusBadge } from '../common/StatusBadge';

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
    const { headingStyle, labelStyle, innerBoxStyleAlt, innerBoxStyle } = useThemeStyles();

    return (
        <div
            onClick={() => onExpand(isp)}
            className={`rounded-xl p-2 sm:p-2.5 border cursor-pointer transition-all group hover:scale-[1.01] ${innerBoxStyleAlt} ${isDark ? 'hover:border-cyan-400/30' : 'hover:border-cyan-200/50'}`}
        >
            <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: isp.color }}></div>
                    <span className={`text-[10px] sm:text-[11px] font-bold ${headingStyle}`}>{isp.name}</span>
                </div>
                <StatusBadge status={isp.status} size="xs" />
            </div>

            <div className="grid grid-cols-2 gap-1.5">
                <div className={`rounded-lg p-1.5 border ${innerBoxStyle}`}>
                    <p className={`text-[6px] sm:text-[7px] uppercase tracking-wider mb-0.5 ${labelStyle}`}>↓ RX (Download)</p>
                    <p className={`text-xs sm:text-sm font-bold ${isDark ? 'text-cyan-400' : 'text-cyan-300'}`}>{loading ? '...' : isp.download}</p>
                </div>
                <div className={`rounded-lg p-1.5 border ${innerBoxStyle}`}>
                    <p className={`text-[6px] sm:text-[7px] uppercase tracking-wider mb-0.5 ${labelStyle}`}>↑ TX (Upload)</p>
                    <p className={`text-xs sm:text-sm font-bold ${isDark ? 'text-blue-400' : 'text-violet-300'}`}>{loading ? '...' : isp.upload}</p>
                </div>
            </div>
        </div>
    );
};
