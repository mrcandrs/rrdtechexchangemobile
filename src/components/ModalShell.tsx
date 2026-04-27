import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, fontFamily } from '../theme';
import { GlassCard } from './Glass';

export function ModalShell({
  visible,
  title,
  onClose,
  children,
  width = 340,
}: {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  width?: number;
}) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.55)',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 18,
        }}
      >
        <Pressable onPress={() => {}} style={{ width: '100%', maxWidth: width }}>
          <GlassCard padding={16} style={{ backgroundColor: colors.card2 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={{ color: colors.text, fontSize: 18, fontFamily: fontFamily.extrabold }}>{title}</Text>
              <Pressable onPress={onClose} hitSlop={10} style={{ padding: 2 }}>
                <MaterialCommunityIcons name="close" size={20} color="rgba(233,238,243,0.6)" />
              </Pressable>
            </View>
            {children}
          </GlassCard>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

