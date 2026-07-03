import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function CheckEmailScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const scheme = useColorScheme();
  const colors = Colors[scheme];

  const emailLabel = Array.isArray(email) ? email[0] : email;
  const confirmationMessage = emailLabel
    ? `Enviamos um link de confirmação para ${emailLabel}. Depois de confirmar, volte para entrar na sua carteira.`
    : 'Enviamos um link de confirmação. Depois de confirmar, volte para entrar na sua carteira.';
  const primaryButtonBackgroundColor = colors.primary;
  const primaryButtonTextColor = colors.on_primary;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
      style={[styles.container, { backgroundColor: colors.surface }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.on_surface }]}>Confirme seu e-mail</Text>
        <Text style={[styles.subtitle, { color: colors.on_surface_variant }]}>
          {confirmationMessage}
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => router.replace('/(auth)/sign-in' as Href)}
        style={[styles.primaryButton, { backgroundColor: primaryButtonBackgroundColor }]}
      >
        <Text style={[styles.primaryButtonText, { color: primaryButtonTextColor }]}>
          Voltar para entrar
        </Text>
      </Pressable>
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
});
