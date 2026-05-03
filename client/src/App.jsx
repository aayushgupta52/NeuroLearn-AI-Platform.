import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import CoursesPage from './pages/CoursesPage';
import CourseViewerPage from './pages/CourseViewerPage';
import AITutorPage from './pages/AITutorPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import UpgradePage from './pages/UpgradePage';

function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Loading NeuroLearn AI...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Loading NeuroLearn AI...</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <SignupPage />} />

      {/* Protected routes with layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:id" element={<CourseViewerPage />} />
          <Route path="/ai-tutor" element={<AITutorPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/upgrade" element={<UpgradePage />} />
        </Route>
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
