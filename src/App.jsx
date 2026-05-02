import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import LandingScreen from './components/LandingScreen';
import OnboardingScreen from './components/OnboardingScreen';
import AppShell from './components/AppShell';
import './index.css';

function AppRouter() {
  const { currentScreen } = useApp();

  if (currentScreen === 'landing') return <LandingScreen />;
  if (currentScreen === 'onboarding') return <OnboardingScreen />;
  if (currentScreen === 'app') return <AppShell />;

  return <LandingScreen />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppRouter />
      </AppProvider>
    </AuthProvider>
  );
}
