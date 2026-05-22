import { Href, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AllocationRow } from '@/components/allocation-row';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useMacroPlan } from '@/hooks/use-macro-plan';
import { formatCurrencyBRL, formatPercentBR } from '@/lib/format';

export default function MacroScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const { rows, summary, loading } = useMacroPlan();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
      style={[styles.container, { backgroundColor: colors.surface }]}
    >
      <View style={[styles.header, { backgroundColor: colors.surface_container_lowest }]}>
        <Text style={[styles.label, { color: colors.on_surface_variant }]}>Distribuição atual</Text>
        <Text style={[styles.value, { color: colors.on_surface }]}>
          {formatPercentBR(summary?.ideal_percent_total ?? 0)}
        </Text>
      </View>

      <View style={styles.rows}>
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
            onPress={() => row.id && router.push(`/macro/${row.id}` as Href)}
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
  header: {
    borderRadius: Radius.lg,
    padding: Spacing[8],
    gap: Spacing[3],
  },
  label: {
    ...Typography.label_md,
  },
  value: {
    ...Typography.display_sm,
    fontVariant: ['tabular-nums'],
  },
  rows: {
    gap: Spacing[4],
  },
  body: {
    ...Typography.body_md,
  },
});
