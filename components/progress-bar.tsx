import { DimensionValue, StyleSheet, View } from 'react-native';

import { Colors, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Props = {
  progress: number;
};

function clampProgress(value: number): number {
  return Math.min(Math.max(value, 0), 1);
}

export function ProgressBar({ progress }: Props) {
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const fillWidth = `${clampProgress(progress) * 100}%` as DimensionValue;
  const fillStyle = { width: fillWidth, backgroundColor: colors.primary };

  return (
    <View style={[styles.track, { backgroundColor: colors.surface_container_low }]}>
      <View style={[styles.fill, fillStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: Spacing[3],
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radius.full,
  },
});
