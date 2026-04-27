import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Screen } from '../components/Screen';
import { colors, fontFamily } from '../theme';

export function SplashScreen() {
  return (
    <Screen>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ color: colors.text3, fontFamily: fontFamily.extrabold, fontSize: 10, letterSpacing: 1 }}>
          RRD TECH EXCHANGE
        </Text>
        <Text style={{ color: colors.text, fontFamily: fontFamily.black, fontSize: 26, marginTop: 10 }}>
          Expense Tracker
        </Text>
        <ActivityIndicator size="small" color={colors.cyan2} style={{ marginTop: 18 }} />
      </View>
    </Screen>
  );
}
