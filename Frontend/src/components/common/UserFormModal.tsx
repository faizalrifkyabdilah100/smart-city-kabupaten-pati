import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type User } from '../../types';
import { useTheme } from '../../hooks/useTheme';
import { GlassInput } from './GlassInput';

// Custom dropdown untuk menggantikan native <select> yang tampilannya tidak bisa dikontrol penuh
interface SelectOption { value: string; label: string; }
interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  isDark: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ value, onChange, options, isDark }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Tutup dropdown kalau klik di luar
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between border rounded-lg px-3 py-2.5 text-sm transition-colors outline-none focus:ring-2 focus:ring-blue-400
          ${isDark
            ? 'bg-white/10 border-white/20 text-white hover:bg-white/15'
            : 'bg-white/10 border-white/20 text-white hover:bg-white/15'
          }`}
      >
        <span>{selected?.label ?? '—'}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 text-slate-400 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown list */}
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.95 }}
            transition={{ duration: 0.12 }}
            className={`absolute z-50 mt-1 w-full rounded-xl border shadow-xl overflow-hidden origin-top
              ${isDark
                ? 'bg-slate-800 border-white/10'
                : 'bg-blue-950 border-white/15'
              }`}
          >
            {options.map(opt => (
              <li
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`px-3 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between
                  ${value === opt.value
                    ? isDark ? 'bg-cyan-500/20 text-cyan-300' : 'bg-blue-500/30 text-cyan-300'
                    : isDark ? 'text-slate-200 hover:bg-white/10' : 'text-blue-100 hover:bg-white/10'
                  }`}
              >
                {opt.label}
                {value === opt.value && (
                  <svg className="w-3.5 h-3.5 text-cyan-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.172l6.879-6.879a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

interface UserFormModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  initialData?: User | null;
  onClose: () => void;
  onSave: (data: Omit<User, 'id'>) => Promise<void>;
}

const UserFormModal: React.FC<UserFormModalProps> = ({ isOpen, mode, initialData, onClose, onSave }) => {
  const { isDark } = useTheme();

  const [formData, setFormData] = useState<Omit<User, 'id'>>({
    username: '',
    nama: '',
    opd: '',
    role: 'admin' as const,
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setFormData({
          username: initialData.username,
          nama: initialData.nama,
          opd: initialData.opd || '',
          role: initialData.role,
          password: '',
        });
      } else {
        setFormData({ username: '', nama: '', opd: '', role: 'admin' as const, password: '' });
      }
    }
  }, [isOpen, mode, initialData]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSave(formData);
    setIsSubmitting(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className={`absolute inset-0 backdrop-blur-sm ${isDark ? 'bg-black/60' : 'bg-black/50'}`}
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            className={`border rounded-2xl p-6 w-full max-w-lg relative z-10 shadow-2xl backdrop-blur-xl ${isDark
              ? 'bg-slate-900 border-white/10'
              : 'bg-blue-950/85 border-white/20'
            }`}
          >
            <h2 className="text-xl font-bold mb-4 text-white">
              {mode === 'add' ? '✨ Tambah User Baru' : '✏️ Edit User'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <GlassInput
                label="Username"
                variant="compact"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />

              <GlassInput
                label="Nama Lengkap"
                variant="compact"
                type="text"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs uppercase font-bold mb-1 ${isDark ? 'text-blue-200' : 'text-blue-100'}`}>
                    Role
                  </label>
                  <CustomSelect
                    value={formData.role}
                    onChange={(val) => setFormData({ ...formData, role: val as User['role'] })}
                    options={[
                      { value: 'admin', label: 'Admin OPD' },
                      { value: 'super_admin', label: 'Super Admin' },
                    ]}
                    isDark={isDark}
                  />
                </div>
                <GlassInput
                  label="OPD / Instansi"
                  variant="compact"
                  type="text"
                  value={formData.opd}
                  onChange={(e) => setFormData({ ...formData, opd: e.target.value })}
                  placeholder="Contoh: Diskominfo"
                />
              </div>

              <GlassInput
                label={
                  <>
                    Password{' '}
                    {mode === 'edit' && (
                      <span className={`font-normal normal-case ${isDark ? 'text-blue-300/70' : 'text-blue-200/70'}`}>
                        (Kosongkan jika tidak diubah)
                      </span>
                    )}
                  </>
                }
                variant="compact"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder={mode === 'add' ? 'Wajib diisi' : '••••••'}
                required={mode === 'add'}
              />

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button" onClick={onClose}
                  className="px-4 py-2 rounded-lg transition-colors text-blue-200 hover:text-white hover:bg-white/5"
                >
                  Batal
                </button>
                <button
                  type="submit" disabled={isSubmitting}
                  className="px-6 py-2 text-white font-bold rounded-lg shadow-lg disabled:opacity-50 bg-blue-600 hover:bg-blue-500 shadow-blue-500/20 transition-colors"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Data'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UserFormModal;
