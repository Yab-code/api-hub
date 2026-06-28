import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Context
import { AuthProvider } from './context/AuthContext';

// Guards
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

// Auth-Required Pages
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Settings from './pages/Settings';
import UserProfile from './pages/UserProfile';
import UserManagement from './pages/UserManagement';
import Notifications from './pages/Notifications';

// API Discovery Pages
import ApiExplorer from './pages/ApiExplorer';
import ApiDetails from './pages/ApiDetails';
import ApiTester from './pages/ApiTester';
import ApiHealthMonitor from './pages/ApiHealthMonitor';
import ApiManagement from './pages/ApiManagement';

// Content Pages
import Collections from './pages/Collections';
import CollectionDetails from './pages/CollectionDetails';
import Favorites from './pages/Favorites';
import RequestHistory from './pages/RequestHistory';
import ReviewsRatings from './pages/ReviewsRatings';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ─── Public routes (MainLayout) ─── */}
          <Route element={<MainLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="/" element={<LandingPage />} />
          </Route>

          {/* ─── Auth routes (AuthLayout) ─── */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          {/* ─── Protected App routes (DashboardLayout) ─── */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              {/* Dashboards */}
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />

              {/* User */}
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/admin/users" element={<UserManagement />} />

              {/* API Discovery */}
              <Route path="/explore" element={<ApiExplorer />} />
              <Route path="/apis" element={<ApiExplorer />} />
              <Route path="/apis/:id" element={<ApiDetails />} />
              <Route path="/tester" element={<ApiTester />} />
              <Route path="/health" element={<ApiHealthMonitor />} />
              <Route path="/manage" element={<ApiManagement />} />
              <Route path="/apis/manage" element={<ApiManagement />} />
              <Route path="/apis/manage/new" element={<ApiManagement />} />

              {/* Content */}
              <Route path="/collections" element={<Collections />} />
              <Route path="/collections/:id" element={<CollectionDetails />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/history" element={<RequestHistory />} />
              <Route path="/reviews" element={<ReviewsRatings />} />
            </Route>
          </Route>

          {/* ─── Catch-all ─── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
