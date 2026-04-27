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
  const { signOut, displayName, role, updateProfileName } = useAuth();
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

  return (
    <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 140 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View>
          <Text style={{ color: colors.text3, fontFamily: fontFamily.extrabold, fontSize: 10, letterSpacing: 0.8 }}>
            RRD TECH EXCHANGE
          </Text>
          <H1 style={{ marginTop: 4 }}>Expense Tracker</H1>
          <Pressable
            onPress={() => {
              setNewName(displayName);
              setEditNameOpen(true);
            }}
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1, marginTop: 4 })}
          >
            <Text style={{ color: colors.text2, fontFamily: fontFamily.bold, fontSize: 11 }}>
              {displayName} • {role === 'main_admin' ? 'Main Admin' : 'Member'} • Edit
            </Text>
          </Pressable>
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
            width: 36,
            height: 36,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: pressed ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
          })}
        >
          <MaterialCommunityIcons name="logout" size={18} color="rgba(233,238,243,0.7)" />
        </Pressable>
      </View>

      <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
        <GlassCard style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Label>THIS MONTH</Label>
            <View
              style={{
                width: 18,
                height: 18,
                borderRadius: 6,
                backgroundColor: 'rgba(18,214,230,0.14)',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: 'rgba(18,214,230,0.25)',
              }}
            >
              <Text style={{ color: colors.cyan2, fontFamily: fontFamily.black, fontSize: 10 }}>₱</Text>
            </View>
          </View>
          <H2 style={{ marginTop: 6 }}>{formatPeso(thisMonth)}</H2>
          <Text style={{ color: colors.text3, fontFamily: fontFamily.extrabold, fontSize: 10, marginTop: 4 }}>0</Text>
        </GlassCard>

        <GlassCard style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Label>TODAY</Label>
            <View
              style={{
                width: 18,
                height: 18,
                borderRadius: 6,
                backgroundColor: 'rgba(18,214,230,0.14)',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: 'rgba(18,214,230,0.25)',
              }}
            >
              <Text style={{ color: colors.cyan2, fontFamily: fontFamily.black, fontSize: 10 }}>≡</Text>
            </View>
          </View>
          <H2 style={{ marginTop: 6 }}>{formatPeso(today)}</H2>
          <Text style={{ color: colors.text3, fontFamily: fontFamily.extrabold, fontSize: 10, marginTop: 4 }}> </Text>
        </GlassCard>
      </View>

      <GlassCard style={{ marginTop: 12, borderColor: 'rgba(18,214,230,0.25)' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 10,
              backgroundColor: 'rgba(18,214,230,0.14)',
              borderWidth: 1,
              borderColor: 'rgba(18,214,230,0.22)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: colors.cyan2, fontFamily: fontFamily.black }}>⎘</Text>
          </View>
          <View style={{ flex: 1 }}>
            <P>Total Transactions</P>
            <Text style={{ color: colors.text, fontFamily: fontFamily.extrabold, marginTop: 2 }}>{txCount} this month</Text>
          </View>
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

      <GlassCard style={{ marginTop: 12 }}>
        <H2>Top Categories</H2>
        <View style={{ height: 10 }} />
        {topCats.map((c) => {
          const total = c.total;
          const denom = Math.max(1, topCats.reduce((acc, x) => acc + x.total, 0));
          const pct = Math.round((total / denom) * 100);
          return (
            <View key={c.category} style={{ marginTop: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 10,
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      borderWidth: 1,
                      borderColor: colors.border,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CategoryIcon category={c.category} size={14} color="rgba(233,238,243,0.7)" />
                  </View>
                  <Text style={{ color: colors.text, fontFamily: fontFamily.extrabold }}>{c.category}</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                  <Text style={{ color: colors.text, fontFamily: fontFamily.black }}>{formatPeso(total)}</Text>
                  <Text style={{ color: colors.text3, fontFamily: fontFamily.extrabold, width: 34, textAlign: 'right' }}>
                    {pct}%
                  </Text>
                </View>
              </View>
              <View
                style={{
                  height: 4,
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  borderRadius: 999,
                  marginTop: 8,
                  overflow: 'hidden',
                }}
              >
                <View style={{ width: `${pct}%`, height: 4, backgroundColor: colors.cyan2 }} />
              </View>
            </View>
          );
        })}
      </GlassCard>

      <GlassCard style={{ marginTop: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <H2>Recent Expenses</H2>
          <Pressable onPress={onSeeAll}>
            <Text style={{ color: colors.cyan2, fontFamily: fontFamily.extrabold, fontSize: 12 }}>See all ›</Text>
          </Pressable>
        </View>
        <View style={{ height: 10 }} />
        {recent.map((e) => (
          <View
            key={e.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 10,
              borderBottomWidth: 1,
              borderBottomColor: 'rgba(255,255,255,0.05)',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 10,
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  borderWidth: 1,
                  borderColor: colors.border,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CategoryIcon category={e.category} size={16} color="rgba(233,238,243,0.7)" />
              </View>
              <View>
                <Text style={{ color: colors.text, fontFamily: fontFamily.extrabold }}>{e.title}</Text>
                <Text style={{ color: colors.text3, fontFamily: fontFamily.extrabold, fontSize: 11 }}>
                  {e.occurredAtISO} • {e.createdByName || 'Unknown'}
                </Text>
              </View>
            </View>
            <Text style={{ color: colors.text, fontFamily: fontFamily.black }}>-{formatPeso(e.amount).slice(1)}</Text>
          </View>
        ))}
      </GlassCard>

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

