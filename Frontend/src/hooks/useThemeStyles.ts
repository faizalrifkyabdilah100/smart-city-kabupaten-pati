/**
 * useThemeStyles — Centralized theme-aware CSS class strings.
 * Eliminates repetitive cardStyle / headingStyle / subTextStyle
 * definitions scattered across pages and components.
 */
import { useTheme } from './useTheme';

export const useThemeStyles = () => {
    const { isDark } = useTheme();

    return {
        // ─── Card (glass, with hover) ───────────────────────────────────────
        cardStyle: isDark
            ? 'bg-slate-900/40 backdrop-blur-md border-white/20 hover:border-cyan-400/50'
            : 'bg-blue-950/30 backdrop-blur-md border-white/30 hover:border-cyan-200/50',

        // Card container without hover (plain glass)
        cardStyleFlat: isDark
            ? 'bg-slate-900/40 backdrop-blur-md border-white/20'
            : 'bg-blue-950/30 backdrop-blur-md border-white/30',

        // ─── Typography ─────────────────────────────────────────────────────
        headingStyle: 'text-white' as const,
        subTextStyle: isDark ? 'text-slate-400' : 'text-blue-100',
        labelStyle: isDark ? 'text-slate-500' : 'text-blue-200',

        // ─── Inner box (nested box inside a card) ───────────────────────────
        innerBoxStyle: isDark ? 'bg-slate-950/40 border-white/10' : 'bg-white/10 border-white/15',
        innerBoxStyleAlt: isDark ? 'bg-slate-800/40 border-white/5' : 'bg-white/20 border-white/20',

        // ─── Card gradient header bar ────────────────────────────────────────
        cardHeaderStyle: isDark
            ? 'bg-gradient-to-r from-purple-900/20 to-cyan-900/20 border-white/10'
            : 'bg-gradient-to-r from-purple-900/15 to-cyan-900/15 border-white/10',

        // ─── Sidebar panel ───────────────────────────────────────────────────
        sidebarStyle: isDark
            ? 'bg-slate-950/50 border-white/10'
            : 'bg-blue-950/40 border-white/10',

        // ─── Date badge (glass pill) ─────────────────────────────────────────
        dateBadgeStyle:
            'backdrop-blur-md bg-white/10 border-white/20 border px-3 sm:px-4 py-1.5 rounded-full font-mono text-[10px] sm:text-xs lg:text-sm shadow-lg text-white',

        // ─── Modal close button (✕) ──────────────────────────────────────────
        closeButtonStyle:
            'w-9 h-9 rounded-full flex items-center justify-center text-white bg-white/10 hover:bg-red-500/20 hover:text-red-400 transition-colors text-sm',

        // ─── Modal backdrop overlay ──────────────────────────────────────────
        backdropStyle: isDark ? 'bg-slate-900/60' : 'bg-slate-900/40',
    } as const;
};
