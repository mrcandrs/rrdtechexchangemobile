import type { ChallengeCategory, ExpenseCategory, PaymentMethod, Period } from '../data/types';

export const expenseCategories: ExpenseCategory[] = [
  'Food',
  'Transport',
  'Utilities',
  'Entertainment',
  'Shopping',
  'Travel',
  'Other',
];

export const challengeCategories: ChallengeCategory[] = ['All Spending', ...expenseCategories];

export const paymentMethods: PaymentMethod[] = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Digital Wallet'];

export const periods: Period[] = ['Weekly', 'Monthly'];

