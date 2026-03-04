import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { GlobalStyle } from './styles/GlobalStyles';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
const ActivitiesPage = lazy(() => import('./pages/ActivitiesPage'));
const GoalsPage = lazy(() => import('./pages/GoalsPage'));

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GlobalStyle />
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route
              path="/activities"
              element={
                <PrivateRoute>
                  <Suspense fallback={<div style={{ color: '#1E3A5F', textAlign: 'center' }}>Загрузка...</div>}>
                    <ActivitiesPage />
                  </Suspense>
                </PrivateRoute>
              }
            />
            <Route
              path="/goals"
              element={
                <PrivateRoute>
                  <Suspense fallback={<div style={{ color: '#1E3A5F', textAlign: 'center' }}>Загрузка...</div>}>
                    <GoalsPage />
                  </Suspense>
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;