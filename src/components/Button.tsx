import React from 'react';
import { Pressable, StyleProp, Text, ViewStyle } from 'react-native';
import { colors, fontFamily } from '../theme';

export function PrimaryButton({
  title,
  onPress,
  style,
  disabled,
}: {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          height: 46,
          borderRadius: 12,
          backgroundColor: colors.cyan2,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.55 : pressed ? 0.9 : 1,
        },
        style,
      ]}
    >
      <Text style={{ color: '#032226', fontFamily: fontFamily.extrabold, letterSpacing: 0.2 }}>{title}</Text>
    </Pressable>
  );
}

export function GhostButton({
  title,
  onPress,
  style,
}: {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          height: 38,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: colors.border2,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 14,
          backgroundColor: pressed ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
        },
        style,
      ]}
    >
      <Text style={{ color: colors.text, fontFamily: fontFamily.bold, fontSize: 12 }}>{title}</Text>
    </Pressable>
  );
}

