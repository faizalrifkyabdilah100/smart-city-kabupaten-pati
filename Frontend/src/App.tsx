// 1. GANTI BrowserRouter JADI MemoryRouter (Sesuai kode Bos)
import { MemoryRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import GlobalBackground from './components/layout/GlobalBackground';
import PageTransition from './components/common/PageTransition';

// === IMPORT HALAMAN ===
import Home from './pages/Home';
import Login from './pages/Login'; // <--- JANGAN LUPA IMPORT INI
import LingkunganHidup from './pages/LingkunganHidup';
import Infrastruktur from './pages/Infrastruktur';
import Kesehatan from './pages/Kesehatan';
import SosialMedia from './pages/SosialMedia';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        
        {/* Rute Home */}
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        
        {/* Rute Login (TAMBAHKAN INI) */}
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />

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
    <div className="relative w-screen h-screen overflow-hidden bg-slate-900 text-white">
      <GlobalBackground />
      
      {/* Router Wrapper */}
      <Router>
        <AnimatedRoutes />
      </Router>
      
    </div>
  );
}

export default App;