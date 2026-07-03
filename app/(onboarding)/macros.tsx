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
  STARTER_MACRO_PLAN,
} from '@/lib/macro-plan';
import {
  createOnboardingMacroDraft,
  getOnboardingSaveMacros,
  getSelectedOnboardingMacros,
  hasSelectedOnboardingMacros,
  OnboardingMacroDraft,
  toggleOnboardingMacroSelection,
  updateOnboardingMacroDraft,
} from '@/lib/onboarding-plan';
import type { MacroKind } from '@/types/domain';

type OnboardingStep = 'selection' | 'allocation' | 'goal' | 'values';

const ONBOARDING_STEPS: OnboardingStep[] = ['selection', 'allocation', 'goal', 'values'];

function getPercentValidationLabel(total: number): string {
  if (isCompleteIdealPercentTotal(total)) {
    return 'Total: 100%';
  }

  if (total < 1) {
    return `Faltam ${formatPercentBR(1 - total)} para fechar 100%`;
  }

  return `Passei ${formatPercentBR(total - 1)} de 100%`;
}

function getStepCopy(step: OnboardingStep) {
  switch (step) {
    case 'selection':
      return {
        title: 'Escolha suas classes',
        subtitle: 'Marque as classes que você quer acompanhar agora.',
      };
    case 'allocation':
      return {
        title: 'Defina a alocação ideal',
        subtitle: 'Distribua 100% entre as classes selecionadas.',
      };
    case 'goal':
      return {
        title: 'Defina sua meta',
        subtitle: 'Informe o valor total de carteira que você quer alcançar.',
      };
    case 'values':
      return {
        title: 'Informe seus saldos',
        subtitle: 'Registre quanto você já tem em cada classe selecionada.',
      };
  }
}

