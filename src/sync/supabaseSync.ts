import { supabase } from '../auth/supabase';
import type { AppData } from '../data/types';

type RemoteRow = {
  user_id: string;
  id: string;
  payload: unknown;
  updated_at: number;
};

function nowMs() {
  return Date.now();
}

async function deleteMissingRows(table: 'expenses' | 'budgets' | 'challenges', userId: string, localIds: string[]): Promise<void> {
  const existing = await supabase.from(table).select('id').eq('user_id', userId);
  if (existing.error) throw existing.error;
  const remoteIds = new Set<string>((existing.data ?? []).map((row: { id: string }) => row.id));
  const localIdSet = new Set(localIds);
  const idsToDelete: string[] = [];
  for (const id of remoteIds) {
    if (!localIdSet.has(id)) idsToDelete.push(id);
  }
  if (idsToDelete.length === 0) return;
  const del = await supabase.from(table).delete().eq('user_id', userId).in('id', idsToDelete);
  if (del.error) throw del.error;
}

export async function pushAllToSupabase(userId: string, data: AppData): Promise<void> {
  const updated_at = nowMs();

  const expenses = data.expenses.map((e) => ({
    user_id: userId,
    id: e.id,
    payload: e,
    updated_at,
  }));
  const budgets = data.budgets.map((b) => ({
    user_id: userId,
    id: b.id,
    payload: b,
    updated_at,
  }));
  const challenges = data.challenges.map((c) => ({
    user_id: userId,
    id: c.id,
    payload: c,
    updated_at,
  }));

  const a = await supabase.from('expenses').upsert(expenses, { onConflict: 'user_id,id' });
  if (a.error) throw a.error;
  await deleteMissingRows(
    'expenses',
    userId,
    expenses.map((x) => x.id),
  );
  const b = await supabase.from('budgets').upsert(budgets, { onConflict: 'user_id,id' });
  if (b.error) throw b.error;
  await deleteMissingRows(
    'budgets',
    userId,
    budgets.map((x) => x.id),
  );
  const c = await supabase.from('challenges').upsert(challenges, { onConflict: 'user_id,id' });
  if (c.error) throw c.error;
  await deleteMissingRows(
    'challenges',
    userId,
    challenges.map((x) => x.id),
  );
}

export async function pullAllFromSupabase(userId: string): Promise<AppData> {
  const exp = await supabase.from('expenses').select('*').eq('user_id', userId);
  if (exp.error) throw exp.error;
  const bud = await supabase.from('budgets').select('*').eq('user_id', userId);
  if (bud.error) throw bud.error;
  const chl = await supabase.from('challenges').select('*').eq('user_id', userId);
  if (chl.error) throw chl.error;

  const expenses = (exp.data as RemoteRow[]).map((r) => r.payload) as AppData['expenses'];
  const budgets = (bud.data as RemoteRow[]).map((r) => r.payload) as AppData['budgets'];
  const challenges = (chl.data as RemoteRow[]).map((r) => r.payload) as AppData['challenges'];

  // Sort newest first for consistent UI
  expenses.sort((a, b2) => b2.createdAt - a.createdAt);
  budgets.sort((a, b2) => b2.createdAt - a.createdAt);
  challenges.sort((a, b2) => b2.createdAt - a.createdAt);

  return { expenses, budgets, challenges };
}

