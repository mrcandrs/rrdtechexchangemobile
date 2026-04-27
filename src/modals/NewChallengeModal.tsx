import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { PrimaryButton } from '../components/Button';
import { DateField, FieldLabel, SelectField, TextField } from '../components/Inputs';
import { ModalShell } from '../components/ModalShell';
import { useData } from '../data/DataContext';
import type { ChallengeCategory, Period } from '../data/types';
import { challengeCategories, periods } from '../constants/categories';
import { toISODate } from '../utils/dates';
import { useFeedback } from '../feedback/FeedbackContext';

export function NewChallengeModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { addChallenge } = useData();
  const { showMessage } = useFeedback();
  const [title, setTitle] = useState('');
  const [limit, setLimit] = useState('');
  const [category, setCategory] = useState<ChallengeCategory>('All Spending');
  const [period, setPeriod] = useState<Period>('Weekly');
  const [startISO, setStartISO] = useState(toISODate(new Date()));
  const [endISO, setEndISO] = useState(toISODate(new Date(Date.now() + 24 * 60 * 60 * 1000)));

  const canSubmit = useMemo(() => {
    const n = Number(limit);
    return title.trim().length > 0 && Number.isFinite(n) && n > 0;
  }, [limit, title]);

  return (
    <ModalShell visible={visible} title="New Savings Challenge" onClose={onClose} width={380}>
      <View style={{ gap: 12 }}>
        <View>
          <FieldLabel>CHALLENGE TITLE</FieldLabel>
          <TextField value={title} onChangeText={setTitle} placeholder='e.g. "No coffee shops this week"' />
        </View>

        <View>
          <FieldLabel>SPENDING LIMIT (₱)</FieldLabel>
          <TextField value={limit} onChangeText={setLimit} keyboardType="numeric" placeholder="0.00" />
        </View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <FieldLabel>CATEGORY</FieldLabel>
            <SelectField
              value={category}
              placeholder="All Spending"
              options={challengeCategories.map((c) => ({ value: c, label: c }))}
              onSelect={setCategory}
            />
          </View>
          <View style={{ flex: 1 }}>
            <FieldLabel>PERIOD</FieldLabel>
            <SelectField
              value={period}
              placeholder="Weekly"
              options={periods.map((p) => ({ value: p, label: p }))}
              onSelect={setPeriod}
            />
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <FieldLabel>START</FieldLabel>
            <DateField iso={startISO} onChangeISO={setStartISO} />
          </View>
          <View style={{ flex: 1 }}>
            <FieldLabel>END</FieldLabel>
            <DateField iso={endISO} onChangeISO={setEndISO} />
          </View>
        </View>

        <PrimaryButton
          title="Start Challenge"
          disabled={!canSubmit}
          onPress={async () => {
            try {
              await addChallenge({
                title: title.trim(),
                spendingLimit: Number(limit),
                category,
                period,
                startISO,
                endISO,
              });
              showMessage('Challenge created.', 'success');
              setTitle('');
              setLimit('');
              setCategory('All Spending');
              setPeriod('Weekly');
              setStartISO(toISODate(new Date()));
              setEndISO(toISODate(new Date(Date.now() + 24 * 60 * 60 * 1000)));
              onClose();
            } catch (e) {
              const msg = e instanceof Error ? e.message : 'Unable to create challenge.';
              showMessage(msg, 'error');
            }
          }}
        />
      </View>
    </ModalShell>
  );
}

