import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AllocationRow } from '@/components/allocation-row';
import { ProgressBar } from '@/components/progress-bar';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useMacroPlan } from '@/hooks/use-macro-plan';
import { formatCurrencyBRL, formatPercentBR } from '@/lib/format';

export default function HomeScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const { rows, summary, loading } = useMacroPlan();
  const progress = summary && summary.investment_goal > 0
    ? summary.total_current_value / summary.investment_goal
    : 0;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
      style={[styles.container, { backgroundColor: colors.surface }]}
    >
      <View style={[styles.hero, { backgroundColor: colors.surface_container_lowest }]}>
        <Text style={[styles.label, { color: colors.on_surface_variant }]}>Patrimônio total</Text>
        <Text style={[styles.heroValue, { color: colors.on_surface }]}>
          {formatCurrencyBRL(summary?.total_current_value ?? 0)}
        </Text>
        <Text style={[styles.body, { color: colors.on_surface_variant }]}>
          Meta: {formatCurrencyBRL(summary?.investment_goal ?? 0)}
        </Text>
        <Text style={[styles.body, { color: colors.on_surface_variant }]}>
          Faltam {formatCurrencyBRL(summary?.remaining_to_goal ?? 0)}
        </Text>
        <ProgressBar progress={progress} />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.on_surface }]}>Alocação</Text>
        {loading && <Text style={[styles.body, { color: colors.on_surface_variant }]}>Carregando...</Text>}
        {rows.map((row) => (
          <AllocationRow
            currentPercent={formatPercentBR(row.currentPercent)}
            currentValue={formatCurrencyBRL(row.currentValue)}
            diffToIdeal={formatCurrencyBRL(row.diffToIdeal)}
            idealPercent={formatPercentBR(row.idealPercent)}
            idealValue={formatCurrencyBRL(row.idealValue)}
            isNegativeDiff={row.diffToIdeal < 0}
            key={row.id ?? row.kind}
            name={row.name}
          />
        ))}
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
  hero: {
    borderRadius: Radius.lg,
    padding: Spacing[8],
    gap: Spacing[3],
  },
  label: {
    ...Typography.label_md,
  },
  heroValue: {
    ...Typography.display_sm,
    fontVariant: ['tabular-nums'],
  },
  body: {
    ...Typography.body_md,
  },
  section: {
    gap: Spacing[4],
  },
  sectionTitle: {
    ...Typography.headline_md,
  },
});
