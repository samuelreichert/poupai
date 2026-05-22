import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Props = {
  name: string;
  idealPercent: string;
  currentPercent: string;
  idealValue: string;
  currentValue: string;
  diffToIdeal: string;
  isNegativeDiff: boolean;
  onPress?: () => void;
};

export function AllocationRow({
  name,
  idealPercent,
  currentPercent,
  idealValue,
  currentValue,
  diffToIdeal,
  isNegativeDiff,
  onPress,
}: Props) {
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const diffColor = isNegativeDiff ? colors.negative : colors.positive;

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: pressed ? colors.surface_container_high : colors.surface_container_lowest,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.name, { color: colors.on_surface }]}>{name}</Text>
        <Text style={[styles.percent, { color: colors.on_surface_variant }]}>
          Atual {currentPercent} | Ideal {idealPercent}
        </Text>
      </View>

      <View style={styles.values}>
        <View style={styles.valueGroup}>
          <Text style={[styles.caption, { color: colors.on_surface_variant }]}>Valor atual</Text>
          <Text style={[styles.value, { color: colors.on_surface }]}>{currentValue}</Text>
        </View>
        <View style={styles.valueGroup}>
          <Text style={[styles.caption, { color: colors.on_surface_variant }]}>Valor ideal</Text>
          <Text style={[styles.value, { color: colors.on_surface }]}>{idealValue}</Text>
        </View>
        <View style={styles.valueGroup}>
          <Text style={[styles.caption, { color: colors.on_surface_variant }]}>Diferença</Text>
          <Text style={[styles.value, { color: diffColor }]}>{diffToIdeal}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.lg,
    padding: Spacing[4],
    gap: Spacing[4],
  },
  header: {
    gap: Spacing[3],
  },
  name: {
    ...Typography.headline_md,
  },
  percent: {
    ...Typography.label_md,
  },
  values: {
    flexDirection: 'row',
    gap: Spacing[4],
  },
  valueGroup: {
    flex: 1,
    gap: Spacing[3],
  },
  caption: {
    ...Typography.label_md,
  },
  value: {
    ...Typography.body_md,
    fontVariant: ['tabular-nums'],
  },
});
