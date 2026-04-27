import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AppData, Budget, Expense, SavingsChallenge } from './types';
import { seedData } from './seed';

const STORAGE_KEY = '@rrd_expense_tracker_v1';

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function id(prefix: string): string {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

export async function loadData(): Promise<AppData> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  const parsed = safeParse<AppData>(raw);
  if (parsed && parsed.expenses && parsed.budgets && parsed.challenges) return parsed;
  const seeded = seedData(new Date());
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
}

export async function saveData(data: AppData): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function createExpense(input: Omit<Expense, 'id' | 'createdAt'>): Expense {
  return { ...input, id: id('exp'), createdAt: Date.now() };
}

export function createBudget(input: Omit<Budget, 'id' | 'createdAt'>): Budget {
  return { ...input, id: id('bud'), createdAt: Date.now() };
}

export function createChallenge(input: Omit<SavingsChallenge, 'id' | 'createdAt'>): SavingsChallenge {
  return { ...input, id: id('chl'), createdAt: Date.now() };
}

