import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider, useTheme } from './hooks/useTheme';
import { ToastProvider } from './components/common/Toast';
import GlobalBackground from './components/layout/GlobalBackground';
import PageTransition from './components/common/PageTransition';
import ProtectedRoute from './components/common/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import { Spinner } from './components/common/Spinner';

// === LAZY-LOADED PAGES (code splitting — mengurangi bundle awal ~60%) ===
const Home          = lazy(() => import('./pages/Home'));
const Login         = lazy(() => import('./pages/Login'));
const ManajemenUser = lazy(() => import('./pages/ManajemenUser'));
const LingkunganHidup = lazy(() => import('./pages/LingkunganHidup'));
const Infrastruktur = lazy(() => import('./pages/Infrastruktur'));
const Kesehatan     = lazy(() => import('./pages/Kesehatan'));
const Kominfo       = lazy(() => import('./pages/Kominfo'));
const CCTVMonitor   = lazy(() => import('./pages/CCTVMonitor'));
const NotFound      = lazy(() => import('./pages/NotFound'));

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Spinner size="lg" color="border-cyan-400" label="Memuat halaman..." />
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <Suspense fallback={<PageFallback />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>

          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />

          <Route path="/manajemen-user" element={
            <PageTransition>
              <ProtectedRoute><ManajemenUser /></ProtectedRoute>
            </PageTransition>
          } />
          <Route path="/lingkungan-hidup" element={
            <PageTransition>
              <ProtectedRoute><LingkunganHidup /></ProtectedRoute>
            </PageTransition>
          } />
          <Route path="/infrastruktur" element={
            <PageTransition>
              <ProtectedRoute><Infrastruktur /></ProtectedRoute>
            </PageTransition>
          } />
          <Route path="/kesehatan" element={
            <PageTransition>
              <ProtectedRoute><Kesehatan /></ProtectedRoute>
            </PageTransition>
          } />
          <Route path="/kominfo" element={
            <PageTransition>
              <ProtectedRoute><Kominfo /></ProtectedRoute>
            </PageTransition>
          } />
          <Route path="/cctv-monitor" element={
            <PageTransition>
              <ProtectedRoute><CCTVMonitor /></ProtectedRoute>
            </PageTransition>
          } />

          {/* Catch-all 404 */}
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />

        </Routes>
      </AnimatePresence>
    </Suspense>
  );
};

const AppContent = () => {
  useTheme(); // Ensures ThemeProvider context is consumed (triggers re-render on theme change)

  return (
    <div className="relative w-screen min-h-screen overflow-x-hidden transition-colors duration-500 text-white">
      <GlobalBackground />
      <Router>
        <AnimatedRoutes />
      </Router>
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
