import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen, title, message,
  confirmText = 'Ya, Lanjutkan', cancelText = 'Batal',
  isDangerous = false,
  onConfirm, onCancel,
}) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onCancel}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
          className="relative z-10 bg-blue-950/90 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
        >
          <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
          <p className="text-white/65 text-sm mb-6 leading-relaxed">{message}</p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg text-sm text-blue-200 hover:text-white hover:bg-white/5 transition-colors"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={`px-5 py-2 rounded-lg text-sm font-bold text-white shadow-lg transition-colors ${isDangerous
                ? 'bg-red-600 hover:bg-red-500 shadow-red-500/20'
                : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default ConfirmModal;
