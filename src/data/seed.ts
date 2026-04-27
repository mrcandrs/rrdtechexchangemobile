import type { AppData, Budget, Expense, SavingsChallenge } from './types';
import { toISODate } from '../utils/dates';

function id(prefix: string): string {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

export function seedData(now = new Date()): AppData {
  const mkExpense = (e: Omit<Expense, 'id' | 'createdAt'>): Expense => ({
    id: id('exp'),
    createdAt: Date.now(),
    ...e,
  });
  const mkBudget = (b: Omit<Budget, 'id' | 'createdAt'>): Budget => ({
    id: id('bud'),
    createdAt: Date.now(),
    ...b,
  });
  const mkChallenge = (c: Omit<SavingsChallenge, 'id' | 'createdAt'>): SavingsChallenge => ({
    id: id('chl'),
    createdAt: Date.now(),
    ...c,
  });

  const d = (daysAgo: number) => {
    const x = new Date(now);
    x.setDate(x.getDate() - daysAgo);
    return toISODate(x);
  };

  const expenses: Expense[] = [
    mkExpense({ title: 'Team Lunch', category: 'Food', paymentMethod: 'Credit Card', amount: 47.5, occurredAtISO: d(1) }),
    mkExpense({
      title: 'Uber to Office',
      category: 'Transport',
      paymentMethod: 'Digital Wallet',
      amount: 18.75,
      occurredAtISO: d(1),
    }),
    mkExpense({ title: 'AWS Hosting', category: 'Utilities', paymentMethod: 'Credit Card', amount: 129.99, occurredAtISO: d(2) }),
    mkExpense({ title: 'Figma Pro', category: 'Other', paymentMethod: 'Credit Card', amount: 15, occurredAtISO: d(3) }),
    mkExpense({ title: 'Coffee Supplies', category: 'Food', paymentMethod: 'Cash', amount: 32, occurredAtISO: d(3) }),
    mkExpense({ title: 'Parking Fee', category: 'Transport', paymentMethod: 'Debit Card', amount: 12, occurredAtISO: d(5) }),
    mkExpense({
      title: 'Team Building Event',
      category: 'Entertainment',
      paymentMethod: 'Bank Transfer',
      amount: 250,
      occurredAtISO: d(6),
    }),
    mkExpense({ title: 'Office Supplies', category: 'Shopping', paymentMethod: 'Credit Card', amount: 89.5, occurredAtISO: d(7) }),
    mkExpense({ title: 'Internet Bill', category: 'Utilities', paymentMethod: 'Bank Transfer', amount: 79.99, occurredAtISO: d(8) }),
    mkExpense({ title: 'Online Course', category: 'Other', paymentMethod: 'Credit Card', amount: 49.99, occurredAtISO: d(9) }),
    mkExpense({ title: 'Grocery Run', category: 'Food', paymentMethod: 'Debit Card', amount: 65.3, occurredAtISO: d(10) }),
    mkExpense({ title: 'Flight to Conference', category: 'Travel', paymentMethod: 'Credit Card', amount: 385, occurredAtISO: d(11) }),
  ];

  const budgets: Budget[] = [
    mkBudget({ category: 'Food', monthlyLimit: 300 }),
    mkBudget({ category: 'Transport', monthlyLimit: 150 }),
    mkBudget({ category: 'Utilities', monthlyLimit: 250 }),
    mkBudget({ category: 'Entertainment', monthlyLimit: 200 }),
    mkBudget({ category: 'Shopping', monthlyLimit: 200 }),
  ];

  const start = toISODate(now);
  const tomorrow = (() => {
    const x = new Date(now);
    x.setDate(x.getDate() + 1);
    return toISODate(x);
  })();
  const endMonth = (() => {
    const x = new Date(now);
    x.setMonth(x.getMonth() + 1);
    return toISODate(x);
  })();

  const challenges: SavingsChallenge[] = [
    mkChallenge({
      title: 'Limit food spending this week',
      spendingLimit: 500,
      category: 'Food',
      period: 'Weekly',
      startISO: start,
      endISO: tomorrow,
    }),
    mkChallenge({
      title: 'Keep total spending under ₱2,000',
      spendingLimit: 2000,
      category: 'All Spending',
      period: 'Weekly',
      startISO: start,
      endISO: tomorrow,
    }),
    mkChallenge({
      title: 'Zero entertainment this month',
      spendingLimit: 100,
      category: 'Entertainment',
      period: 'Monthly',
      startISO: start,
      endISO: endMonth,
    }),
  ];

  return { expenses, budgets, challenges };
}

