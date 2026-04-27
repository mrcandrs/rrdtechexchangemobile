import React, { useState } from 'react';
import { Image, Pressable, Switch, Text, View } from 'react-native';
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
  const [rememberMe, setRememberMe] = useState(true);

  return (
    <AuthShell withCard={false}>
      <View style={{ alignItems: 'center', marginBottom: 22 }}>
        <Image
          source={require('../../../assets/login-logo.png')}
          resizeMode="contain"
          style={{ width: 118, height: 118, borderRadius: 59, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}
        />
        <H1 style={{ marginTop: 14, fontSize: 24, letterSpacing: 0.2 }}>EXPENSE TRACKER</H1>
      </View>

      <View
        style={{
          gap: 12,
          borderRadius: 18,
          borderWidth: 1,
          borderColor: 'rgba(18,214,230,0.24)',
          backgroundColor: 'rgba(10,14,18,0.56)',
          padding: 16,
        }}
      >
        <View>
          <FieldLabel>Email</FieldLabel>
          <TextField value={email} onChangeText={setEmail} placeholder="you@example.com" accent />
        </View>

        <View>
          <FieldLabel>Password</FieldLabel>
          <PasswordField value={password} onChangeText={setPassword} placeholder="••••••••" accent />
        </View>

        {error ? <Text style={{ color: colors.red, fontFamily: fontFamily.extrabold, fontSize: 12 }}>{error}</Text> : null}

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
          <Text style={{ color: colors.text2, fontFamily: fontFamily.medium, fontSize: 13 }}>Remember Me</Text>
          <Switch
            value={rememberMe}
            onValueChange={setRememberMe}
            trackColor={{ false: 'rgba(255,255,255,0.2)', true: 'rgba(18,214,230,0.4)' }}
            thumbColor={rememberMe ? '#ffffff' : '#d4d7dc'}
          />
        </View>

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

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 6 }}>
          <Pressable onPress={() => setForgotOpen(true)}>
            <Text style={{ color: 'rgba(233,238,243,0.72)', fontFamily: fontFamily.bold, fontSize: 13 }}>Forgot password?</Text>
          </Pressable>
          <Text style={{ color: 'rgba(233,238,243,0.3)', marginHorizontal: 14 }}>|</Text>
          <Pressable onPress={onGoRegister}>
            <Text style={{ color: colors.cyan2, fontFamily: fontFamily.black, fontSize: 13 }}>Create an account</Text>
          </Pressable>
        </View>
      </View>

      <ForgotPasswordModal visible={forgotOpen} onClose={() => setForgotOpen(false)} />
    </AuthShell>
  );
}

