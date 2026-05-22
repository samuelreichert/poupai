import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CurrencyInput } from '@/components/currency-input';
import { PercentInput } from '@/components/percent-input';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useMacroPlan } from '@/hooks/use-macro-plan';
import { saveMacroPlan } from '@/hooks/use-save-macro-plan';
import { formatPercentBR } from '@/lib/format';
import {
  getIdealPercentTotal,
  isCompleteIdealPercentTotal,
  MacroAllocationRow,
  MacroPlanInput,
} from '@/lib/macro-plan';
import { MacroPlanSummary } from '@/types/domain';

function getValidationLabel(total: number): string {
  if (isCompleteIdealPercentTotal(total)) {
    return 'Total: 100%';
  }

  if (total < 1) {
    return `Faltam ${formatPercentBR(1 - total)} para fechar 100%`;
  }

  return `Passei ${formatPercentBR(total - 1)} de 100%`;
}

export default function MacroEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const { rows, summary, loading } = useMacroPlan();
  const currentMacro = rows.find((row) => row.id === id);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
      style={[styles.container, { backgroundColor: colors.surface }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.on_surface }]}>
          {currentMacro?.name ?? 'Classe de ativo'}
        </Text>
        <Text style={[styles.subtitle, { color: colors.on_surface_variant }]}>
          Ajuste a porcentagem ideal e o saldo atual.
        </Text>
      </View>

      {loading ? (
        <Text style={[styles.body, { color: colors.on_surface_variant }]}>Carregando...</Text>
      ) : currentMacro ? (
        <MacroEditForm
          key={currentMacro.id}
          currentMacro={currentMacro}
          id={id}
          rows={rows}
          summary={summary}
        />
      ) : (
        <Text style={[styles.body, { color: colors.on_surface_variant }]}>
          Classe de ativo não encontrada.
        </Text>
      )}
    </ScrollView>
  );
}

type MacroEditFormProps = {
  currentMacro: MacroAllocationRow;
  id: string;
  rows: MacroAllocationRow[];
  summary: MacroPlanSummary | null;
};

function MacroEditForm({ currentMacro, id, rows, summary }: MacroEditFormProps) {
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const [idealPercent, setIdealPercent] = useState(currentMacro?.idealPercent ?? 0);
  const [currentValue, setCurrentValue] = useState(currentMacro?.currentValue ?? 0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextMacros = useMemo<MacroPlanInput[]>(
    () =>
      rows.map((row) =>
        row.id === id
          ? {
              id: row.id,
              name: row.name,
              kind: row.kind,
              idealPercent,
              currentValue,
              displayOrder: row.displayOrder,
            }
          : {
              id: row.id,
              name: row.name,
              kind: row.kind,
              idealPercent: row.idealPercent,
              currentValue: row.currentValue,
              displayOrder: row.displayOrder,
            },
      ),
    [currentValue, id, idealPercent, rows],
  );

  const idealPercentTotal = getIdealPercentTotal(nextMacros);
  const canSave = isCompleteIdealPercentTotal(idealPercentTotal) && !saving && Boolean(currentMacro);

  async function handleSave() {
    if (!summary) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await saveMacroPlan(summary.investment_goal, 'moderate', nextMacros);
      router.back();
    } catch {
      setError('Não foi possível salvar a alteração. Tente novamente.');
    } finally {
      setSaving(false);
    }
  }

  const validationColor = canSave ? colors.positive : colors.negative;
  const buttonBackgroundColor = canSave ? colors.primary : colors.surface_container_high;
  const buttonTextColor = canSave ? colors.on_primary : colors.on_surface_variant;

  return (
    <>
      <View style={[styles.card, { backgroundColor: colors.surface_container_lowest }]}>
        <PercentInput
          label="Porcentagem ideal"
          onChangeValue={setIdealPercent}
          value={idealPercent}
        />
        <CurrencyInput label="Valor atual" onChangeValue={setCurrentValue} value={currentValue} />
      </View>

      <View style={styles.footer}>
        <Text style={[styles.validation, { color: validationColor }]}>
          {getValidationLabel(idealPercentTotal)}
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
            <Text style={[styles.saveButtonText, { color: buttonTextColor }]}>Salvar alteração</Text>
          )}
        </Pressable>
      </View>
    </>
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
  body: {
    ...Typography.body_md,
  },
  card: {
    borderRadius: Radius.lg,
    padding: Spacing[4],
    gap: Spacing[4],
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
