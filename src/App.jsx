import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import EmployeeLogin from './screens/auth/EmployeeLogin';
import EmployeeRegister from './screens/auth/EmployeeRegister';
import GuardLogin from './screens/auth/GuardLogin';
import EmployeeDashboard from './screens/employee/EmployeeDashboard';
import ProfileScreen from './screens/employee/ProfileScreen';
import AttendanceScreen from './screens/employee/AttendanceScreen';
import QRScanner from './screens/guard/QRScanner';
import AttendanceList from './screens/guard/AttendanceList';
import './index.css';

const ProtectedRoute = ({ children, allowedTypes }) => {
  const { user, userType, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedTypes && !allowedTypes.includes(userType)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Layout>{children}</Layout>;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/" element={<EmployeeLogin />} />
      <Route path="/register" element={<EmployeeRegister />} />
      <Route path="/guard-login" element={<GuardLogin />} />

      {/* Employee Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedTypes={['employee']}>
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedTypes={['employee']}>
            <ProfileScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/attendance"
        element={
          <ProtectedRoute allowedTypes={['employee']}>
            <AttendanceScreen />
          </ProtectedRoute>
        }
      />

      {/* Guard Routes */}
      <Route
        path="/scanner"
        element={
          <ProtectedRoute allowedTypes={['guard']}>
            <QRScanner />
          </ProtectedRoute>
        }
      />
      <Route
        path="/attendance-list"
        element={
          <ProtectedRoute allowedTypes={['guard']}>
            <AttendanceList />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;