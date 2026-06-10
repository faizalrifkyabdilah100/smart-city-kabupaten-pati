/**
 * GlassInput — Reusable glass-style form input with label.
 * Replaces repeated identical label+input pairs in Login.tsx & UserFormModal.tsx.
 *
 * Variants:
 *  - default  → responsive sizing (used in Login.tsx)
 *  - 'compact' → fixed compact sizing (used in UserFormModal.tsx)
 */
import React from 'react';

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    /** Label text displayed above the input */
    label: React.ReactNode;
    /** Use 'compact' for modals, default for full-page forms */
    variant?: 'default' | 'compact';
}

export const GlassInput: React.FC<GlassInputProps> = ({
    label,
    variant = 'default',
    className = '',
    ...props
}) => {
    const labelClass =
        variant === 'compact'
            ? 'block text-xs uppercase font-bold mb-1 text-blue-200'
            : 'block text-xs sm:text-sm mb-1.5 sm:mb-2 text-blue-100 uppercase tracking-wider font-semibold';

    const inputClass =
        variant === 'compact'
            ? 'w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white/10 border-white/20 text-white'
            : 'w-full border rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/10 border-white/20 text-white placeholder-blue-300/50';

    return (
        <div>
            <label className={labelClass}>{label}</label>
            <input className={`${inputClass} ${className}`} {...props} />
        </div>
    );
};
