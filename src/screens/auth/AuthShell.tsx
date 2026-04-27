import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { GlassCard } from '../../components/Glass';
import { Screen } from '../../components/Screen';

export function AuthShell({
  children,
  withCard = true,
}: {
  children: React.ReactNode;
  withCard?: boolean;
}) {
  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 18, paddingTop: 14, paddingBottom: 30 }}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            {withCard ? <GlassCard padding={18}>{children}</GlassCard> : <View>{children}</View>}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

