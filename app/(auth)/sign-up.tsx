import { Href, useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useAuthFlow } from '@/hooks/use-auth-flow';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function SignUpScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const auth = useAuthFlow('sign-up');

  const inputBackgroundColor = colors.surface_container_low;
  const primaryButtonBackgroundColor = colors.primary;
  const primaryButtonTextColor = colors.on_primary;
  const secondaryButtonBackgroundColor = colors.surface_container_high;
  const secondaryButtonTextColor = colors.on_surface;
  const disabledOpacity = auth.loading ? 0.7 : 1;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
      style={[styles.container, { backgroundColor: colors.surface }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.on_surface }]}>Crie sua conta</Text>
        <Text style={[styles.subtitle, { color: colors.on_surface_variant }]}>
          Comece com e-mail e senha para salvar sua carteira com segurança.
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.on_surface_variant }]}>E-mail</Text>
          <TextInput
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            onChangeText={auth.setEmail}
            placeholder="voce@email.com"
            placeholderTextColor={colors.on_surface_variant}
            returnKeyType="next"
            style={[styles.input, { backgroundColor: inputBackgroundColor, color: colors.on_surface }]}
            value={auth.email}
          />
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.on_surface_variant }]}>Senha</Text>
          <TextInput
            autoCapitalize="none"
            autoComplete="new-password"
            onChangeText={auth.setPassword}
            placeholder="Mínimo de 6 caracteres"
            placeholderTextColor={colors.on_surface_variant}
            returnKeyType="next"
            secureTextEntry
            style={[styles.input, { backgroundColor: inputBackgroundColor, color: colors.on_surface }]}
            value={auth.password}
          />
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.on_surface_variant }]}>Confirmar senha</Text>
          <TextInput
            autoCapitalize="none"
            autoComplete="new-password"
            onChangeText={auth.setConfirmPassword}
            onSubmitEditing={auth.submit}
            placeholder="Repita sua senha"
            placeholderTextColor={colors.on_surface_variant}
            returnKeyType="go"
            secureTextEntry
            style={[styles.input, { backgroundColor: inputBackgroundColor, color: colors.on_surface }]}
            value={auth.confirmPassword}
          />
        </View>

        {auth.message && <Text style={[styles.message, { color: colors.negative }]}>{auth.message}</Text>}

        <Pressable
          accessibilityRole="button"
          disabled={auth.loading}
          onPress={auth.submit}
          style={[
            styles.primaryButton,
            { backgroundColor: primaryButtonBackgroundColor, opacity: disabledOpacity },
          ]}
        >
          {auth.loading ? (
            <ActivityIndicator color={primaryButtonTextColor} />
          ) : (
            <Text style={[styles.primaryButtonText, { color: primaryButtonTextColor }]}>Criar conta</Text>
          )}
        </Pressable>

        <Pressable
          accessibilityRole="button"
          disabled={auth.loading}
          onPress={() => router.replace('/(auth)/sign-in' as Href)}
          style={[styles.secondaryButton, { backgroundColor: secondaryButtonBackgroundColor }]}
        >
          <Text style={[styles.secondaryButtonText, { color: secondaryButtonTextColor }]}>
            Já tenho conta
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
  message: {
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
