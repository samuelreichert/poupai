import { StyleProp, StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native';

import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { parseLocalizedNumber } from '@/lib/format';

type Props = {
  label: string;
  value: number;
  onChangeValue: (value: number) => void;
  style?: StyleProp<ViewStyle>;
};

function getDisplayValue(value: number): string {
  return value > 0 ? String(value * 100).replace('.', ',') : '';
}

export function PercentInput({ label, value, onChangeValue, style }: Props) {
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const inputBackgroundColor = colors.surface_container_low;

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.label, { color: colors.on_surface_variant }]}>{label}</Text>
      <TextInput
        keyboardType="decimal-pad"
        onChangeText={(text) => onChangeValue(parseLocalizedNumber(text) / 100)}
        placeholder="0%"
        placeholderTextColor={colors.on_surface_variant}
        style={[styles.input, { backgroundColor: inputBackgroundColor, color: colors.on_surface }]}
        value={getDisplayValue(value)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing[3],
  },
  label: {
    ...Typography.label_md,
  },
  input: {
    ...Typography.body_md,
    minHeight: 52,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing[4],
  },
});
