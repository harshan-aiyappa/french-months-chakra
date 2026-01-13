
import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';
import LoginScreen from './components/screens/LoginScreen';
import GameUnit from './components/GameUnit';
import DeveloperAttribution from './components/ui/DeveloperAttribution';
import { Box, Spinner, Center } from '@chakra-ui/react';

const AppRoot = () => {
  const { isAuthenticated, isLoading } = useAuth();

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

  return (
    <AppLayout>
      <GameUnit />
    </AppLayout>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppRoot />
    </AuthProvider>
  );
}

export default App;
