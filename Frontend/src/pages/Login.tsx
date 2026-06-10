import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { loginUser } from '../utils/auth';
import { useTheme } from '../hooks/useTheme';
import { GlassInput } from '../components/common/GlassInput';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  // State Form
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    const result = await loginUser(username, password);

    if (result.success) {
      navigate('/');
    } else {
      setErrorMsg(result.error || 'Login Gagal.');
    }

    setIsLoading(false);
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center relative overflow-hidden px-4 sm:px-6 transition-colors duration-500 ${isDark ? 'bg-slate-950' : 'bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100'}`}>
      {/* Background Effect */}
      <div className={`absolute top-0 left-0 w-full h-full bg-[url('/peta-pati-clean.png')] bg-cover blur-sm ${isDark ? 'opacity-10' : 'opacity-5'}`}></div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative z-10 backdrop-blur-xl border p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md ${isDark
          ? 'bg-slate-900/60 border-white/10'
          : 'bg-blue-950/30 border-white/30'
          }`}
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center text-white">Login Dashboard</h1>

        {errorMsg && (
          <div className="text-xs sm:text-sm p-2.5 sm:p-3 rounded mb-4 text-center border bg-red-500/20 text-red-200 border-red-500/50">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          <GlassInput
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Masukkan username"
            required
          />
          <GlassInput
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full font-bold py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all disabled:opacity-50 text-sm sm:text-base text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-lg shadow-blue-500/20"
          >
            {isLoading ? 'Memuat...' : 'Masuk'}
          </button>
        </form>

        <div className="mt-3 sm:mt-4 text-center">
          <button
            type="button"
            onClick={() => navigate('/')}
            className={`text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all ${isDark
              ? 'text-slate-200 bg-white/5 hover:bg-white/10 active:bg-white/15'
              : 'text-slate-600 bg-slate-100 hover:bg-slate-200 active:bg-slate-300'
              }`}
          >
            Kembali ke Beranda
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;