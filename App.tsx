import React from 'react';
import './src/utils/polyfills';
import { DataProvider } from './src/data/DataContext';
import { AuthProvider } from './src/auth/AuthContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FeedbackProvider } from './src/feedback/FeedbackContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <FeedbackProvider>
        <AuthProvider>
          <DataProvider>
            <RootNavigator />
          </DataProvider>
        </AuthProvider>
      </FeedbackProvider>
    </SafeAreaProvider>
  );
}
