import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useData } from '../data/DataContext';
import { colors, fontFamily } from '../theme';
import { GlassCard } from '../components/Glass';
import { H1, H2, Label, P } from '../components/Text';
import { formatPeso } from '../utils/money';
import { budgetSpentThisMonth, sumThisMonth, totalBudgetLimit } from '../constants/stats';
import { CategoryIcon } from '../icons/category';
import { NewBudgetModal } from '../modals/NewBudgetModal';
import type { Budget } from '../data/types';
import { ModalShell } from '../components/ModalShell';
import { FieldLabel, TextField } from '../components/Inputs';
import { PrimaryButton } from '../components/Button';
import { useAuth } from '../auth/AuthContext';
import { useFeedback } from '../feedback/FeedbackContext';

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

export function BudgetScreen() {
  const { data, updateBudget, deleteBudget } = useData();
  const { canModifyAll } = useAuth();
  const { showMessage } = useFeedback();
  const now = new Date();

  const [addOpen, setAddOpen] = useState(false);
  const [edit, setEdit] = useState<Budget | null>(null);

  const totalSpent = useMemo(() => sumThisMonth(data.expenses, now), [data.expenses]);
  const totalLimit = useMemo(() => totalBudgetLimit(data.budgets), [data.budgets]);

  return (
    <>
      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 140 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <H1>Budget</H1>
            <P style={{ marginTop: 2 }}>{new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(now)}</P>
          </View>
          <Pressable
            onPress={() => {
              if (!canModifyAll) {
                showMessage('Only the main admin can manage budgets.', 'error');
                return;
              }
              setAddOpen(true);
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
            <Text style={{ color: colors.cyan2, fontFamily: fontFamily.black, fontSize: 12 }}>Add</Text>
          </Pressable>
        </View>

        <GlassCard style={{ marginTop: 16 }} padding={14}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <View>
              <Label>Total Spent</Label>
              <H2 style={{ marginTop: 4, fontSize: 26 }}>{formatPeso(totalSpent)}</H2>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Label>Budget</Label>
              <Text style={{ color: colors.text3, fontFamily: fontFamily.black, fontSize: 14, marginTop: 6 }}>
                {formatPeso(totalLimit)}
              </Text>
            </View>
          </View>

          <View
            style={{
              height: 10,
              borderRadius: 999,
              backgroundColor: 'rgba(255,255,255,0.06)',
              marginTop: 12,
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                width: `${Math.min(100, (totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0))}%`,
                height: 10,
                backgroundColor: totalLimit > 0 && totalSpent > totalLimit ? colors.red : 'rgba(18,214,230,0.9)',
              }}
            />
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 }}>
            <Text style={{ color: colors.text3, fontFamily: fontFamily.extrabold, fontSize: 11 }}>
              {totalLimit > 0 ? `${Math.round((totalSpent / totalLimit) * 100)}% used` : 'No budgets yet'}
            </Text>
            {totalLimit > 0 && totalSpent > totalLimit ? (
              <Text style={{ color: colors.red, fontFamily: fontFamily.black, fontSize: 11 }}>△ Over budget!</Text>
            ) : null}
          </View>
        </GlassCard>

        <View style={{ marginTop: 14, gap: 10 }}>
          {data.budgets
            .slice()
            .sort((a, b) => a.category.localeCompare(b.category))
            .map((b) => {
              const spent = budgetSpentThisMonth(data.expenses, b.category, now);
              const ratio = b.monthlyLimit > 0 ? spent / b.monthlyLimit : 0;
              const pct = Math.round(clamp01(ratio) * 100);
              const exceeded = spent > b.monthlyLimit;
              const barColor = exceeded ? colors.red : b.category === 'Food' ? colors.orange : colors.cyan2;

              return (
                <GlassCard key={b.id} padding={12}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <View
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 12,
                          backgroundColor: 'rgba(255,255,255,0.04)',
                          borderWidth: 1,
                          borderColor: colors.border,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <CategoryIcon category={b.category} size={18} color="rgba(233,238,243,0.75)" />
                      </View>
                      <View>
                        <H2 style={{ fontSize: 14 }}>{b.category}</H2>
                        <Text style={{ color: colors.text3, fontFamily: fontFamily.extrabold, fontSize: 11 }}>
                          {formatPeso(spent)} / {formatPeso(b.monthlyLimit)}
                        </Text>
                      </View>
                    </View>

                    {canModifyAll ? (
                      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                        <Pressable onPress={() => setEdit(b)} hitSlop={10}>
                          <MaterialCommunityIcons name="pencil-outline" size={18} color="rgba(233,238,243,0.55)" />
                        </Pressable>
                        <Pressable
                          onPress={() => {
                            Alert.alert('Delete budget?', `Are you sure you want to delete the ${b.category} budget?`, [
                              { text: 'Cancel', style: 'cancel' },
                              {
                                text: 'Delete',
                                style: 'destructive',
                                onPress: async () => {
                                  try {
                                    await deleteBudget(b.id);
                                    showMessage('Budget deleted.', 'success');
                                  } catch (e) {
                                    const msg = e instanceof Error ? e.message : 'Unable to delete budget.';
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
                      </View>
                    ) : null}
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
                    <View style={{ width: `${pct}%`, height: 6, backgroundColor: barColor }} />
                  </View>

                  {exceeded ? (
                    <Text style={{ color: colors.red, fontFamily: fontFamily.black, fontSize: 11, marginTop: 8 }}>
                      ▲ Exceeded by {formatPeso(spent - b.monthlyLimit)}
                    </Text>
                  ) : null}
                </GlassCard>
              );
            })}
        </View>
      </ScrollView>

      <NewBudgetModal visible={addOpen} onClose={() => setAddOpen(false)} />

      {/* Lightweight edit: reuse NewBudgetModal-like UI by pre-filling via a tiny inline modal */}
      {edit ? (
        <NewBudgetEditModal
          budget={edit}
          onClose={() => setEdit(null)}
          onSave={async (monthlyLimit) => {
            try {
              await updateBudget({ ...edit, monthlyLimit });
              showMessage('Budget updated.', 'success');
              setEdit(null);
            } catch (e) {
              const msg = e instanceof Error ? e.message : 'Unable to update budget.';
              showMessage(msg, 'error');
            }
          }}
        />
      ) : null}
    </>
  );
}

function NewBudgetEditModal({
  budget,
  onClose,
  onSave,
}: {
  budget: Budget;
  onClose: () => void;
  onSave: (limit: number) => Promise<void>;
}) {
  const [limit, setLimit] = useState(String(budget.monthlyLimit.toFixed(2)));
  const canSubmit = Number.isFinite(Number(limit)) && Number(limit) > 0;

  return (
    <ModalShell visible title={`Edit ${budget.category}`} onClose={onClose}>
      <View style={{ gap: 12 }}>
        <View>
          <FieldLabel>MONTHLY LIMIT</FieldLabel>
          <TextField value={limit} onChangeText={setLimit} keyboardType="numeric" placeholder="0.00" />
        </View>
        <PrimaryButton title="Save" disabled={!canSubmit} onPress={() => onSave(Number(limit))} />
      </View>
    </ModalShell>
  );
}

