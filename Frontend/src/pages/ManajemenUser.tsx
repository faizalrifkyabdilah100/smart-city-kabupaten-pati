import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { type User } from '../types';
import Navbar from '../components/layout/Navbar';
import UserFormModal from '../components/common/UserFormModal';
import { API_BASE_URL } from '../config/api';
import { useTheme } from '../hooks/useTheme';
import { useToast } from '../components/common/Toast';
import { getAuthHeaders } from '../utils/auth';

const ManajemenUser: React.FC = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { showToast } = useToast();

  // State Data
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State Modal Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // FETCH DATA (ProtectedRoute sudah handle cek login)
  useEffect(() => {
    fetchUsers();
  }, []);

  // FUNGSI AMBIL DATA
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: getAuthHeaders(),
      });
      if (response.status === 401) {
        showToast('Sesi login habis, silakan login ulang.', 'error');
        navigate('/login');
        return;
      }
      const result = await response.json();
      setUsers(result);
    } catch (error) {
      console.error("Gagal ambil data:", error);
      showToast('Gagal terhubung ke server.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // FUNGSI BUKA MODAL
  const handleAdd = () => {
    setModalMode('add');
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setModalMode('edit');
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // LOGIKA SIMPAN (Create/Update)
  const handleSave = async (formData: Omit<User, 'id'>) => {
    const url = modalMode === 'add'
      ? `${API_BASE_URL}/users`
      : `${API_BASE_URL}/users/${selectedUser?.id}`;

    const method = modalMode === 'add' ? 'POST' : 'PUT';

    try {
      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showToast(
          modalMode === 'add' ? 'User berhasil dibuat!' : 'User berhasil diupdate!',
          'success'
        );
        setIsModalOpen(false);
        fetchUsers();
      } else {
        const err = await response.json();
        showToast('Gagal: ' + (err.messages?.error || 'Terjadi kesalahan'), 'error');
      }
    } catch (error) {
      showToast('Error koneksi ke server.', 'error');
    }
  };

  // FUNGSI HAPUS
  const handleDelete = async (id: number, nama: string) => {
    if (!confirm(`Yakin ingin menghapus user "${nama}"?`)) return;

    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        showToast(`User "${nama}" berhasil dihapus.`, 'success');
        fetchUsers();
      } else {
        showToast('Gagal menghapus user.', 'error');
      }
    } catch (error) {
      showToast('Error koneksi.', 'error');
    }
  };

  // Theme-aware style classes
  const pageBackground = isDark
    ? 'bg-slate-950'
    : 'bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100';
  const cardBg = isDark
    ? 'bg-blue-950/30 border-white/30'
    : 'bg-white/60 border-slate-200/50 shadow-lg';
  const headingColor = isDark ? 'text-white' : 'text-slate-800';
  const subColor = isDark ? 'text-blue-200' : 'text-slate-500';
  const rowHover = isDark ? 'hover:bg-white/5' : 'hover:bg-blue-50/50';
  const dividerColor = isDark ? 'divide-white/5' : 'divide-slate-200/60';
  const cellUser = isDark ? 'text-blue-300' : 'text-blue-600';
  const cellName = isDark ? 'text-white' : 'text-slate-800';
  const cellOpd = isDark ? 'text-blue-200' : 'text-slate-600';
  const loadingColor = isDark ? 'text-blue-300/80' : 'text-slate-400';
  const btnBack = isDark
    ? 'bg-white/10 hover:bg-white/20 active:bg-white/30 text-white border border-white/20'
    : 'bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-700 border border-slate-300 shadow-sm';
  const mapOverlay = isDark ? 'opacity-10' : 'opacity-5';
  const textPrimary = isDark ? 'text-white' : 'text-slate-800';

  return (
    <div className={`min-h-screen w-full p-3 sm:p-4 md:p-6 lg:p-8 relative overflow-y-auto ${textPrimary} ${pageBackground}`}>
      {/* Background Tipis */}
      <div
        className={`absolute top-0 left-0 w-full h-full bg-[url('/peta-pati-clean.png')] bg-cover backdrop-blur-sm pointer-events-none z-0 ${mapOverlay}`}
        style={{ mixBlendMode: 'overlay' }}
      ></div>

      {/* Navbar */}
      <Navbar show={true} showLogout={false} />

      {/* KONTAINER UTAMA */}
      <div className="max-w-6xl mx-auto relative z-30 mt-24 sm:mt-28 md:mt-32 lg:mt-36">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
          <div>
            <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold ${headingColor}`}>Manajemen User</h1>
            <p className={`text-xs sm:text-sm ${subColor}`}>Kelola akses admin OPD dan Super Admin</p>
          </div>

          {/* TOMBOL TAMBAH & KEMBALI */}
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => navigate('/')}
              className={`relative z-50 pointer-events-auto cursor-pointer px-3 sm:px-4 md:px-6 py-2 rounded-lg sm:rounded-xl font-bold shadow-lg transition-all flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm flex-1 sm:flex-initial justify-center ${btnBack}`}
            >
              ← Kembali
            </button>
            <button
              onClick={handleAdd}
              className="relative z-50 pointer-events-auto cursor-pointer px-3 sm:px-4 md:px-6 py-2 rounded-lg sm:rounded-xl font-bold shadow-lg transition-all flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm flex-1 sm:flex-initial justify-center text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-blue-500/20"
            >
              + Tambah User
            </button>
          </div>
        </div>

        {/* DATA - Desktop: Table, Mobile: Cards */}
        {/* Desktop Table */}
        <div className={`hidden md:block backdrop-blur-xl border rounded-2xl overflow-hidden shadow-2xl relative z-20 ${cardBg}`}>
          <table className="w-full text-left">
            <thead className={`text-xs sm:text-sm uppercase tracking-wider ${isDark ? 'bg-white/5 text-blue-200' : 'bg-slate-100/80 text-slate-500'}`}>
              <tr>
                <th className="p-3 md:p-4 font-semibold">Username</th>
                <th className="p-3 md:p-4 font-semibold">Nama Lengkap</th>
                <th className="p-3 md:p-4 font-semibold">OPD / Instansi</th>
                <th className="p-3 md:p-4 font-semibold">Role</th>
                <th className="p-3 md:p-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-sm ${dividerColor}`}>
              {isLoading ? (
                <tr><td colSpan={5} className={`p-8 text-center ${loadingColor}`}>Sedang memuat data...</td></tr>
              ) : users.map((user) => (
                <tr key={user.id} className={`transition-colors ${rowHover}`}>
                  <td className={`p-3 md:p-4 font-mono text-xs md:text-sm ${cellUser}`}>{user.username}</td>
                  <td className={`p-3 md:p-4 font-bold text-xs md:text-sm ${cellName}`}>{user.nama}</td>
                  <td className={`p-3 md:p-4 text-xs md:text-sm ${cellOpd}`}>{user.opd || '-'}</td>
                  <td className="p-3 md:p-4">
                    <span className={`px-2 py-1 rounded text-[10px] md:text-xs font-bold ${user.role === 'super_admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-green-500/20 text-green-300 border border-green-500/30'}`}>
                      {user.role === 'super_admin' ? 'SUPER ADMIN' : 'ADMIN OPD'}
                    </span>
                  </td>
                  <td className="p-3 md:p-4 flex justify-center gap-3">
                    <button
                      onClick={() => handleEdit(user)}
                      className="relative z-10 cursor-pointer text-yellow-400 hover:text-yellow-300 font-medium text-xs md:text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id, user.nama)}
                      className="relative z-10 cursor-pointer text-red-400 hover:text-red-300 font-medium text-xs md:text-sm"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3 relative z-20">
          {isLoading ? (
            <div className={`backdrop-blur-xl border rounded-xl p-6 text-center text-sm ${cardBg} ${loadingColor}`}>
              Sedang memuat data...
            </div>
          ) : users.map((user) => (
            <div key={user.id} className={`backdrop-blur-xl border rounded-xl p-3 sm:p-4 shadow-lg ${cardBg}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className={`font-bold text-sm ${cellName}`}>{user.nama}</p>
                  <p className={`font-mono text-xs ${cellUser}`}>@{user.username}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${user.role === 'super_admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-green-500/20 text-green-300 border border-green-500/30'}`}>
                  {user.role === 'super_admin' ? 'SUPER ADMIN' : 'ADMIN OPD'}
                </span>
              </div>
              <p className={`text-xs mb-3 ${cellOpd}`}>{user.opd || 'Tidak ada OPD'}</p>
              <div className={`flex gap-2 border-t pt-2 ${isDark ? 'border-white/5' : 'border-slate-200/60'}`}>
                <button
                  onClick={() => handleEdit(user)}
                  className="flex-1 text-center font-medium text-xs py-1.5 rounded-lg text-yellow-400 active:text-yellow-300 bg-yellow-400/5"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id, user.nama)}
                  className="flex-1 text-center font-medium text-xs py-1.5 rounded-lg text-red-400 active:text-red-300 bg-red-400/5"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL FORM */}
      <UserFormModal
        isOpen={isModalOpen}
        mode={modalMode}
        initialData={selectedUser}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default ManajemenUser;