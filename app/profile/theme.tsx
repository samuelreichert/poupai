import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getThemePreference, setThemePreference, type ThemePreference } from '@/constants/storage';

const OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Escuro' },
  { value: 'system', label: 'Sistema' },
];

export default function VisualScreen() {
  const router = useRouter();
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const current = getThemePreference();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="chevron-left" size={28} color={colors.on_surface} />
        </Pressable>
        <Text style={[styles.title, { color: colors.on_surface }]}>Visual</Text>
        <View style={styles.backButton} />
      </View>

      {/* Options */}
      <View style={styles.options}>
        {OPTIONS.map((option) => {
          const isActive = current === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => setThemePreference(option.value)}
              style={[
                styles.option,
                {
                  backgroundColor: isActive
                    ? colors.surface_container_high
                    : colors.surface_container_lowest,
                },
              ]}
            >
              <Text style={[styles.optionLabel, { color: colors.on_surface }]}>
                {option.label}
              </Text>
              {isActive && (
                <MaterialIcons name="check" size={20} color={colors.secondary} />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing[16],
    paddingHorizontal: Spacing[3],
    paddingBottom: Spacing[4],
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...Typography.headline_md,
  },
  options: {
    paddingHorizontal: Spacing[4],
    gap: Spacing[3],
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[4],
    borderRadius: Radius.DEFAULT,
  },
  optionLabel: {
    ...Typography.body_md,
  },
});
