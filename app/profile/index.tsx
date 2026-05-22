import { FlashList } from '@shopify/flash-list';
import { Href, useNavigation, useRouter } from 'expo-router';
import { useCallback, useRef } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Button } from '@/components/button/button';
import { Icon } from '@/components/icon';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useColorScheme } from '@/hooks/use-color-scheme';

const AVATAR_SIZE = 96;
// Approx vertical offset at which the username text scrolls behind the nav bar
const TITLE_THRESHOLD = 130;

type MenuItem = {
  id: string;
  label: string;
  sf: string;
  md: React.ComponentProps<typeof Icon>['md'];
  onPress: () => void;
};

export default function ProfileScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const { signOut } = useAuth();
  const titleShown = useRef(false);

  const handleSignOut = useCallback(async () => {
    await signOut();
    router.replace('/(auth)/sign-in' as Href);
  }, [router, signOut]);

  const MENU_ITEMS: MenuItem[] = [
    {
      id: 'aparencia',
      label: 'Aparência',
      sf: 'paintpalette.fill',
      md: 'palette',
      onPress: () => router.push('/profile/theme'),
    },
    {
      id: 'logout',
      label: 'Sair',
      sf: 'rectangle.portrait.and.arrow.right',
      md: 'logout',
      onPress: handleSignOut,
    },
  ];

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = e.nativeEvent.contentOffset.y;
      const shouldShow = y > TITLE_THRESHOLD;
      if (shouldShow !== titleShown.current) {
        titleShown.current = shouldShow;
        navigation.setOptions({ title: shouldShow ? 'Samuel Reichert' : ' ' });
      }
    },
    [navigation],
  );

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
      onScroll={handleScroll}
      scrollEventThrottle={16}
    >
      {/* Avatar */}
      <View style={styles.profileSection}>
        <View style={[styles.avatarCircle, { backgroundColor: colors.surface_container_high }]}>
          <Button
            label="Avatar"
            variant="icon"
            icon="person"
            onPress={() => {}}
            size={AVATAR_SIZE}
            accessibilityLabel="Avatar"
          />
        </View>
        <Text style={[styles.name, { color: colors.on_surface }]}>Samuel Reichert</Text>
      </View>

      {/* Menu card */}
      <View style={[styles.menuCard, { backgroundColor: colors.surface_container_lowest }]}>
        <FlashList
          data={MENU_ITEMS}
          scrollEnabled={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={item.onPress}
              style={({ pressed }) => [
                styles.menuItem,
                pressed && { backgroundColor: colors.surface_container_high },
              ]}
              accessibilityRole="button"
            >
              <Icon sf={item.sf} md={item.md} size={18} color={colors.on_surface_variant} />
              <Text style={[styles.menuLabel, { color: colors.on_surface }]}>{item.label}</Text>
            </Pressable>
          )}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[8],
    gap: Spacing[4],
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: Spacing[8],
    gap: Spacing[3],
  },
  avatarCircle: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  name: {
    ...Typography.headline_md,
  },
  menuCard: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[4],
  },
  menuLabel: {
    ...Typography.body_md,
  },
});
