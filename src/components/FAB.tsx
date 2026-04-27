import React from 'react';
import { Pressable, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme';

export function FloatingActionButton({ onPress, bottomInset = 0 }: { onPress: () => void; bottomInset?: number }) {
  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        right: 18,
        bottom: 84 + bottomInset,
      }}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          width: 54,
          height: 54,
          borderRadius: 27,
          backgroundColor: colors.cyan2,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed ? 0.9 : 1,
          shadowColor: '#000',
          shadowOpacity: 0.35,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 8 },
          elevation: 12,
        })}
      >
        <MaterialCommunityIcons name="plus" size={26} color="#032226" />
      </Pressable>
    </View>
  );
}

