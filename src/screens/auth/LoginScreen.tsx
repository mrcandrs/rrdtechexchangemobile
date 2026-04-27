import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { AuthShell } from './AuthShell';
import { H1, P } from '../../components/Text';
import { FieldLabel, PasswordField, TextField } from '../../components/Inputs';
import { PrimaryButton } from '../../components/Button';
import { colors, fontFamily } from '../../theme';
import { useAuth } from '../../auth/AuthContext';
import { ForgotPasswordModal } from './ForgotPasswordModal';

export function LoginScreen({ onGoRegister }: { onGoRegister: () => void }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

  return (
    <AuthShell>
      <H1 style={{ fontSize: 22 }}>Welcome back</H1>
      <P style={{ marginTop: 6 }}>Login to continue tracking your expenses.</P>

      <View style={{ marginTop: 16, gap: 12 }}>
        <View>
          <FieldLabel>EMAIL</FieldLabel>
          <TextField value={email} onChangeText={setEmail} placeholder="you@example.com" />
        </View>

        <View>
          <FieldLabel>PASSWORD</FieldLabel>
          <PasswordField value={password} onChangeText={setPassword} placeholder="••••••••" />
        </View>

        {error ? <Text style={{ color: colors.red, fontFamily: fontFamily.extrabold, fontSize: 12 }}>{error}</Text> : null}

        <PrimaryButton
          title={loading ? 'Logging in…' : 'Login'}
          disabled={loading || !email.trim() || !password}
          onPress={async () => {
            setLoading(true);
            setError(null);
            const res = await signIn(email.trim(), password);
            setLoading(false);
            if (!res.ok) setError(res.message);
          }}
        />

        <Pressable onPress={() => setForgotOpen(true)} style={{ alignSelf: 'center', marginTop: 6 }}>
          <Text style={{ color: 'rgba(233,238,243,0.65)', fontFamily: fontFamily.extrabold }}>Forgot password?</Text>
        </Pressable>

        <Pressable onPress={onGoRegister} style={{ alignSelf: 'center', marginTop: 8 }}>
          <Text style={{ color: colors.cyan2, fontFamily: fontFamily.black }}>Create an account</Text>
        </Pressable>
      </View>

      <ForgotPasswordModal visible={forgotOpen} onClose={() => setForgotOpen(false)} />
    </AuthShell>
  );
}

