import React from 'react';
import { Image, Text, View } from 'react-native';
import { Screen } from '../components/Screen';
import { colors, fontFamily } from '../theme';

export function SplashScreen() {
  return (
    <Screen>
      <View style={{ flex: 1, paddingHorizontal: 24, paddingVertical: 42, justifyContent: 'space-between' }}>
        <View />
        <View style={{ alignItems: 'center' }}>
          <Image
            source={require('../../assets/login-logo.png')}
            resizeMode="contain"
            style={{ width: 96, height: 96, borderRadius: 48, borderWidth: 1, borderColor: 'rgba(18,214,230,0.3)' }}
          />
          <Text style={{ color: colors.cyan2, fontFamily: fontFamily.black, fontSize: 20, marginTop: 14 }}>Expense Tracker</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <View
            style={{
              width: '92%',
              height: 10,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: 'rgba(18,214,230,0.5)',
              backgroundColor: 'rgba(255,255,255,0.05)',
              overflow: 'hidden',
            }}
          >
            <View style={{ width: '72%', height: '100%', borderRadius: 999, backgroundColor: colors.cyan2 }} />
          </View>
          <Text style={{ color: colors.text2, fontFamily: fontFamily.medium, fontSize: 12, letterSpacing: 1, marginTop: 12 }}>
            RRD TECH EXCHANGE
          </Text>
        </View>
      </View>
    </Screen>
  );
}
