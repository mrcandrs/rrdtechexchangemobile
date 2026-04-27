import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Screen } from '../components/Screen';
import { colors } from '../theme';

export function SplashScreen() {
  return (
    <Screen>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ color: colors.text3, fontWeight: '800', fontSize: 10, letterSpacing: 1 }}>RRD TECH EXCHANGE</Text>
        <Text style={{ color: colors.text, fontWeight: '900', fontSize: 26, marginTop: 10 }}>Expense Tracker</Text>
        <ActivityIndicator size="small" color={colors.cyan2} style={{ marginTop: 18 }} />
      </View>
    </Screen>
  );
}
