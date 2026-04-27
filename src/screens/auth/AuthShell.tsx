import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { GlassCard } from '../../components/Glass';
import { Screen } from '../../components/Screen';

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 18, paddingBottom: 30 }}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <GlassCard padding={18}>{children}</GlassCard>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

