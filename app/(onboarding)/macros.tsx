import { Href, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CurrencyInput } from '@/components/currency-input';
import { PercentInput } from '@/components/percent-input';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { saveMacroPlan } from '@/hooks/use-save-macro-plan';
import { formatPercentBR } from '@/lib/format';
import {
  DEFAULT_INVESTMENT_GOAL,
  getIdealPercentTotal,
  isCompleteIdealPercentTotal,
  MacroPlanInput,
  STARTER_MACRO_PLAN,
} from '@/lib/macro-plan';

function getPercentValidationLabel(total: number): string {
  if (isCompleteIdealPercentTotal(total)) {
    return 'Total: 100%';
  }

  if (total < 1) {
    return `Faltam ${formatPercentBR(1 - total)} para fechar 100%`;
  }

  return `Passei ${formatPercentBR(total - 1)} de 100%`;
}

export default function OnboardingMacrosScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const [investmentGoal, setInvestmentGoal] = useState(DEFAULT_INVESTMENT_GOAL);
  const [macros, setMacros] = useState<MacroPlanInput[]>(STARTER_MACRO_PLAN);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const idealPercentTotal = useMemo(() => getIdealPercentTotal(macros), [macros]);
  const canSave = isCompleteIdealPercentTotal(idealPercentTotal) && !saving;

  function updateMacro(index: number, patch: Partial<MacroPlanInput>) {
    setMacros((current) =>
      current.map((macro, currentIndex) =>
        currentIndex === index ? { ...macro, ...patch } : macro,
      ),
    );
  }

  async function handleSave() {
    setSaving(true);
    setError(null);

    try {
      await saveMacroPlan(investmentGoal, 'moderate', macros);
      router.replace('/(tabs)' as Href);
    } catch {
      setError('Não foi possível salvar sua carteira. Tente novamente.');
    } finally {
      setSaving(false);
    }
  }

  const validationColor = canSave ? colors.positive : colors.negative;
  const buttonBackgroundColor = canSave ? colors.primary : colors.surface_container_high;
  const buttonTextColor = canSave ? colors.on_primary : colors.on_surface_variant;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
      style={[styles.container, { backgroundColor: colors.surface }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.on_surface }]}>Configure sua carteira</Text>
        <Text style={[styles.subtitle, { color: colors.on_surface_variant }]}>
          Defina sua meta, suas classes de ativos e os saldos atuais.
        </Text>
      </View>

      <CurrencyInput label="Meta de investimento" value={investmentGoal} onChangeValue={setInvestmentGoal} />

      <View style={styles.rows}>
        {macros.map((macro, index) => (
          <View
            key={macro.kind}
            style={[styles.macroCard, { backgroundColor: colors.surface_container_lowest }]}
          >
            <Text style={[styles.macroName, { color: colors.on_surface }]}>{macro.name}</Text>
            <View style={styles.inputRow}>
              <PercentInput
                label="Porcentagem ideal"
                onChangeValue={(idealPercent) => updateMacro(index, { idealPercent })}
                style={styles.inputCell}
                value={macro.idealPercent}
              />
              <CurrencyInput
                label="Valor atual"
                onChangeValue={(currentValue) => updateMacro(index, { currentValue })}
                style={styles.inputCell}
                value={macro.currentValue}
              />
            </View>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={[styles.validation, { color: validationColor }]}>
          {getPercentValidationLabel(idealPercentTotal)}
        </Text>
        {error && <Text style={[styles.error, { color: colors.negative }]}>{error}</Text>}
        <Pressable
          accessibilityRole="button"
          disabled={!canSave}
          onPress={handleSave}
          style={[styles.saveButton, { backgroundColor: buttonBackgroundColor }]}
        >
          {saving ? (
            <ActivityIndicator color={buttonTextColor} />
          ) : (
            <Text style={[styles.saveButtonText, { color: buttonTextColor }]}>Salvar carteira</Text>
          )}
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
    padding: Spacing[4],
    paddingBottom: Spacing[8],
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
  rows: {
    gap: Spacing[4],
  },
  macroCard: {
    borderRadius: Radius.lg,
    padding: Spacing[4],
    gap: Spacing[4],
  },
  macroName: {
    ...Typography.headline_md,
  },
  inputRow: {
    flexDirection: 'row',
    gap: Spacing[4],
  },
  inputCell: {
    flex: 1,
  },
  footer: {
    gap: Spacing[4],
  },
  validation: {
    ...Typography.body_md,
    textAlign: 'center',
  },
  error: {
    ...Typography.body_md,
    textAlign: 'center',
  },
  saveButton: {
    minHeight: 52,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing[4],
  },
  saveButtonText: {
    ...Typography.body_md,
    fontFamily: 'Inter_500Medium',
  },
});
