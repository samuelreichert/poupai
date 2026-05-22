import { Href, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useColorScheme } from '@/hooks/use-color-scheme';

function getAuthErrorMessage(message: string): string {
  if (message.includes('Invalid login credentials')) {
    return 'E-mail ou senha inválidos.';
  }
  if (message.includes('Password should be at least')) {
    return 'A senha precisa ter pelo menos 6 caracteres.';
  }
  return 'Não foi possível concluir. Tente novamente.';
}

export default function SignInScreen() {
  const router = useRouter();
  const { signIn, signUp } = useAuth();
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(mode: 'sign-in' | 'sign-up') {
    setLoading(true);
    setError(null);

    const action = mode === 'sign-in' ? signIn : signUp;
    const { error: authError } = await action(email.trim(), password);

    setLoading(false);

    if (authError) {
      setError(getAuthErrorMessage(authError.message));
      return;
    }

    router.replace('/(onboarding)/macros' as Href);
  }

  const inputBackgroundColor = colors.surface_container_low;
  const primaryButtonBackgroundColor = colors.primary;
  const primaryButtonTextColor = colors.on_primary;
  const secondaryButtonBackgroundColor = colors.surface_container_high;
  const secondaryButtonTextColor = colors.on_surface;
  const disabledOpacity = loading ? 0.7 : 1;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
      style={[styles.container, { backgroundColor: colors.surface }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.on_surface }]}>Entre na sua carteira</Text>
        <Text style={[styles.subtitle, { color: colors.on_surface_variant }]}>
          Acesse sua alocação, saldos e metas em um só lugar.
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.on_surface_variant }]}>E-mail</Text>
          <TextInput
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="voce@email.com"
            placeholderTextColor={colors.on_surface_variant}
            style={[styles.input, { backgroundColor: inputBackgroundColor, color: colors.on_surface }]}
            value={email}
          />
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.on_surface_variant }]}>Senha</Text>
          <TextInput
            autoCapitalize="none"
            onChangeText={setPassword}
            placeholder="Sua senha"
            placeholderTextColor={colors.on_surface_variant}
            secureTextEntry
            style={[styles.input, { backgroundColor: inputBackgroundColor, color: colors.on_surface }]}
            value={password}
          />
        </View>

        {error && <Text style={[styles.error, { color: colors.negative }]}>{error}</Text>}

        <Pressable
          accessibilityRole="button"
          disabled={loading}
          onPress={() => handleSubmit('sign-in')}
          style={[
            styles.primaryButton,
            { backgroundColor: primaryButtonBackgroundColor, opacity: disabledOpacity },
          ]}
        >
          {loading ? (
            <ActivityIndicator color={primaryButtonTextColor} />
          ) : (
            <Text style={[styles.primaryButtonText, { color: primaryButtonTextColor }]}>Entrar</Text>
          )}
        </Pressable>

        <Pressable
          accessibilityRole="button"
          disabled={loading}
          onPress={() => handleSubmit('sign-up')}
          style={[styles.secondaryButton, { backgroundColor: secondaryButtonBackgroundColor }]}
        >
          <Text style={[styles.secondaryButtonText, { color: secondaryButtonTextColor }]}>
            Criar conta
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing[4],
    gap: Spacing[8],
  },
  header: {
    gap: Spacing[3],
  },
  title: {
    ...Typography.headline_lg,
  },
  subtitle: {
    ...Typography.body_md,
  },
  form: {
    gap: Spacing[4],
  },
  field: {
    gap: Spacing[3],
  },
  label: {
    ...Typography.label_md,
  },
  input: {
    ...Typography.body_md,
    borderRadius: Radius.full,
    minHeight: 52,
    paddingHorizontal: Spacing[4],
  },
  error: {
    ...Typography.body_md,
  },
  primaryButton: {
    minHeight: 52,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing[4],
  },
  primaryButtonText: {
    ...Typography.body_md,
    fontFamily: 'Inter_500Medium',
  },
  secondaryButton: {
    minHeight: 52,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing[4],
  },
  secondaryButtonText: {
    ...Typography.body_md,
    fontFamily: 'Inter_500Medium',
  },
});
