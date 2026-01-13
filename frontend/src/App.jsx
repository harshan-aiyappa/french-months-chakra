import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';
import LoginScreen from './components/screens/LoginScreen';
import GameUnit from './components/GameUnit';
import DeveloperAttribution from './components/ui/DeveloperAttribution';
import { Box, Spinner, Center } from '@chakra-ui/react';

import DashboardHome from './components/screens/DashboardHome';
import StatsScreen from './components/screens/StatsScreen';
import SettingsScreen from './components/screens/SettingsScreen';
import AdvancedPracticeScreen from './components/screens/AdvancedPracticeScreen';

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Center h="100vh" bg="bg">
        <Spinner size="xl" color="brand.500" thickness="4px" />
      </Center>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <LoginScreen />
        <DeveloperAttribution />
      </>
    );
  }

  // Get current route for active state
  const currentPath = location.pathname;
  const activeView = currentPath === '/practice' ? 'practice'
    : currentPath === '/advanced-practice' ? 'advanced'
      : currentPath === '/settings' ? 'settings'
        : 'dashboard';

  return (
    <AppLayout activeView={activeView} onNavigate={(view) => navigate(`/${view}`)}>
      <Routes>
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/advanced-practice" element={<AdvancedPracticeScreen />} />
        <Route path="/practice" element={<GameUnit />} />
        <Route path="/settings" element={<SettingsScreen />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppLayout>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
