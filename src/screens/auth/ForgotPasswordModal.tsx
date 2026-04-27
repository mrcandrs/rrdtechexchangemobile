import React, { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { ModalShell } from '../../components/ModalShell';
import { FieldLabel, TextField } from '../../components/Inputs';
import { PrimaryButton } from '../../components/Button';
import { colors } from '../../theme';
import { useAuth } from '../../auth/AuthContext';

export function ForgotPasswordModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => !!email.trim() && email.includes('@'), [email]);

  return (
    <ModalShell
      visible={visible}
      title="Reset password"
      onClose={() => {
        setLoading(false);
        setStatus(null);
        onClose();
      }}
      width={380}
    >
      <View style={{ gap: 12 }}>
        <Text style={{ color: colors.text2, fontSize: 12 }}>
          Enter the email you used to register. We’ll send a password reset link.
        </Text>

        <View>
          <FieldLabel>EMAIL</FieldLabel>
          <TextField value={email} onChangeText={setEmail} placeholder="you@example.com" />
        </View>

        {status ? (
          <Text style={{ color: status.type === 'error' ? colors.red : colors.green, fontWeight: '800', fontSize: 12 }}>
            {status.message}
          </Text>
        ) : null}

        <PrimaryButton
          title={loading ? 'Sending…' : 'Send reset link'}
          disabled={loading || !canSubmit}
          onPress={async () => {
            setLoading(true);
            setStatus(null);
            const res = await resetPassword(email.trim());
            setLoading(false);
            if (!res.ok) {
              setStatus({ type: 'error', message: res.message });
              return;
            }
            setStatus({
              type: 'success',
              message: 'Reset email sent. Check your inbox (and spam folder).',
            });
          }}
        />
      </View>
    </ModalShell>
  );
}

