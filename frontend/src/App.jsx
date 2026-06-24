import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { GlobalStyle } from './styles/GlobalStyles';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ActivitiesPage from './pages/ActivitiesPage';
import GoalsPage from './pages/GoalsPage';
import MotivationPage from './pages/MotivationPage';
import DailyChallengesPage from './pages/DailyChallengesPage';

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
                  <ActivitiesPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/goals"
              element={
                <PrivateRoute>
                  <GoalsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/motivation"
              element={
                <PrivateRoute>
                  <MotivationPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/daily-challenges"
              element={
                <PrivateRoute>
                  <DailyChallengesPage />
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