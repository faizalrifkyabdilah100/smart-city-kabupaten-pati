import React from 'react';

interface CctvPlayerProps {
    streamUrl: string | undefined;
}

const CctvPlayer: React.FC<CctvPlayerProps> = ({ streamUrl }) => {
    if (!streamUrl) {
        return (
            <div className="w-full h-full bg-gradient-to-br from-slate-800/20 via-slate-900/50 to-slate-800/20 flex items-center justify-center">
                <div className="text-center">
                    <svg className="w-10 h-10 sm:w-12 sm:h-12 text-slate-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p className="text-slate-400 text-xs sm:text-sm">Live Video Stream</p>
                </div>
            </div>
        );
    }

    const fullUrl = `${streamUrl}${streamUrl.includes('?') ? '&' : '?'}autoplay=1&muted=1`;

    return (
        <iframe
            title="CCTV Live Stream"
            src={fullUrl}
            width="100%"
            height="100%"
            className="border-0 w-full h-full"
            allowFullScreen
            loading="eager"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; autoplay *"
        />
    );
};

export default React.memo(CctvPlayer);
