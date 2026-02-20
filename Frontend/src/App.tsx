import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider, useTheme } from './hooks/useTheme';

import GlobalBackground from './components/layout/GlobalBackground';
import PageTransition from './components/common/PageTransition';

// === IMPORT HALAMAN ===
import Home from './pages/Home';
import Login from './pages/Login';
import ManajemenUser from './pages/ManajemenUser';
import LingkunganHidup from './pages/LingkunganHidup';
import Infrastruktur from './pages/Infrastruktur';
import Kesehatan from './pages/Kesehatan';
import Kominfo from './pages/Kominfo';
import CCTVMonitor from './pages/CCTVMonitor';
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
        <Route path="/kominfo" element={<PageTransition><Kominfo /></PageTransition>} />
        <Route path="/cctv-monitor" element={<PageTransition><CCTVMonitor /></PageTransition>} />

      </Routes>
    </AnimatePresence>
  );
};

const AppContent = () => {
  const { isDark } = useTheme();

  return (
    <div className={`relative w-screen min-h-screen overflow-x-hidden transition-colors duration-500 ${isDark ? 'text-white' : 'text-slate-800'}`}>
      <GlobalBackground />

      <Router>
        <AnimatedRoutes />
      </Router>

    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;