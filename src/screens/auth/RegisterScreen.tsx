import React, { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { AuthShell } from './AuthShell';
import { H1, P } from '../../components/Text';
import { FieldLabel, PasswordField, TextField } from '../../components/Inputs';
import { PrimaryButton } from '../../components/Button';
import { colors, fontFamily } from '../../theme';
import { useAuth } from '../../auth/AuthContext';

export function RegisterScreen({ onGoLogin }: { onGoLogin: () => void }) {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    return name.trim().length >= 2 && email.trim() && password.length >= 6 && password === confirm;
  }, [confirm, email, name, password]);

  return (
    <AuthShell withCard={false}>
      <View
        style={{
          borderRadius: 18,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.08)',
          backgroundColor: 'rgba(20,24,32,0.72)',
          padding: 18,
        }}
      >
      <H1 style={{ fontSize: 22 }}>Create account</H1>
      <P style={{ marginTop: 6 }}>Register to sync your data</P>

      <View style={{ marginTop: 16, gap: 12 }}>
        <View>
          <FieldLabel>Name</FieldLabel>
          <TextField value={name} onChangeText={setName} placeholder="Name" />
        </View>

        <View>
          <FieldLabel>Email</FieldLabel>
          <TextField value={email} onChangeText={setEmail} placeholder="Email" />
        </View>

        <View>
          <FieldLabel>Password</FieldLabel>
          <PasswordField value={password} onChangeText={setPassword} placeholder="Password" />
        </View>

        <View>
          <FieldLabel>Confirm Password</FieldLabel>
          <PasswordField value={confirm} onChangeText={setConfirm} placeholder="Repeat password" />
        </View>

        {password && password.length < 6 ? (
          <Text style={{ color: colors.orange, fontFamily: fontFamily.extrabold, fontSize: 12 }}>
            Password should be at least 6 characters.
          </Text>
        ) : null}
        {confirm && confirm !== password ? (
          <Text style={{ color: colors.orange, fontFamily: fontFamily.extrabold, fontSize: 12 }}>Passwords do not match.</Text>
        ) : null}
        {error ? <Text style={{ color: colors.red, fontFamily: fontFamily.extrabold, fontSize: 12 }}>{error}</Text> : null}

        <PrimaryButton
          title={loading ? 'Creating…' : 'Register'}
          disabled={loading || !canSubmit}
          onPress={async () => {
            setLoading(true);
            setError(null);
            const res = await signUp(email.trim(), password, name.trim());
            setLoading(false);
            if (!res.ok) {
              setError(res.message);
              return;
            }
            // Many projects require email confirmation; keep user informed.
            setError('Account created. If email confirmation is enabled, check your inbox before logging in.');
          }}
        />

        <Pressable onPress={onGoLogin} style={{ alignSelf: 'center', marginTop: 8 }}>
          <Text style={{ color: colors.cyan2, fontFamily: fontFamily.black }}>Back to login</Text>
        </Pressable>
      </View>
      </View>
    </AuthShell>
  );
}

