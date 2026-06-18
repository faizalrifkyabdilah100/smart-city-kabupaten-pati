import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { type User } from '../types';
import Navbar from '../components/layout/Navbar';
import UserFormModal from '../components/common/UserFormModal';
import ConfirmModal from '../components/common/ConfirmModal';
import { API_BASE_URL } from '../config/api';
import { useTheme } from '../hooks/useTheme';
import { useThemeStyles } from '../hooks/useThemeStyles';
import { useToast } from '../components/common/Toast';
import { getCsrfToken } from '../utils/auth';
import { useAuth } from '../hooks/useAuth';

const ITEMS_PER_PAGE = 8;

const ManajemenUser: React.FC = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { cardStyle, headingStyle, subTextStyle } = useThemeStyles();
  const { showToast } = useToast();
  const currentUser = useAuth();
  const isSuperAdmin = currentUser?.role === 'super_admin';

  // State Data
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State Search & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // State Modal Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // State Confirm Delete Modal
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: number; nama: string }>({
    isOpen: false, id: 0, nama: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  // Reset ke halaman 1 setiap kali query search berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        credentials: 'include',
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

  // Filter berdasarkan username, nama, atau opd
  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        u.nama.toLowerCase().includes(q) ||
        (u.opd ?? '').toLowerCase().includes(q)
    );
  }, [users, searchQuery]);

  // Hitung total halaman berdasarkan hasil filter
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / ITEMS_PER_PAGE));

  // Slice data untuk halaman aktif
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

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

  const handleSave = async (formData: Omit<User, 'id'>) => {
    const url = modalMode === 'add'
      ? `${API_BASE_URL}/users`
      : `${API_BASE_URL}/users/${selectedUser?.id}`;
    const method = modalMode === 'add' ? 'POST' : 'PUT';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': getCsrfToken() },
        body: JSON.stringify(formData),
        credentials: 'include',
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
    } catch {
      showToast('Error koneksi ke server.', 'error');
    }
  };

  const handleDelete = (id: number, nama: string) => {
    setConfirmDelete({ isOpen: true, id, nama });
  };

  const handleConfirmDelete = useCallback(async () => {
    const { id, nama } = confirmDelete;
    setConfirmDelete(prev => ({ ...prev, isOpen: false }));
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'X-CSRF-Token': getCsrfToken() },
      });
      if (response.ok) {
        showToast(`User "${nama}" berhasil dihapus.`, 'success');
        fetchUsers();
      } else {
        showToast('Gagal menghapus user.', 'error');
      }
    } catch {
      showToast('Error koneksi.', 'error');
    }
  }, [confirmDelete, showToast]);

  const dividerColor = isDark ? 'divide-white/5' : 'divide-white/10';
  const rowHover = isDark ? 'hover:bg-white/5' : 'hover:bg-white/10';
  const loadingColor = isDark ? 'text-blue-300/80' : 'text-blue-100/80';

  // === PAGINATION COMPONENT ===
  const Pagination = () => {
    if (totalPages <= 1) return null;

    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }

    const btnBase = 'min-w-[32px] h-8 px-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center';
    const btnActive = isDark
      ? 'bg-cyan-500 text-white shadow-[0_0_12px_rgba(6,182,212,0.4)]'
      : 'bg-blue-600 text-white shadow-md';
    const btnInactive = isDark
      ? 'text-slate-400 hover:bg-white/10 hover:text-white'
      : 'text-blue-200 hover:bg-white/15 hover:text-white';
    const btnDisabled = 'opacity-30 cursor-not-allowed';

    return (
      <div className="flex items-center justify-between mt-4 gap-2 flex-wrap">
        <p className={`text-xs ${subTextStyle}`}>
          Menampilkan{' '}
          <span className="font-semibold text-white">
            {filteredUsers.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)}
          </span>{' '}
          dari <span className="font-semibold text-white">{filteredUsers.length}</span> user
          {searchQuery && <span className="text-cyan-400"> (difilter)</span>}
        </p>

        <div className="flex items-center gap-1">
          {/* Prev */}
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`${btnBase} ${currentPage === 1 ? btnDisabled + ' ' + btnInactive : btnInactive}`}
          >
            ‹
          </button>

          {pages.map((p, idx) =>
            p === '...' ? (
              <span key={`dot-${idx}`} className={`${btnBase} ${btnInactive} cursor-default`}>…</span>
            ) : (
              <button
                key={p}
                onClick={() => setCurrentPage(p as number)}
                className={`${btnBase} ${currentPage === p ? btnActive : btnInactive}`}
              >
                {p}
              </button>
            )
          )}

          {/* Next */}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`${btnBase} ${currentPage === totalPages ? btnDisabled + ' ' + btnInactive : btnInactive}`}
          >
            ›
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full p-3 sm:p-4 md:p-6 lg:p-8 relative overflow-y-auto z-10">

      <Navbar show={true} showLogout={false} />

      <div className="max-w-6xl mx-auto relative z-30 mt-24 sm:mt-28 md:mt-32 lg:mt-36">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div>
            <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold ${headingStyle}`}>Manajemen User</h1>
            <p className={`text-xs sm:text-sm ${subTextStyle}`}>Kelola akses admin OPD dan Super Admin</p>
          </div>

          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => navigate('/')}
              className="relative z-50 pointer-events-auto cursor-pointer px-3 sm:px-4 md:px-6 py-2 rounded-lg sm:rounded-xl font-bold shadow-lg transition-all flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm flex-1 sm:flex-initial justify-center text-white bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/20"
            >
              ← Kembali
            </button>
            {isSuperAdmin && (
              <button
                onClick={handleAdd}
                className="relative z-50 pointer-events-auto cursor-pointer px-3 sm:px-4 md:px-6 py-2 rounded-lg sm:rounded-xl font-bold shadow-lg transition-all flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm flex-1 sm:flex-initial justify-center text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-blue-500/20"
              >
                + Tambah User
              </button>
            )}
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="mb-4 relative">
          <div className="relative">
            <svg
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isDark ? 'text-slate-400' : 'text-blue-300'}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari username, nama, atau OPD..."
              className={`w-full pl-9 pr-9 py-2.5 rounded-xl text-sm border backdrop-blur-md transition-all duration-200 outline-none
                ${isDark
                  ? 'bg-white/5 border-white/10 text-white placeholder-slate-500 focus:border-cyan-500/50 focus:bg-white/8'
                  : 'bg-white/10 border-white/20 text-white placeholder-blue-300/60 focus:border-blue-400/60 focus:bg-white/15'
                }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center rounded-full text-[10px] transition-colors
                  ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-blue-300 hover:text-white hover:bg-white/15'}`}
              >
                ✕
              </button>
            )}
          </div>
          {searchQuery && (
            <p className={`mt-1.5 text-xs px-1 ${subTextStyle}`}>
              {filteredUsers.length === 0
                ? 'Tidak ada user yang cocok'
                : `${filteredUsers.length} user ditemukan untuk "${searchQuery}"`}
            </p>
          )}
        </div>

        {/* Desktop Table */}
        <div className={`hidden md:block backdrop-blur-xl border rounded-2xl overflow-hidden shadow-2xl relative z-20 ${cardStyle}`}>
          <table className="w-full text-left">
            <thead className={`text-xs sm:text-sm uppercase tracking-wider ${isDark ? 'bg-white/5 text-blue-200' : 'bg-white/5 text-blue-100'}`}>
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
                <tr>
                  <td colSpan={5} className={`p-8 text-center ${loadingColor}`}>Sedang memuat data...</td>
                </tr>
              ) : paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className={`p-8 text-center ${subTextStyle}`}>
                    {searchQuery ? `Tidak ada user yang cocok dengan "${searchQuery}"` : 'Belum ada data user'}
                  </td>
                </tr>
              ) : paginatedUsers.map((user) => (
                <tr key={user.id} className={`transition-colors ${rowHover}`}>
                  <td className="p-3 md:p-4 font-mono text-xs md:text-sm text-cyan-300">{user.username}</td>
                  <td className={`p-3 md:p-4 font-bold text-xs md:text-sm ${headingStyle}`}>{user.nama}</td>
                  <td className={`p-3 md:p-4 text-xs md:text-sm ${subTextStyle}`}>{user.opd || '-'}</td>
                  <td className="p-3 md:p-4">
                    <span className={`px-2 py-1 rounded text-[10px] md:text-xs font-bold ${user.role === 'super_admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-green-500/20 text-green-300 border border-green-500/30'}`}>
                      {user.role === 'super_admin' ? 'SUPER ADMIN' : 'ADMIN OPD'}
                    </span>
                  </td>
                  <td className="p-3 md:p-4 flex justify-center gap-3">
                    {isSuperAdmin ? (
                      <>
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
                      </>
                    ) : (
                      <span className={`text-xs ${subTextStyle}`}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3 relative z-20">
          {isLoading ? (
            <div className={`backdrop-blur-xl border rounded-xl p-6 text-center text-sm ${cardStyle} ${loadingColor}`}>
              Sedang memuat data...
            </div>
          ) : paginatedUsers.length === 0 ? (
            <div className={`backdrop-blur-xl border rounded-xl p-6 text-center text-sm ${cardStyle} ${subTextStyle}`}>
              {searchQuery ? `Tidak ada user yang cocok dengan "${searchQuery}"` : 'Belum ada data user'}
            </div>
          ) : paginatedUsers.map((user) => (
            <div key={user.id} className={`backdrop-blur-xl border rounded-xl p-3 sm:p-4 shadow-lg ${cardStyle}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className={`font-bold text-sm ${headingStyle}`}>{user.nama}</p>
                  <p className="font-mono text-xs text-cyan-300">@{user.username}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${user.role === 'super_admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-green-500/20 text-green-300 border border-green-500/30'}`}>
                  {user.role === 'super_admin' ? 'SUPER ADMIN' : 'ADMIN OPD'}
                </span>
              </div>
              <p className={`text-xs mb-3 ${subTextStyle}`}>{user.opd || 'Tidak ada OPD'}</p>
              {isSuperAdmin && (
                <div className={`flex gap-2 border-t pt-2 ${isDark ? 'border-white/5' : 'border-white/10'}`}>
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
              )}
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        {!isLoading && <Pagination />}

      </div>

      {/* MODAL FORM */}
      <UserFormModal
        isOpen={isModalOpen}
        mode={modalMode}
        initialData={selectedUser}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

      {/* MODAL KONFIRMASI HAPUS */}
      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        title="Hapus User"
        message={`Yakin ingin menghapus user "${confirmDelete.nama}"? Aksi ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        isDangerous
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default ManajemenUser;
