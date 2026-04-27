import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useData } from '../data/DataContext';
import type { ExpenseCategory } from '../data/types';
import { colors, fontFamily } from '../theme';
import { GlassCard } from '../components/Glass';
import { H1, H2, Label } from '../components/Text';
import { formatPeso } from '../utils/money';
import { expenseCategories } from '../constants/categories';
import { CategoryIcon } from '../icons/category';
import { useAuth } from '../auth/AuthContext';
import { useFeedback } from '../feedback/FeedbackContext';

type FilterCat = 'All' | ExpenseCategory;

export function HistoryScreen({
  onDeleteExpense,
}: {
  onDeleteExpense?: (id: string) => void;
}) {
  const { data, deleteExpense } = useData();
  const { canModifyAll } = useAuth();
  const { showMessage } = useFeedback();
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<FilterCat>('All');
  const [catOpen, setCatOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.expenses.filter((e) => {
      if (cat !== 'All' && e.category !== cat) return false;
      if (!q) return true;
      return (
        e.title.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.paymentMethod.toLowerCase().includes(q)
      );
    });
  }, [cat, data.expenses, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const e of filtered) {
      const key = e.occurredAtISO;
      const arr = map.get(key) ?? [];
      arr.push(e);
      map.set(key, arr);
    }
    const keys = Array.from(map.keys()).sort((a, b) => (a < b ? 1 : -1));
    return keys.map((k) => ({ day: k, items: map.get(k)! }));
  }, [filtered]);

  const catOptions: FilterCat[] = ['All', ...expenseCategories];

  return (
    <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 140 }}>
      <H1>History</H1>

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 14, alignItems: 'center' }}>
        <View
          style={{
            flex: 1,
            height: 40,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: 'rgba(255,255,255,0.03)',
            paddingHorizontal: 12,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <MaterialCommunityIcons name="magnify" size={16} color="rgba(233,238,243,0.5)" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search expenses..."
            placeholderTextColor="rgba(233,238,243,0.28)"
            style={{ color: colors.text, fontFamily: fontFamily.bold, flex: 1 }}
          />
        </View>

        <Pressable
          onPress={() => setCatOpen((v) => !v)}
          style={({ pressed }) => ({
            height: 40,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: pressed ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
            paddingHorizontal: 12,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          })}
        >
          <MaterialCommunityIcons name="filter-variant" size={16} color="rgba(233,238,243,0.6)" />
          <Text style={{ color: colors.text, fontFamily: fontFamily.extrabold, fontSize: 12 }}>{cat}</Text>
          <MaterialCommunityIcons name="chevron-down" size={16} color="rgba(233,238,243,0.6)" />
        </Pressable>
      </View>

      {catOpen ? (
        <GlassCard style={{ marginTop: 10 }} padding={10}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {catOptions.map((c) => (
              <Pressable
                key={c}
                onPress={() => {
                  setCat(c);
                  setCatOpen(false);
                }}
                style={({ pressed }) => ({
                  paddingVertical: 8,
                  paddingHorizontal: 10,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: c === cat ? 'rgba(18,214,230,0.35)' : colors.border,
                  backgroundColor:
                    c === cat ? 'rgba(18,214,230,0.12)' : pressed ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
                })}
              >
                <Text style={{ color: colors.text, fontFamily: fontFamily.extrabold, fontSize: 12 }}>{c}</Text>
              </Pressable>
            ))}
          </View>
        </GlassCard>
      ) : null}

      <View style={{ marginTop: 16, gap: 12 }}>
        {grouped.map((g) => (
          <View key={g.day}>
            <Label style={{ marginBottom: 8 }}>{g.day.toUpperCase()}</Label>
            <View style={{ gap: 10 }}>
              {g.items.map((e) => (
                <GlassCard key={e.id} padding={12}>
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
                        <CategoryIcon category={e.category} size={18} color="rgba(233,238,243,0.75)" />
                      </View>
                      <View>
                        <H2 style={{ fontSize: 14 }}>{e.title}</H2>
                        <Text style={{ color: colors.text3, fontFamily: fontFamily.extrabold, fontSize: 11 }}>
                          {e.category} • {e.paymentMethod}
                        </Text>
                        <Text style={{ color: 'rgba(233,238,243,0.35)', fontFamily: fontFamily.extrabold, fontSize: 10, marginTop: 2 }}>
                          Added by {e.createdByName || 'Unknown'}
                        </Text>
                      </View>
                    </View>
                    <View style={{ alignItems: 'flex-end', gap: 8 }}>
                      <Text style={{ color: colors.text, fontFamily: fontFamily.black }}>-{formatPeso(e.amount).slice(1)}</Text>
                      {canModifyAll ? (
                        <Pressable
                          onPress={() => {
                            Alert.alert('Delete expense?', `Are you sure you want to delete "${e.title}"?`, [
                              { text: 'Cancel', style: 'cancel' },
                              {
                                text: 'Delete',
                                style: 'destructive',
                                onPress: async () => {
                                  try {
                                    await deleteExpense(e.id);
                                    onDeleteExpense?.(e.id);
                                    showMessage('Expense deleted.', 'success');
                                  } catch (e2) {
                                    const msg = e2 instanceof Error ? e2.message : 'Unable to delete expense.';
                                    showMessage(msg, 'error');
                                  }
                                },
                              },
                            ]);
                          }}
                          hitSlop={10}
                          style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}
                        >
                          <MaterialCommunityIcons name="trash-can-outline" size={18} color="rgba(233,238,243,0.55)" />
                        </Pressable>
                      ) : null}
                    </View>
                  </View>
                </GlassCard>
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

