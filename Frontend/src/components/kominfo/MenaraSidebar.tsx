import React from 'react';
import type { MenaraData } from '../../services/menaraApi';

interface MenaraSidebarProps {
    data: MenaraData[];
    loading: boolean;
    headingStyle: string;
    subTextStyle: string;
    onItemClick: (lat: number, lng: number) => void;
}

const MenaraSidebar: React.FC<MenaraSidebarProps> = ({
    data,
    loading,
    headingStyle,
    subTextStyle,
    onItemClick
}) => {
    return (
        <div className="flex sm:flex-col gap-1.5 overflow-x-auto sm:overflow-x-visible no-scrollbar pb-1 sm:pb-0">
            {loading ? (
                [1, 2, 3].map(i => (
                    <div key={i} className="h-12 w-full bg-white/5 animate-pulse rounded-lg mb-1.5 min-w-[130px] sm:min-w-0"></div>
                ))
            ) : data && data.length > 0 ? (
                data.map(loc => (
                    <button
                        key={`${loc.id}-${loc.id_menara}`}
                        className={`flex-shrink-0 sm:flex-shrink sm:w-full text-left rounded-lg p-1.5 flex items-center gap-2 transition-all border min-w-[130px] sm:min-w-0 bg-white/5 hover:bg-white/15 border-transparent hover:border-cyan-400/30`}
                        onClick={() => onItemClick(loc.lat, loc.longitude)}
                    >
                        <div className="text-sm leading-none">🗼</div>
                        <div className="flex-1 min-w-0">
                            <div className={`text-[9px] sm:text-[10px] font-semibold truncate ${headingStyle}`}>{loc.nama_menara}</div>
                            <div className={`text-[8px] truncate ${subTextStyle}`}>{loc.kecamatan}</div>
                        </div>
                    </button>
                ))
            ) : (
                <div className="text-[10px] text-slate-500 text-center py-4 w-full">Data tidak tersedia</div>
            )}
        </div>
    );
};

// Memoize to prevent re-renders when other page data updates
export default React.memo(MenaraSidebar);