export default function OnboardingMacrosScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const [step, setStep] = useState<OnboardingStep>('selection');
  const [investmentGoal, setInvestmentGoal] = useState(DEFAULT_INVESTMENT_GOAL);
  const [macros, setMacros] = useState<OnboardingMacroDraft[]>(() =>
    createOnboardingMacroDraft(STARTER_MACRO_PLAN),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedMacros = useMemo(() => getSelectedOnboardingMacros(macros), [macros]);
  const selectedIdealPercentTotal = useMemo(
    () => getIdealPercentTotal(selectedMacros),
    [selectedMacros],
  );
  const selectedCount = selectedMacros.length;
  const stepIndex = ONBOARDING_STEPS.indexOf(step);
  const stepCopy = getStepCopy(step);
  const hasSelection = hasSelectedOnboardingMacros(macros);
  const canContinueSelection = hasSelection;
  const canContinueAllocation = hasSelection && isCompleteIdealPercentTotal(selectedIdealPercentTotal);
  const canContinueGoal = investmentGoal > 0;
  const isLastStep = step === 'values';
  const canContinue =
    (step === 'selection' && canContinueSelection) ||
    (step === 'allocation' && canContinueAllocation) ||
    (step === 'goal' && canContinueGoal) ||
    step === 'values';

  function handleToggleMacro(kind: MacroKind) {
    setError(null);
    setMacros((current) => toggleOnboardingMacroSelection(current, kind));
  }

  function updateMacro(kind: MacroKind, patch: Partial<Pick<OnboardingMacroDraft, 'idealPercent' | 'currentValue'>>) {
    setError(null);
    setMacros((current) => updateOnboardingMacroDraft(current, kind, patch));
  }

  function handleBack() {
    setError(null);

    if (stepIndex > 0) {
      setStep(ONBOARDING_STEPS[stepIndex - 1]);
    }
  }

  async function handleContinue() {
    setError(null);

    if (!canContinue) {
      setError(getValidationMessage(step));
      return;
    }

    if (!isLastStep) {
      setStep(ONBOARDING_STEPS[stepIndex + 1]);
      return;
    }

    setSaving(true);

    try {
      await saveMacroPlan(investmentGoal, 'moderate', getOnboardingSaveMacros(macros));
      router.replace('/(tabs)' as Href);
    } catch {
      setError('Não foi possível salvar sua carteira. Tente novamente.');
    } finally {
      setSaving(false);
    }
  }

  function getValidationMessage(currentStep: OnboardingStep): string {
    switch (currentStep) {
      case 'selection':
        return 'Escolha pelo menos uma classe para continuar.';
      case 'allocation':
        return getPercentValidationLabel(selectedIdealPercentTotal);
      case 'goal':
        return 'Informe uma meta maior que zero.';
      case 'values':
        return 'Revise seus saldos antes de salvar.';
    }
  }

  const validationLabel =
    step === 'selection'
      ? `${selectedCount} selecionada${selectedCount === 1 ? '' : 's'}`
      : step === 'allocation'
        ? getPercentValidationLabel(selectedIdealPercentTotal)
        : step === 'goal'
          ? investmentGoal > 0
            ? 'Meta definida'
            : 'Informe uma meta maior que zero'
          : 'Valores atuais podem ser zero';
  const validationColor = canContinue ? colors.positive : colors.negative;
  const buttonBackgroundColor = canContinue && !saving ? colors.primary : colors.surface_container_high;
  const buttonTextColor = canContinue && !saving ? colors.on_primary : colors.on_surface_variant;
  const backButtonTextColor = stepIndex > 0 ? colors.on_surface : colors.on_surface_variant;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
      style={[styles.container, { backgroundColor: colors.surface }]}
    >
      <View style={styles.header}>
        <Text style={[styles.stepLabel, { color: colors.on_surface_variant }]}>
          Etapa {stepIndex + 1} de {ONBOARDING_STEPS.length}
        </Text>
        <Text style={[styles.title, { color: colors.on_surface }]}>{stepCopy.title}</Text>
        <Text style={[styles.subtitle, { color: colors.on_surface_variant }]}>
          {stepCopy.subtitle}
        </Text>
      </View>

      <View style={styles.progressRow}>
        {ONBOARDING_STEPS.map((currentStep) => {
          const currentIndex = ONBOARDING_STEPS.indexOf(currentStep);
          const isCompleted = currentIndex < stepIndex;
          const isCurrent = currentIndex === stepIndex;
          const progressColor = isCompleted || isCurrent ? colors.primary : colors.surface_container_high;

          return (
            <View
              key={currentStep}
              style={[styles.progressSegment, { backgroundColor: progressColor }]}
            />
          );
        })}
      </View>

      {step === 'selection' && (
        <View style={styles.rows}>
          {macros.map((macro) => (
            <MacroSelectionRow
              key={macro.kind}
              macro={macro}
              onPress={() => handleToggleMacro(macro.kind)}
            />
          ))}
        </View>
      )}

      {step === 'allocation' && (
        <View style={styles.rows}>
          {selectedMacros.map((macro) => (
            <View
              key={macro.kind}
              style={[styles.macroPanel, { backgroundColor: colors.surface_container_lowest }]}
            >
              <Text style={[styles.macroName, { color: colors.on_surface }]}>{macro.name}</Text>
              <PercentInput
                label="Porcentagem ideal"
                onChangeValue={(idealPercent) =>
                  updateMacro(macro.kind, { idealPercent: Math.max(idealPercent, 0) })
                }
                value={macro.idealPercent}
              />
            </View>
          ))}
        </View>
      )}

      {step === 'goal' && (
        <CurrencyInput
          label="Meta de investimento"
          onChangeValue={(nextGoal) => {
            setError(null);
            setInvestmentGoal(Math.max(nextGoal, 0));
          }}
          value={investmentGoal}
        />
      )}

      {step === 'values' && (
        <View style={styles.rows}>
          {selectedMacros.map((macro) => (
            <View
              key={macro.kind}
              style={[styles.macroPanel, { backgroundColor: colors.surface_container_lowest }]}
            >
              <Text style={[styles.macroName, { color: colors.on_surface }]}>{macro.name}</Text>
              <CurrencyInput
                label="Valor atual"
                onChangeValue={(currentValue) =>
                  updateMacro(macro.kind, { currentValue: Math.max(currentValue, 0) })
                }
                value={macro.currentValue}
              />
            </View>
          ))}
        </View>
      )}

      <View style={styles.footer}>
        <Text style={[styles.validation, { color: validationColor }]}>{validationLabel}</Text>
        {error && <Text style={[styles.error, { color: colors.negative }]}>{error}</Text>}
        <View style={styles.buttonRow}>
          <Pressable
            accessibilityRole="button"
            disabled={stepIndex === 0 || saving}
            onPress={handleBack}
            style={[styles.backButton, { backgroundColor: colors.surface_container_lowest }]}
          >
            <Text style={[styles.backButtonText, { color: backButtonTextColor }]}>Voltar</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            disabled={!canContinue || saving}
            onPress={handleContinue}
            style={[styles.saveButton, { backgroundColor: buttonBackgroundColor }]}
          >
            {saving ? (
              <ActivityIndicator color={buttonTextColor} />
            ) : (
              <Text style={[styles.saveButtonText, { color: buttonTextColor }]}>
                {isLastStep ? 'Salvar carteira' : 'Continuar'}
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

type MacroSelectionRowProps = {
  macro: OnboardingMacroDraft;
  onPress: () => void;
};

function MacroSelectionRow({ macro, onPress }: MacroSelectionRowProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const selectedBackgroundColor = macro.selected
    ? colors.surface_container_high
    : colors.surface_container_lowest;
  const selectedLabelColor = macro.selected ? colors.positive : colors.on_surface_variant;

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: macro.selected }}
      onPress={onPress}
      style={[styles.selectionRow, { backgroundColor: selectedBackgroundColor }]}
    >
      <View style={styles.selectionText}>
        <Text style={[styles.macroName, { color: colors.on_surface }]}>{macro.name}</Text>
        <Text style={[styles.selectionStatus, { color: selectedLabelColor }]}>
          {macro.selected ? 'Selecionada' : 'Adicionar'}
        </Text>
      </View>
    </Pressable>
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
  stepLabel: {
    ...Typography.label_md,
  },
  title: {
    ...Typography.headline_lg,
  },
  subtitle: {
    ...Typography.body_md,
  },
  progressRow: {
    flexDirection: 'row',
    gap: Spacing[3],
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: Radius.full,
  },
  rows: {
    gap: Spacing[4],
  },
  selectionRow: {
    minHeight: 72,
    borderRadius: Radius.lg,
    padding: Spacing[4],
    justifyContent: 'center',
  },
  selectionText: {
    gap: Spacing[3],
  },
  selectionStatus: {
    ...Typography.label_md,
  },
  macroPanel: {
    borderRadius: Radius.lg,
    padding: Spacing[4],
    gap: Spacing[4],
  },
  macroName: {
    ...Typography.headline_md,
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
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing[4],
  },
  backButton: {
    minHeight: 52,
    flex: 1,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing[4],
  },
  saveButton: {
    minHeight: 52,
    flex: 2,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing[4],
  },
  backButtonText: {
    ...Typography.body_md,
    fontFamily: 'Inter_500Medium',
  },
  saveButtonText: {
    ...Typography.body_md,
    fontFamily: 'Inter_500Medium',
  },
});
