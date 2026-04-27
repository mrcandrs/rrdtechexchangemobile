import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../auth/AuthContext';
import { AppNavigator } from './AppNavigator';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { SplashScreen } from '../screens/SplashScreen';

export type RootStackParamList = {
  AuthLogin: undefined;
  AuthRegister: undefined;
  App: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { user, isHydrated } = useAuth();
  const [authScreen, setAuthScreen] = useState<'login' | 'register'>('login');
  const [minSplashDone, setMinSplashDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMinSplashDone(true), 900);
    return () => clearTimeout(t);
  }, []);

  // Keep it simple: show auth until session known.
  if (!isHydrated || !minSplashDone) {
    return <SplashScreen />;
  }

  if (!user) {
    return authScreen === 'login' ? (
      <LoginScreen onGoRegister={() => setAuthScreen('register')} />
    ) : (
      <RegisterScreen onGoLogin={() => setAuthScreen('login')} />
    );
  }

  return <AppNavigator />;
}

