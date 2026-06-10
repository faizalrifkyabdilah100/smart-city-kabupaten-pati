import React, { useState, useCallback, useEffect, createContext, useContext, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// === TIPE ===
type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// === HOOK ===
export function useToast(): ToastContextType {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
}

// === PROVIDER ===
let toastId = 0;

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = ++toastId;
        setToasts(prev => [...prev, { id, message, type }]);
    }, []);

    const removeToast = useCallback((id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast Container */}
            <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
                <AnimatePresence>
                    {toasts.map(toast => (
                        <ToastItem key={toast.id} toast={toast} onDone={() => removeToast(toast.id)} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

// === TOAST ITEM ===
const iconMap: Record<ToastType, string> = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
};

const colorMap: Record<ToastType, string> = {
    success: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
    error: 'border-red-500/40 bg-red-500/10 text-red-300',
    info: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300',
};

const ToastItem: React.FC<{ toast: Toast; onDone: () => void }> = ({ toast, onDone }) => {
    useEffect(() => {
        const timer = setTimeout(onDone, 3500);
        return () => clearTimeout(timer);
    }, [onDone]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={`pointer-events-auto backdrop-blur-xl border rounded-xl px-4 py-3 shadow-2xl flex items-center gap-3 min-w-[260px] max-w-[380px] cursor-pointer ${colorMap[toast.type]}`}
            onClick={onDone}
        >
            <span className="text-lg shrink-0">{iconMap[toast.type]}</span>
            <span className="text-sm font-medium leading-snug">{toast.message}</span>
        </motion.div>
    );
};
