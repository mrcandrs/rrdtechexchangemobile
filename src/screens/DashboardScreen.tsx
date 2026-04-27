import React, { useMemo } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useData } from '../data/DataContext';
import { colors, fontFamily } from '../theme';
import { GlassCard } from '../components/Glass';
import { H1, H2, Label, P } from '../components/Text';
import { formatPeso } from '../utils/money';
import { countThisMonth, sumThisMonth, sumToday, topCategoriesThisMonth, weekBars } from '../constants/stats';
import { CategoryIcon } from '../icons/category';
import { useAuth } from '../auth/AuthContext';
import { ModalShell } from '../components/ModalShell';
import { FieldLabel, TextField } from '../components/Inputs';
import { PrimaryButton } from '../components/Button';
import { useFeedback } from '../feedback/FeedbackContext';

export function DashboardScreen({ onSeeAll }: { onSeeAll: () => void }) {
  const { data } = useData();
  const { signOut, displayName, updateProfileName } = useAuth();
  const { showMessage } = useFeedback();
  const now = new Date();
  const [editNameOpen, setEditNameOpen] = React.useState(false);
  const [newName, setNewName] = React.useState(displayName);
  const [savingName, setSavingName] = React.useState(false);

  const thisMonth = useMemo(() => sumThisMonth(data.expenses, now), [data.expenses]);
  const today = useMemo(() => sumToday(data.expenses, now), [data.expenses]);
  const txCount = useMemo(() => countThisMonth(data.expenses, now), [data.expenses]);
  const bars = useMemo(() => weekBars(data.expenses, now), [data.expenses]);
  const topCats = useMemo(() => topCategoriesThisMonth(data.expenses, now).slice(0, 5), [data.expenses]);

  const maxBar = Math.max(1, ...bars.map((b) => b.total));
  const recent = data.expenses.slice(0, 6);
  const thisMonthProgress = Math.max(8, Math.min(100, Math.round((today / Math.max(thisMonth, 1)) * 100)));
  const initials = (displayName || 'U')
    .split(' ')
    .map((s) => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 140 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <Pressable
            onPress={() => {
              setNewName(displayName);
              setEditNameOpen(true);
            }}
            style={({ pressed }) => ({
              width: 44,
              height: 44,
              borderRadius: 22,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255,255,255,0.09)',
              borderWidth: 1,
              borderColor: colors.border2,
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Text style={{ color: colors.text, fontFamily: fontFamily.black, fontSize: 14 }}>{initials}</Text>
          </Pressable>
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={{ color: colors.text2, fontFamily: fontFamily.medium, fontSize: 14 }}>Welcome back,</Text>
            <Text style={{ color: colors.text, fontFamily: fontFamily.black, fontSize: 22 }}>{displayName}</Text>
          </View>
        </View>
        <Pressable
          onPress={() => {
            Alert.alert('Log out?', 'Are you sure you want to log out?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Log out', style: 'destructive', onPress: () => signOut() },
            ]);
          }}
          hitSlop={10}
          style={({ pressed }) => ({
            width: 38,
            height: 38,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: pressed ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
          })}
        >
          <MaterialCommunityIcons name="logout-variant" size={18} color="rgba(233,238,243,0.8)" />
        </Pressable>
      </View>

      <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
        <GlassCard style={{ flex: 1 }} padding={14}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ color: colors.cyan2, fontFamily: fontFamily.black, fontSize: 12 }}>This Month</Text>
            <MaterialCommunityIcons name="calendar-month-outline" size={17} color="rgba(233,238,243,0.45)" />
          </View>
          <Text style={{ color: colors.text, fontFamily: fontFamily.black, fontSize: 26, marginTop: 8 }}>
            {formatPeso(thisMonth)}
          </Text>
          <View
            style={{
              height: 8,
              borderRadius: 999,
              backgroundColor: 'rgba(255,255,255,0.1)',
              marginTop: 10,
              overflow: 'hidden',
            }}
          >
            <View style={{ width: `${thisMonthProgress}%`, height: 8, borderRadius: 999, backgroundColor: colors.cyan2 }} />
          </View>
        </GlassCard>

        <GlassCard style={{ flex: 1 }} padding={14}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ color: colors.text2, fontFamily: fontFamily.black, fontSize: 12 }}>Today</Text>
            <MaterialCommunityIcons name="wallet-outline" size={16} color="rgba(233,238,243,0.45)" />
          </View>
          <Text style={{ color: colors.text, fontFamily: fontFamily.black, fontSize: 26, marginTop: 8 }}>
            {formatPeso(today)}
          </Text>
          <Text style={{ color: colors.text3, fontFamily: fontFamily.bold, marginTop: 10, fontSize: 11 }}>
            {txCount} transactions this month
          </Text>
        </GlassCard>
      </View>

      <GlassCard style={{ marginTop: 12, borderRadius: 14 }} padding={14}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ color: colors.text2, fontFamily: fontFamily.medium, fontSize: 17 }}>Total Transactions: {txCount}</Text>
          <Pressable
            onPress={onSeeAll}
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1, padding: 4 })}
          >
            <MaterialCommunityIcons name="chevron-right" size={18} color="rgba(233,238,243,0.55)" />
          </Pressable>
        </View>
      </GlassCard>

      <GlassCard style={{ marginTop: 12 }}>
        <H2>This Week</H2>
        <View style={{ height: 12 }} />
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          {bars.map((b) => {
            const h = Math.max(6, Math.round((b.total / maxBar) * 78));
            return (
              <View key={b.label} style={{ alignItems: 'center', width: 34 }}>
                <View style={{ width: 10, height: h, borderRadius: 4, backgroundColor: colors.cyan2, opacity: 0.9 }} />
                <Text style={{ color: colors.text3, fontFamily: fontFamily.extrabold, fontSize: 10, marginTop: 8 }}>
                  {b.label}
                </Text>
              </View>
            );
          })}
        </View>
      </GlassCard>

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
        <GlassCard style={{ flex: 1 }} padding={14}>
          <Text style={{ color: colors.text, fontFamily: fontFamily.black, fontSize: 18 }}>Top Categories</Text>
          <View style={{ marginTop: 10, gap: 12 }}>
            {topCats.slice(0, 3).map((c) => (
              <View key={c.category} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 10,
                    backgroundColor: 'rgba(18,214,230,0.14)',
                    borderWidth: 1,
                    borderColor: 'rgba(18,214,230,0.2)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CategoryIcon category={c.category} size={15} color={colors.cyan2} />
                </View>
                <Text style={{ color: colors.text2, fontFamily: fontFamily.bold, fontSize: 14 }}>{c.category}</Text>
              </View>
            ))}
          </View>
        </GlassCard>

        <GlassCard style={{ flex: 1 }} padding={14}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: colors.text, fontFamily: fontFamily.black, fontSize: 18 }}>Recent Expenses</Text>
            <Pressable onPress={onSeeAll}>
              <Text style={{ color: colors.cyan2, fontFamily: fontFamily.extrabold, fontSize: 12 }}>All</Text>
            </Pressable>
          </View>
          <View style={{ marginTop: 10, gap: 8 }}>
            {recent.slice(0, 3).map((e) => (
              <View key={e.id} style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)', paddingBottom: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <Text numberOfLines={1} style={{ color: colors.text2, fontFamily: fontFamily.medium, fontSize: 13, flex: 1 }}>
                    {e.title}
                  </Text>
                  <Text style={{ color: colors.text, fontFamily: fontFamily.bold, fontSize: 13 }}>-{formatPeso(e.amount).slice(1)}</Text>
                </View>
              </View>
            ))}
          </View>
        </GlassCard>
      </View>

      <ModalShell visible={editNameOpen} title="Edit Profile Name" onClose={() => setEditNameOpen(false)} width={360}>
        <View style={{ gap: 12 }}>
          <View>
            <FieldLabel>NAME</FieldLabel>
            <TextField value={newName} onChangeText={setNewName} placeholder="Your name" />
          </View>
          <PrimaryButton
            title={savingName ? 'Saving…' : 'Save Name'}
            disabled={savingName || newName.trim().length < 2}
            onPress={async () => {
              setSavingName(true);
              const res = await updateProfileName(newName);
              setSavingName(false);
              if (!res.ok) {
                showMessage(res.message, 'error');
                return;
              }
              showMessage('Profile name updated.', 'success');
              setEditNameOpen(false);
            }}
          />
        </View>
      </ModalShell>
    </ScrollView>
  );
}

