import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { PrimaryButton } from '../components/Button';
import { FieldLabel, SelectField, TextField } from '../components/Inputs';
import { ModalShell } from '../components/ModalShell';
import { useData } from '../data/DataContext';
import type { ExpenseCategory } from '../data/types';
import { expenseCategories } from '../constants/categories';
import { useFeedback } from '../feedback/FeedbackContext';

export function NewBudgetModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { addBudget } = useData();
  const { showMessage } = useFeedback();
  const [category, setCategory] = useState<ExpenseCategory | null>(null);
  const [limit, setLimit] = useState('');

  const canSubmit = useMemo(() => {
    const n = Number(limit);
    return !!category && Number.isFinite(n) && n > 0;
  }, [category, limit]);

  return (
    <ModalShell visible={visible} title="New Budget" onClose={onClose}>
      <View style={{ gap: 12 }}>
        <View>
          <FieldLabel>CATEGORY</FieldLabel>
          <SelectField
            value={category}
            placeholder="Select category"
            options={expenseCategories.map((c) => ({ value: c, label: c }))}
            onSelect={setCategory}
          />
        </View>

        <View>
          <FieldLabel>MONTHLY LIMIT</FieldLabel>
          <TextField value={limit} onChangeText={setLimit} keyboardType="numeric" placeholder="0.00" />
        </View>

        <PrimaryButton
          title="Create Budget"
          disabled={!canSubmit}
          onPress={async () => {
            try {
              await addBudget({ category: category!, monthlyLimit: Number(limit) });
              showMessage('Budget created.', 'success');
              setCategory(null);
              setLimit('');
              onClose();
            } catch (e) {
              const msg = e instanceof Error ? e.message : 'Unable to create budget.';
              showMessage(msg, 'error');
            }
          }}
        />
      </View>
    </ModalShell>
  );
}

