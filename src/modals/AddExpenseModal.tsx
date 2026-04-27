import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { PrimaryButton } from '../components/Button';
import { DateField, FieldLabel, SelectField, TextField } from '../components/Inputs';
import { ModalShell } from '../components/ModalShell';
import { useData } from '../data/DataContext';
import type { ExpenseCategory, PaymentMethod } from '../data/types';
import { expenseCategories, paymentMethods } from '../constants/categories';
import { toISODate } from '../utils/dates';
import { useFeedback } from '../feedback/FeedbackContext';

export function AddExpenseModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { addExpense } = useData();
  const { showMessage } = useFeedback();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [dateISO, setDateISO] = useState(toISODate(new Date()));

  const canSubmit = useMemo(() => {
    const amt = Number(amount);
    return title.trim().length > 0 && Number.isFinite(amt) && amt > 0 && !!category && !!paymentMethod;
  }, [amount, category, paymentMethod, title]);

  return (
    <ModalShell
      visible={visible}
      title="New Expense"
      onClose={() => {
        onClose();
      }}
    >
      <View style={{ gap: 12 }}>
        <View>
          <FieldLabel>Title</FieldLabel>
          <TextField value={title} onChangeText={setTitle} placeholder='e.g. "Grocery Run"' />
        </View>

        <View>
          <FieldLabel>Amount (₱)</FieldLabel>
          <TextField value={amount} onChangeText={setAmount} keyboardType="numeric" placeholder="0.00" />
        </View>

        <View>
          <FieldLabel>Category</FieldLabel>
          <SelectField
            value={category}
            placeholder="Select category"
            options={expenseCategories.map((c) => ({ value: c, label: c }))}
            onSelect={setCategory}
          />
        </View>

        <View>
          <FieldLabel>Payment Method</FieldLabel>
          <SelectField
            value={paymentMethod}
            placeholder="Select method"
            options={paymentMethods.map((m) => ({ value: m, label: m }))}
            onSelect={setPaymentMethod}
          />
        </View>

        <View>
          <FieldLabel>Date</FieldLabel>
          <DateField iso={dateISO} onChangeISO={setDateISO} />
        </View>

        <PrimaryButton
          title="Add Expense"
          disabled={!canSubmit}
          onPress={async () => {
            try {
              await addExpense({
                title: title.trim(),
                amount: Number(amount),
                category: category!,
                paymentMethod: paymentMethod!,
                occurredAtISO: dateISO,
              });
              showMessage('Expense added successfully.', 'success');
              setTitle('');
              setAmount('');
              setCategory(null);
              setPaymentMethod(null);
              setDateISO(toISODate(new Date()));
              onClose();
            } catch (e) {
              const msg = e instanceof Error ? e.message : 'Unable to add expense.';
              showMessage(msg, 'error');
            }
          }}
        />
      </View>
    </ModalShell>
  );
}

