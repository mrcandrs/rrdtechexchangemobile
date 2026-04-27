import React, { useMemo, useState } from 'react';
import { Modal, Pressable, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { colors } from '../theme';
import { fromISODate, formatShortDMY, toISODate } from '../utils/dates';
import { GlassCard } from './Glass';

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return <Text style={{ color: colors.text3, fontSize: 11, fontWeight: '800', marginBottom: 6 }}>{children}</Text>;
}

export function TextField({
  value,
  onChangeText,
  placeholder,
  keyboardType,
  secureTextEntry,
  right,
}: {
  value: string;
  onChangeText: (s: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric';
  secureTextEntry?: boolean;
  right?: React.ReactNode;
}) {
  return (
    <View
      style={{
        height: 44,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: 'rgba(255,255,255,0.03)',
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(233,238,243,0.28)"
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
        style={{ color: colors.text, fontWeight: '700', flex: 1, paddingVertical: 0 }}
      />
      {right ? <View style={{ marginLeft: 8 }}>{right}</View> : null}
    </View>
  );
}

export function PasswordField({
  value,
  onChangeText,
  placeholder,
}: {
  value: string;
  onChangeText: (s: string) => void;
  placeholder?: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <TextField
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={!visible}
      right={
        <Pressable onPress={() => setVisible((v) => !v)} hitSlop={10} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
          <MaterialCommunityIcons
            name={visible ? 'eye-off-outline' : 'eye-outline'}
            size={18}
            color="rgba(233,238,243,0.55)"
          />
        </Pressable>
      }
    />
  );
}

export function SelectField<T extends string>({
  value,
  placeholder,
  options,
  onSelect,
}: {
  value: T | null;
  placeholder: string;
  options: { value: T; label: string }[];
  onSelect: (v: T) => void;
}) {
  const [open, setOpen] = useState(false);
  const label = useMemo(() => options.find((o) => o.value === value)?.label ?? null, [options, value]);
  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={{
          height: 44,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: 'rgba(255,255,255,0.03)',
          paddingHorizontal: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ color: label ? colors.text : 'rgba(233,238,243,0.28)', fontWeight: '700' }}>
          {label ?? placeholder}
        </Text>
        <MaterialCommunityIcons name="chevron-down" size={18} color="rgba(233,238,243,0.55)" />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable
          onPress={() => setOpen(false)}
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', padding: 20, justifyContent: 'center' }}
        >
          <Pressable onPress={() => {}} style={{ width: '100%' }}>
            <GlassCard padding={12}>
              <Text style={{ color: colors.text, fontWeight: '800', marginBottom: 10 }}>Select</Text>
              {options.map((o) => (
                <Pressable
                  key={o.value}
                  onPress={() => {
                    onSelect(o.value);
                    setOpen(false);
                  }}
                  style={({ pressed }) => ({
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    borderRadius: 10,
                    backgroundColor: pressed ? 'rgba(255,255,255,0.06)' : 'transparent',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  })}
                >
                  <Text style={{ color: colors.text, fontWeight: '700' }}>{o.label}</Text>
                  {value === o.value ? (
                    <MaterialCommunityIcons name="check" size={18} color={colors.cyan2} />
                  ) : (
                    <View style={{ width: 18, height: 18 }} />
                  )}
                </Pressable>
              ))}
            </GlassCard>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

export function DateField({
  iso,
  onChangeISO,
}: {
  iso: string;
  onChangeISO: (iso: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const date = useMemo(() => fromISODate(iso), [iso]);

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={{
          height: 44,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: 'rgba(255,255,255,0.03)',
          paddingHorizontal: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ color: colors.text, fontWeight: '700' }}>{formatShortDMY(date)}</Text>
        <MaterialCommunityIcons name="calendar" size={18} color="rgba(233,238,243,0.55)" />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable
          onPress={() => setOpen(false)}
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', padding: 20, justifyContent: 'center' }}
        >
          <Pressable onPress={() => {}} style={{ width: '100%' }}>
            <GlassCard padding={12}>
              <Text style={{ color: colors.text, fontWeight: '800', marginBottom: 10 }}>Pick a date</Text>
              <View style={{ borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: colors.border }}>
                <Calendar
                  current={iso}
                  onDayPress={(day) => {
                    onChangeISO(day.dateString);
                  }}
                  markedDates={{
                    [iso]: { selected: true, selectedColor: colors.cyan2, selectedTextColor: '#032226' },
                  }}
                  theme={{
                    calendarBackground: 'rgba(255,255,255,0.03)',
                    monthTextColor: colors.text,
                    textMonthFontWeight: '800',
                    dayTextColor: colors.text,
                    textDayFontWeight: '700',
                    textDisabledColor: 'rgba(233,238,243,0.25)',
                    arrowColor: colors.cyan2,
                    todayTextColor: colors.cyan2,
                    textSectionTitleColor: 'rgba(233,238,243,0.45)',
                    selectedDayBackgroundColor: colors.cyan2,
                    selectedDayTextColor: '#032226',
                    dotColor: colors.cyan2,
                  }}
                />
              </View>
              <Pressable
                onPress={() => setOpen(false)}
                style={({ pressed }) => ({
                  marginTop: 10,
                  height: 40,
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: pressed ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
                  borderWidth: 1,
                  borderColor: colors.border,
                })}
              >
                <Text style={{ color: colors.text, fontWeight: '800' }}>Done</Text>
              </Pressable>
            </GlassCard>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

