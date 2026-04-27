import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useData } from '../data/DataContext';
import { colors } from '../theme';
import { GlassCard } from '../components/Glass';
import { H1, H2, Label, P } from '../components/Text';
import { formatPeso } from '../utils/money';
import { challengeIsActive, challengeIsWon, challengeSpent } from '../constants/stats';
import { NewChallengeModal } from '../modals/NewChallengeModal';

export function ChallengesScreen() {
  const { data, deleteChallenge } = useData();
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
            onPress={() => setOpen(true)}
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
            <Text style={{ color: colors.cyan2, fontWeight: '900', fontSize: 12 }}>New</Text>
          </Pressable>
        </View>

        <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
          <GlassCard style={{ flex: 1 }} padding={14}>
            <MaterialCommunityIcons name="target" size={18} color={colors.cyan2} />
            <H2 style={{ marginTop: 10 }}>{totals.total}</H2>
            <P>Total</P>
          </GlassCard>
          <GlassCard style={{ flex: 1 }} padding={14}>
            <MaterialCommunityIcons name="fire" size={18} color={colors.orange} />
            <H2 style={{ marginTop: 10 }}>{totals.active}</H2>
            <P>Active</P>
          </GlassCard>
          <GlassCard style={{ flex: 1 }} padding={14}>
            <MaterialCommunityIcons name="trophy" size={18} color={colors.yellow} />
            <H2 style={{ marginTop: 10 }}>{totals.won}</H2>
            <P>Won</P>
          </GlassCard>
        </View>

        <Label style={{ marginTop: 16, marginBottom: 8 }}>ACTIVE CHALLENGES</Label>
        <View style={{ gap: 10 }}>
          {data.challenges.map((c) => {
            const spent = challengeSpent(data.expenses, c);
            const remaining = c.spendingLimit - spent;
            const ratio = c.spendingLimit > 0 ? spent / c.spendingLimit : 0;
            const pct = Math.max(0, Math.min(100, Math.round(ratio * 100)));
            const over = remaining < 0;
            return (
              <GlassCard key={c.id} padding={12}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <H2 style={{ fontSize: 14 }}>{c.title}</H2>
                    <Text style={{ color: colors.text3, fontWeight: '800', fontSize: 11, marginTop: 2 }}>
                      {c.category} • {c.period} • ends {c.endISO}
                    </Text>
                  </View>
                  <Pressable onPress={() => deleteChallenge(c.id)} hitSlop={10}>
                    <MaterialCommunityIcons name="trash-can-outline" size={18} color="rgba(233,238,243,0.55)" />
                  </Pressable>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                  <Text style={{ color: colors.text3, fontWeight: '800', fontSize: 11 }}>{formatPeso(spent)} spent</Text>
                  <Text style={{ color: over ? colors.red : colors.green, fontWeight: '900', fontSize: 11 }}>
                    {over ? `${formatPeso(Math.abs(remaining))} over limit!` : `${formatPeso(remaining)} remaining`}
                  </Text>
                </View>

                <View
                  style={{
                    height: 6,
                    borderRadius: 999,
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    marginTop: 10,
                    overflow: 'hidden',
                  }}
                >
                  <View style={{ width: `${Math.min(100, pct)}%`, height: 6, backgroundColor: over ? colors.red : colors.cyan2 }} />
                </View>

                <Text style={{ color: colors.cyan2, fontWeight: '900', fontSize: 11, marginTop: 10 }}>
                  {challengeIsActive(c, now) ? `In Progress • ends ${c.endISO}` : `Ended • ended ${c.endISO}`}
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

