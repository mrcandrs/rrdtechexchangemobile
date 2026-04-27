import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useData } from '../data/DataContext';
import { colors, fontFamily } from '../theme';
import { GlassCard } from '../components/Glass';
import { H1, H2, Label, P } from '../components/Text';
import { formatPeso } from '../utils/money';
import { challengeIsActive, challengeIsWon, challengeSpent } from '../constants/stats';
import { NewChallengeModal } from '../modals/NewChallengeModal';
import { useAuth } from '../auth/AuthContext';
import { useFeedback } from '../feedback/FeedbackContext';

export function ChallengesScreen() {
  const { data, deleteChallenge } = useData();
  const { canModifyAll } = useAuth();
  const { showMessage } = useFeedback();
  const now = new Date();
  const [open, setOpen] = useState(false);

  const totals = useMemo(() => {
    const total = data.challenges.length;
    const active = data.challenges.filter((c) => challengeIsActive(c, now)).length;
    const won = data.challenges.filter((c) => challengeIsWon(data.expenses, c, now)).length;
    return { total, active, won };
  }, [data.challenges, data.expenses]);

  return (
    <>
      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 140 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <H1>Challenges</H1>
            <P style={{ marginTop: 2 }}>Beat your spending goals</P>
          </View>
          <Pressable
            onPress={() => {
              if (!canModifyAll) {
                showMessage('Only the main admin can manage challenges.', 'error');
                return;
              }
              setOpen(true);
            }}
            style={({ pressed }) => ({
              height: 34,
              borderRadius: 10,
              paddingHorizontal: 12,
              backgroundColor: 'rgba(18,214,230,0.14)',
              borderWidth: 1,
              borderColor: 'rgba(18,214,230,0.25)',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <MaterialCommunityIcons name="plus" size={16} color={colors.cyan2} />
            <Text style={{ color: colors.cyan2, fontFamily: fontFamily.black, fontSize: 12 }}>New</Text>
          </Pressable>
        </View>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
          <GlassCard style={{ flex: 1, borderColor: 'rgba(255,216,77,0.5)' }} padding={14}>
            <Text style={{ fontSize: 18 }}>🏆</Text>
            <Text style={{ color: colors.text2, fontFamily: fontFamily.bold, marginTop: 4, fontSize: 12 }}>Total Challenges</Text>
            <Text style={{ color: colors.text, fontFamily: fontFamily.black, fontSize: 28, marginTop: 6 }}>{totals.total}</Text>
          </GlassCard>
          <GlassCard style={{ flex: 1, borderColor: 'rgba(0,229,255,0.5)' }} padding={14}>
            <Text style={{ fontSize: 18 }}>⏱️</Text>
            <Text style={{ color: colors.text2, fontFamily: fontFamily.bold, marginTop: 4, fontSize: 12 }}>Active Challenges</Text>
            <Text style={{ color: colors.text, fontFamily: fontFamily.black, fontSize: 28, marginTop: 6 }}>{totals.active}</Text>
          </GlassCard>
          <GlassCard style={{ flex: 1, borderColor: 'rgba(255,77,255,0.45)' }} padding={14}>
            <Text style={{ fontSize: 18 }}>🥇</Text>
            <Text style={{ color: colors.text2, fontFamily: fontFamily.bold, marginTop: 4, fontSize: 12 }}>Won Challenges</Text>
            <Text style={{ color: colors.text, fontFamily: fontFamily.black, fontSize: 28, marginTop: 6 }}>{totals.won}</Text>
          </GlassCard>
        </View>

        <Text style={{ marginTop: 16, marginBottom: 8, color: colors.text, fontFamily: fontFamily.black, fontSize: 20 }}>
          Active Challenges
        </Text>
        <View style={{ gap: 10 }}>
          {data.challenges.map((c) => {
            const spent = challengeSpent(data.expenses, c);
            const remaining = c.spendingLimit - spent;
            const ratio = c.spendingLimit > 0 ? spent / c.spendingLimit : 0;
            const pct = Math.max(0, Math.min(100, Math.round(ratio * 100)));
            const over = remaining < 0;
            return (
              <GlassCard key={c.id} padding={14} style={{ backgroundColor: 'rgba(26,45,76,0.7)', borderColor: 'rgba(80,120,180,0.35)' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <H2 style={{ fontSize: 14 }}>{c.title}</H2>
                  </View>
                  <Text style={{ fontSize: 22 }}>{over ? '⚠️' : '🎯'}</Text>
                  {canModifyAll ? (
                    <Pressable
                      onPress={() => {
                        Alert.alert('Delete challenge?', `Are you sure you want to delete "${c.title}"?`, [
                          { text: 'Cancel', style: 'cancel' },
                          {
                            text: 'Delete',
                            style: 'destructive',
                            onPress: async () => {
                              try {
                                await deleteChallenge(c.id);
                                showMessage('Challenge deleted.', 'success');
                              } catch (e) {
                                const msg = e instanceof Error ? e.message : 'Unable to delete challenge.';
                                showMessage(msg, 'error');
                              }
                            },
                          },
                        ]);
                      }}
                      hitSlop={10}
                    >
                      <MaterialCommunityIcons name="trash-can-outline" size={18} color="rgba(233,238,243,0.55)" />
                    </Pressable>
                  ) : null}
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                  <Text style={{ color: colors.text2, fontFamily: fontFamily.bold, fontSize: 12 }}>
                    Remaining:
                    <Text style={{ color: over ? colors.red : colors.green, fontFamily: fontFamily.black }}>
                      {' '}
                      {over ? `${formatPeso(Math.abs(remaining))} (Over Budget)` : `${formatPeso(remaining)} (On Track)`}
                    </Text>
                  </Text>
                </View>

                <View
                  style={{
                    height: 22,
                    borderRadius: 999,
                    backgroundColor: 'rgba(8,18,48,0.9)',
                    marginTop: 10,
                    overflow: 'hidden',
                    justifyContent: 'center',
                  }}
                >
                  <View
                    style={{
                      width: `${Math.min(100, pct)}%`,
                      height: 22,
                      backgroundColor: over ? '#ff5b6d' : pct < 50 ? '#58d26a' : pct < 85 ? '#d3ef57' : '#12D6E6',
                      borderRadius: 999,
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      paddingRight: 8,
                    }}
                  >
                    <Text style={{ color: '#041018', fontFamily: fontFamily.black, fontSize: 12 }}>{pct}%</Text>
                  </View>
                </View>

                <Text style={{ color: colors.text2, fontFamily: fontFamily.medium, fontSize: 12, marginTop: 8 }}>
                  {challengeIsActive(c, now) ? `Ends in ${daysLeft(now, c.endISO)} day(s)` : `Ended • ${c.endISO}`}
                </Text>
              </GlassCard>
            );
          })}
        </View>
      </ScrollView>

      <NewChallengeModal visible={open} onClose={() => setOpen(false)} />
    </>
  );
}

function daysLeft(now: Date, endISO: string) {
  const end = new Date(`${endISO}T23:59:59`);
  const diff = Math.ceil((end.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
  return Math.max(0, diff);
}

