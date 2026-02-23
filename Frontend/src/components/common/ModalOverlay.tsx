/**
 * ModalOverlay Component
 * Reusable modal dengan backdrop blur dan animasi spring
 */
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import type { ReactNode } from 'react';

interface ModalOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    isDark: boolean;
    maxWidth?: string; // e.g., 'max-w-lg' or 'max-w-md'
}

export const ModalOverlay = ({ isOpen, onClose, children, isDark, maxWidth = 'max-w-lg' }: ModalOverlayProps) => {
    // Handle ESC key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className={`absolute inset-0 backdrop-blur-md cursor-pointer ${isDark ? 'bg-slate-900/60' : 'bg-slate-900/40'}`}
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 30 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className={`relative w-full ${maxWidth} rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl z-[101] border overflow-hidden ${isDark
                            ? 'bg-slate-900 border-white/20'
                            : 'bg-blue-900 border-white/30'
                            }`}
                    >
                        {/* Close Button (Absolute positioned if needed, but usually handled in content) */}
                        {children}

                        {/* Footer hint */}
                        <p className={`mt-4 text-center text-[10px] sm:text-xs ${isDark ? 'text-slate-600' : 'text-blue-300/50'}`}>
                            Klik di luar atau tekan ✕ untuk menutup
                        </p>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
