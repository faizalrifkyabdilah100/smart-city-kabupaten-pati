import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type User } from '../../types';
import { useTheme } from '../../hooks/useTheme';

interface UserFormModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  initialData?: User | null;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

const UserFormModal: React.FC<UserFormModalProps> = ({ isOpen, mode, initialData, onClose, onSave }) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    username: '',
    nama: '',
    opd: '',
    role: 'admin',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setFormData({
          username: initialData.username,
          nama: initialData.nama,
          opd: initialData.opd || '',
          role: initialData.role,
          password: '', // Password kosong saat edit (kecuali mau diganti)
        });
      } else {
        setFormData({ username: '', nama: '', opd: '', role: 'admin', password: '' });
      }
    }
  }, [isOpen, mode, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSave(formData); // Kirim data ke induk
    setIsSubmitting(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Gelap */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className={`absolute inset-0 backdrop-blur-sm ${isDark ? 'bg-black/60' : 'bg-black/30'}`}
          />

          {/* Kartu Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            className={`border rounded-2xl p-6 w-full max-w-lg relative z-10 shadow-2xl ${isDark
              ? 'bg-slate-900 border-white/10'
              : 'bg-[#1e3a5f] border-white/20 shadow-xl'
              }`}
          >
            <h2 className="text-xl font-bold mb-4 text-white">
              {mode === 'add' ? '✨ Tambah User Baru' : '✏️ Edit User'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold mb-1 text-blue-200">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white/10 border-white/20 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold mb-1 text-blue-200">Nama Lengkap</label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white/10 border-white/20 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold mb-1 text-blue-200">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white/10 border-white/20 text-white"
                  >
                    <option value="admin">Admin OPD</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold mb-1 text-blue-200">OPD / Instansi</label>
                  <input
                    type="text"
                    value={formData.opd}
                    onChange={(e) => setFormData({ ...formData, opd: e.target.value })}
                    className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white/10 border-white/20 text-white"
                    placeholder="Contoh: Diskominfo"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold mb-1 text-blue-200">
                  Password {mode === 'edit' && <span className="font-normal normal-case text-blue-300/70">(Kosongkan jika tidak diubah)</span>}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white/10 border-white/20 text-white"
                  placeholder={mode === 'add' ? 'Wajib diisi' : '••••••'}
                  required={mode === 'add'} // Wajib cuma pas tambah baru
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button" onClick={onClose}
                  className="px-4 py-2 rounded-lg transition text-blue-200 hover:text-white hover:bg-white/5"
                >
                  Batal
                </button>
                <button
                  type="submit" disabled={isSubmitting}
                  className="px-6 py-2 text-white font-bold rounded-lg shadow-lg disabled:opacity-50 bg-blue-600 hover:bg-blue-500 shadow-blue-500/20"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Data'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )
      }
    </AnimatePresence >
  );
};

export default UserFormModal;