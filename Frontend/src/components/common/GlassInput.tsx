import React from 'react';
import { useTheme } from '../../hooks/useTheme';

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: React.ReactNode;
    variant?: 'default' | 'compact';
}

export const GlassInput: React.FC<GlassInputProps> = ({
    label,
    variant = 'default',
    className = '',
    ...props
}) => {
    const { isDark } = useTheme();

    const labelClass = variant === 'compact'
        ? `block text-xs uppercase font-bold mb-1 ${isDark ? 'text-blue-200' : 'text-blue-100'}`
        : `block text-xs sm:text-sm mb-1.5 sm:mb-2 uppercase tracking-wider font-semibold ${isDark ? 'text-blue-100' : 'text-blue-50'}`;

    const inputClass = variant === 'compact'
        ? `w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 outline-none transition-colors ${isDark
            ? 'bg-white/10 border-white/20 text-white placeholder-white/40'
            : 'bg-white/10 border-white/20 text-white placeholder-white/45'}`
        : `w-full border rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors ${isDark
            ? 'bg-white/10 border-white/20 text-white placeholder-blue-300/50'
            : 'bg-white/15 border-white/25 text-white placeholder-white/50'}`;

    return (
        <div>
            <label className={labelClass}>{label}</label>
            <input className={`${inputClass} ${className}`} {...props} />
        </div>
    );
};
