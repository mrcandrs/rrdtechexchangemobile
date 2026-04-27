import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../theme';

export function Screen({
  children,
  statusBarStyle = 'light',
}: {
  children: React.ReactNode;
  statusBarStyle?: 'light' | 'dark' | 'auto';
}) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg0 }} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar style={statusBarStyle} />
      <LinearGradient
        colors={[colors.bg0, colors.bg1]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={{ flex: 1 }}
      >
        {children}
      </LinearGradient>
    </SafeAreaView>
  );
}

