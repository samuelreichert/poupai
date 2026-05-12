import {
  Appearance,
  ColorSchemeName,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { storage, STORAGE_KEYS } from '@/constants/storage';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const CIRCLE_SIZE = 64;

const OPTIONS: { value: ColorSchemeName; label: string }[] = [
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Escuro' },
  { value: 'unspecified', label: 'Sistema' },
];

export default function AparenciaScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme];

  const storedScheme = (storage.getString(STORAGE_KEYS.colorScheme) ??
    'unspecified') as ColorSchemeName;

  const handleSelect = (value: ColorSchemeName) => {
    storage.set(STORAGE_KEYS.colorScheme, value ?? 'unspecified');
    Appearance.setColorScheme(value);
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={[styles.content, { backgroundColor: colors.surface }]}
      style={{ backgroundColor: colors.surface }}
    >
      <View style={styles.row}>
        {OPTIONS.map((option) => {
          const isActive = storedScheme === option.value;
          return (
            <View key={option.value} style={styles.optionUnit}>
              <Pressable
                onPress={() => handleSelect(option.value)}
                style={[
                  styles.circle,
                  isActive ? { borderColor: colors.on_surface } : { borderColor: 'transparent' },
                ]}
                accessibilityLabel={option.label}
                accessibilityRole="radio"
                accessibilityState={{ selected: isActive }}
              >
                {option.value === 'unspecified' ? (
                  <View style={styles.splitCircle}>
                    <View
                      style={[
                        styles.halfCircle,
                        { backgroundColor: Colors.light.surface_container_lowest },
                      ]}
                    />
                    <View
                      style={[
                        styles.halfCircle,
                        { backgroundColor: Colors.dark.surface_container_lowest },
                      ]}
                    />
                  </View>
                ) : (
                  <View
                    style={[
                      styles.solidCircle,
                      {
                        backgroundColor:
                          option.value === 'light'
                            ? Colors.light.surface_container_lowest
                            : Colors.dark.surface_container_lowest,
                      },
                    ]}
                  />
                )}
              </Pressable>
              <Text
                style={[
                  styles.label,
                  { color: isActive ? colors.on_surface : colors.on_surface_variant },
                ]}
              >
                {option.label}
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing[8],
    gap: Spacing[8],
  },
  optionUnit: {
    alignItems: 'center',
    gap: Spacing[3],
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: Radius.full,
    borderWidth: 2,
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
  splitCircle: {
    flex: 1,
    flexDirection: 'row',
  },
  halfCircle: {
    flex: 1,
  },
  solidCircle: {
    flex: 1,
  },
  label: {
    ...Typography.label_md,
  },
});
