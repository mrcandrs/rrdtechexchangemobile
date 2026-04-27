import React from 'react';
import './src/utils/polyfills';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, Poppins_800ExtraBold, Poppins_900Black } from '@expo-google-fonts/poppins';
import { Text as RNText } from 'react-native';
import { DataProvider } from './src/data/DataContext';
import { AuthProvider } from './src/auth/AuthContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FeedbackProvider } from './src/feedback/FeedbackContext';
import { SplashScreen } from './src/screens/SplashScreen';
import { fontFamily } from './src/theme';

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Poppins_900Black,
  });
  const setDefaultFontOnce = React.useRef(false);

  if (!fontsLoaded) {
    return <SplashScreen />;
  }

  if (!setDefaultFontOnce.current) {
    const t = RNText as unknown as { defaultProps?: { style?: any } };
    const prev = t.defaultProps?.style;
    const next = Array.isArray(prev) ? [...prev, { fontFamily: fontFamily.regular }] : [prev, { fontFamily: fontFamily.regular }].filter(Boolean);
    t.defaultProps = { ...(t.defaultProps ?? {}), style: next };
    setDefaultFontOnce.current = true;
  }

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
