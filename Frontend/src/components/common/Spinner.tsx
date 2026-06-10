/**
 * Spinner — Reusable loading spinner component.
 * Replaces repeated manual `border-t-transparent rounded-full animate-spin` divs.
 */
import React from 'react';

interface SpinnerProps {
    /** Visual size of the spinner */
    size?: 'sm' | 'md' | 'lg';
    /**
     * Tailwind border-color class (without the `border-t-transparent` part).
     * Default: 'border-cyan-400'
     */
    color?: string;
    /** Optional label rendered below the spinner */
    label?: string;
    /** Controls label text color (follows dark/light theme) */
    isDark?: boolean;
}

export const Spinner: React.FC<SpinnerProps> = ({
    size = 'md',
    color = 'border-cyan-400',
    label,
    isDark,
}) => {
    const sizeMap: Record<string, string> = {
        sm: 'w-6 h-6 border-2',
        md: 'w-8 h-8 border-4',
        lg: 'w-12 h-12 border-4',
    };

    const labelColor =
        isDark === undefined
            ? 'text-white/60'
            : isDark
                ? 'text-slate-500'
                : 'text-white/60';

    return (
        <div className="flex flex-col items-center gap-2">
            <div
                className={`${sizeMap[size]} ${color} border-t-transparent rounded-full animate-spin mx-auto`}
            />
            {label && (
                <p className={`text-xs ${labelColor}`}>{label}</p>
            )}
        </div>
    );
};
