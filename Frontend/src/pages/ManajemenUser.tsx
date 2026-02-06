import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { type User } from '../types';
import Navbar from '../components/layout/Navbar';
import UserFormModal from '../components/common/UserFormModal';

const ManajemenUser: React.FC = () => {
  const navigate = useNavigate();
  
  // State Data
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State Modal Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // 1. CEK LOGIN & FETCH DATA
  useEffect(() => {
    const savedUser = localStorage.getItem('user_data');
    if (!savedUser) {
      navigate('/login');
      return;
    }
    fetchUsers();
  }, [navigate]);

  // 2. FUNGSI AMBIL DATA
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/users');
      const result = await response.json();
      setUsers(result);
    } catch (error) {
      console.error("Gagal ambil data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. FUNGSI BUKA MODAL
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

  // 4. LOGIKA SIMPAN (Create/Update)
  const handleSave = async (formData: any) => {
    const url = modalMode === 'add' 
      ? 'http://localhost:8080/api/users' 
      : `http://localhost:8080/api/users/${selectedUser?.id}`;
    
    const method = modalMode === 'add' ? 'POST' : 'PUT';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(modalMode === 'add' ? "User berhasil dibuat!" : "User berhasil diupdate!");
        setIsModalOpen(false);
        fetchUsers();
      } else {
        const err = await response.json();
        alert("Gagal: " + (err.messages?.error || "Terjadi kesalahan"));
      }
    } catch (error) {
      alert("Error koneksi ke server.");
    }
  };

  // 5. FUNGSI HAPUS
  const handleDelete = async (id: number, nama: string) => {
    if (!confirm(`Yakin ingin menghapus user "${nama}"?`)) return;

    try {
      const response = await fetch(`http://localhost:8080/api/users/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchUsers();
      } else {
        alert("Gagal menghapus user.");
      }
    } catch (error) {
      alert("Error koneksi.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-800 text-white p-8 relative overflow-hidden">
      {/* Background Tipis (lebih terang, sedikit blur & blending) */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-[url('/peta-pati-clean.png')] bg-cover opacity-10 backdrop-blur-sm pointer-events-none z-0"
        style={{ mixBlendMode: 'overlay' }}
      ></div>

      {/* Navbar */}
      <Navbar show={true} />

      {/* KONTAINER UTAMA (UPDATED: mt-36 & z-30 biar tidak ketutupan Navbar) */}
      <div className="max-w-6xl mx-auto relative z-30 mt-36">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Manajemen User</h1>
            <p className="text-slate-400 text-sm">Kelola akses admin OPD dan Super Admin</p>
          </div>
          
          {/* TOMBOL TAMBAH (UPDATED: z-50 & pointer-events-auto biar bisa diklik) */}
          <button 
            onClick={handleAdd}
            className="relative z-50 pointer-events-auto cursor-pointer bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            + Tambah User
          </button>
        </div>

        {/* TABEL DATA */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative z-20">
          <table className="w-full text-left">
            <thead className="bg-slate-900/50 text-slate-300 text-sm uppercase tracking-wider">
              <tr>
                <th className="p-4 font-semibold">Username</th>
                <th className="p-4 font-semibold">Nama Lengkap</th>
                <th className="p-4 font-semibold">OPD / Instansi</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {isLoading ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-400">Sedang memuat data...</td></tr>
              ) : users.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-mono text-blue-300">{user.username}</td>
                  <td className="p-4 font-bold text-white">{user.nama}</td>
                  <td className="p-4 text-slate-300">{user.opd || '-'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'super_admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-green-500/20 text-green-300 border border-green-500/30'}`}>
                      {user.role === 'super_admin' ? 'SUPER ADMIN' : 'ADMIN OPD'}
                    </span>
                  </td>
                  <td className="p-4 flex justify-center gap-3">
                    <button 
                      onClick={() => handleEdit(user)}
                      className="relative z-10 cursor-pointer text-yellow-400 hover:text-yellow-300 font-medium"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(user.id, user.nama)}
                      className="relative z-10 cursor-pointer text-red-400 hover:text-red-300 font-medium"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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