import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { GlassButton } from '@/components/glass-button';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const AVATAR_SIZE = 80;
const CLOSE_SIZE = 36;

export default function ProfileScreen() {
  const router = useRouter();
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(150)}
      style={styles.overlay}
    >
      <Pressable style={StyleSheet.absoluteFill} onPress={() => router.back()} />

      <Animated.View
        entering={FadeIn.duration(250).delay(50)}
        style={[styles.content, { backgroundColor: colors.surface }]}
      >
        {/* Close button */}
        <View style={styles.closeRow}>
          <GlassButton size={CLOSE_SIZE} onPress={() => router.back()}>
            <MaterialIcons name="close" size={20} color={colors.on_surface} />
          </GlassButton>
        </View>

        {/* Avatar */}
        <View style={styles.profileSection}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: colors.surface_container_high },
            ]}
          >
            <Text style={[styles.avatarText, { color: colors.on_surface }]}>
              SR
            </Text>
          </View>
          <Text style={[styles.name, { color: colors.on_surface }]}>
            Samuel Reichert
          </Text>
        </View>

        {/* Menu */}
        <View style={styles.menu}>
          <Pressable
            onPress={() => router.push('/profile/theme')}
            style={[
              styles.menuItem,
              { backgroundColor: colors.surface_container_lowest },
            ]}
          >
            <Text style={[styles.menuLabel, { color: colors.on_surface }]}>
              Visual
            </Text>
            <MaterialIcons
              name="chevron-right"
              size={22}
              color={colors.on_surface_variant}
            />
          </Pressable>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  content: {
    flex: 1,
    marginTop: 60,
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
  },
  closeRow: {
    paddingTop: Spacing[4],
    paddingHorizontal: Spacing[4],
  },
  profileSection: {
    alignItems: 'center',
    paddingTop: Spacing[8],
    paddingBottom: Spacing[10],
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...Typography.headline_lg,
  },
  name: {
    ...Typography.headline_md,
    marginTop: Spacing[3],
  },
  menu: {
    paddingHorizontal: Spacing[4],
    gap: Spacing[3],
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[4],
    borderRadius: Radius.DEFAULT,
  },
  menuLabel: {
    ...Typography.body_md,
  },
});
