import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
  const navigate = useNavigate();
  
  // State Form
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      // Pastikan Backend CI4 nyala di port 8080
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (response.ok) {
        // SUKSES
        console.log('Login Berhasil:', result.data);
        localStorage.setItem('user_data', JSON.stringify(result.data));
        navigate('/'); // Balik ke Home
      } else {
        // GAGAL
        setErrorMsg(result.messages?.error || 'Login Gagal. Periksa username/password.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Gagal terhubung ke server Backend.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/peta-pati-clean.png')] bg-cover opacity-10 blur-sm"></div>
      
      {/* Login Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-white mb-2 text-center">Login Dashboard</h1>
        
        {errorMsg && (
          <div className="bg-red-500/20 text-red-200 text-sm p-3 rounded mb-4 text-center border border-red-500/50">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6 mt-6">
          <div>
            <label className="block text-slate-300 text-sm mb-2">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan username"
            />
          </div>
          <div>
            <label className="block text-slate-300 text-sm mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
          >
            {isLoading ? 'Memuat...' : 'Masuk'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;