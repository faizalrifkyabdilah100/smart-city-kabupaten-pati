// 1. GANTI BrowserRouter JADI MemoryRouter
import { MemoryRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import GlobalBackground from './components/layout/GlobalBackground';
import PageTransition from './components/common/PageTransition';

import Home from './pages/Home';
import LingkunganHidup from './pages/LingkunganHidup';
import Infrastruktur from './pages/Infrastruktur';
import Kesehatan from './pages/Kesehatan';
import SosialMedia from './pages/SosialMedia';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
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
      
      {/* 2. Router di sini sekarang mengacu pada MemoryRouter */}
      <Router>
        <AnimatedRoutes />
      </Router>
      
    </div>
  );
}

export default App;