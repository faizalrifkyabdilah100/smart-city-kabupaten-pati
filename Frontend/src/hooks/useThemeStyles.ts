import { useTheme } from './useTheme';

export const useThemeStyles = () => {
    const { isDark } = useTheme();

    return {
        // ─── Card (glass on blue bg) ────────────────────────────────────────
        cardStyle: isDark
            ? 'bg-slate-900/40 backdrop-blur-md border-white/20 hover:border-cyan-400/50'
            : 'bg-white/10 backdrop-blur-md border-white/20 hover:border-white/45',

        cardStyleFlat: isDark
            ? 'bg-slate-900/40 backdrop-blur-md border-white/20'
            : 'bg-white/10 backdrop-blur-md border-white/20',

        // ─── Typography (white on blue bg — improved contrast vs original) ──
        headingStyle: 'text-white',
        subTextStyle: isDark ? 'text-slate-400' : 'text-white/75',  // was text-blue-200/80 (~1.7:1)
        labelStyle:   isDark ? 'text-slate-500' : 'text-white/55',  // was text-blue-200/60 (~1.3:1)

        // ─── Inner box (nested box inside a card) ───────────────────────────
        innerBoxStyle:    isDark ? 'bg-slate-950/40 border-white/10' : 'bg-white/5 border-white/15',
        innerBoxStyleAlt: isDark ? 'bg-slate-800/40 border-white/5'  : 'bg-white/10 border-white/10',

        // ─── Card gradient header bar ────────────────────────────────────────
        cardHeaderStyle: isDark
            ? 'bg-gradient-to-r from-purple-900/20 to-cyan-900/20 border-white/10'
            : 'bg-gradient-to-r from-blue-800/30 to-cyan-700/20 border-white/15',

        // ─── Sidebar panel ───────────────────────────────────────────────────
        sidebarStyle: isDark
            ? 'bg-slate-950/50 border-white/10'
            : 'bg-blue-950/50 border-white/15',

        // ─── Date badge (glass pill) ─────────────────────────────────────────
        dateBadgeStyle: isDark
            ? 'backdrop-blur-md bg-white/10 border-white/20 border px-3 sm:px-4 py-1.5 rounded-full font-mono text-[10px] sm:text-xs lg:text-sm shadow-lg text-white'
            : 'backdrop-blur-md bg-white/15 border-white/30 border px-3 sm:px-4 py-1.5 rounded-full font-mono text-[10px] sm:text-xs lg:text-sm shadow-lg text-white',

        // ─── Modal close button (✕) ──────────────────────────────────────────
        closeButtonStyle: 'w-9 h-9 rounded-full flex items-center justify-center text-white bg-white/10 hover:bg-red-500/20 hover:text-red-400 transition-colors text-sm',

        // ─── Modal backdrop overlay ──────────────────────────────────────────
        backdropStyle: isDark ? 'bg-slate-900/60' : 'bg-slate-900/40',
    } as const;
};
