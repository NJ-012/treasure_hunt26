import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Header from './components/header/Header';
import Login from './pages/login/Login';
import AdminPage from './pages/admin/Admin';
import ParticipantPage from './pages/participant/Participant.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.97, y: 16 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 1.02, y: -16 }}
    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}
  >
    {children}
  </motion.div>
);

const AppInner = () => {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  return (
    <div className={isAdmin ? 'admin-layout-wrapper' : 'mobile-layout-wrapper'}>
      <Header isAdmin={isAdmin} />

      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          width: '100%',
          padding: isAdmin ? '0' : '0 1rem 1.5rem',
          overflowX: 'hidden',
        }}
      >
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <PageWrapper><AdminPage /></PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/participant"
              element={
                <ProtectedRoute allowedRoles={['participant']}>
                  <PageWrapper><ParticipantPage /></PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AnimatePresence>
      </main>


    </div>
  );
};

const App = () => (
  <Router>
    <AppInner />
  </Router>
);

export default App;