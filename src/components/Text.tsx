import React from 'react';
import { Text as RNText, TextProps } from 'react-native';
import { colors, fontFamily } from '../theme';

export function H1(props: TextProps) {
  return (
    <RNText
      {...props}
      style={[
        { color: colors.text, fontSize: 26, fontFamily: fontFamily.bold, letterSpacing: -0.2 },
        props.style,
      ]}
    />
  );
}

export function H2(props: TextProps) {
  return <RNText {...props} style={[{ color: colors.text, fontSize: 18, fontFamily: fontFamily.bold }, props.style]} />;
}

export function P(props: TextProps) {
  return <RNText {...props} style={[{ color: colors.text2, fontSize: 12, fontFamily: fontFamily.regular }, props.style]} />;
}

export function Label(props: TextProps) {
  return <RNText {...props} style={[{ color: colors.text3, fontSize: 11, fontFamily: fontFamily.bold }, props.style]} />;
}

