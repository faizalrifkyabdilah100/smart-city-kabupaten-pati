// 1. UBAH DARI MemoryRouter KE BrowserRouter
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import GlobalBackground from './components/layout/GlobalBackground';
import PageTransition from './components/common/PageTransition';

// === IMPORT HALAMAN ===
import Home from './pages/Home';
import Login from './pages/Login';
import ManajemenUser from './pages/ManajemenUser'; // Pastikan ini sudah di-import
import LingkunganHidup from './pages/LingkunganHidup';
import Infrastruktur from './pages/Infrastruktur';
import Kesehatan from './pages/Kesehatan';
import SosialMedia from './pages/SosialMedia';
import ProtectedRoute from './components/common/ProtectedRoute';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        
        {/* Rute Home */}
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        
        {/* Rute Login */}
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />

        {/* Rute Admin (Manajemen User) */}
        <Route
          path="/manajemen-user"
          element={
            <PageTransition>
              <ProtectedRoute>
                <ManajemenUser />
              </ProtectedRoute>
            </PageTransition>
          }
        />

        {/* Rute Dashboard Lainnya */}
        <Route path="/lingkungan-hidup" element={<PageTransition><LingkunganHidup /></PageTransition>} />
        <Route path="/infrastruktur" element={<PageTransition><Infrastruktur /></PageTransition>} />
        <Route path="/kesehatan" element={<PageTransition><Kesehatan /></PageTransition>} />
        <Route path="/sosial-media" element={<PageTransition><SosialMedia /></PageTransition>} />
      
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-800 text-white">
      <GlobalBackground />
      
      {/* 2. Router sekarang pakai BrowserRouter (Web Standar) */}
      <Router>
        <AnimatedRoutes />
      </Router>
      
    </div>
  );
}

export default App;