import { StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';

import { GlassButton } from '@/components/glass-button';
import { Colors, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const SIZE = 36;

export function AvatarButton() {
  const router = useRouter();
  const scheme = useColorScheme() ?? 'light';

  return (
    <GlassButton size={SIZE} onPress={() => router.push('/profile')}>
      <Text style={[styles.initials, { color: Colors[scheme].on_surface }]}>
        SR
      </Text>
    </GlassButton>
  );
}

const styles = StyleSheet.create({
  initials: {
    ...Typography.label_md,
    fontWeight: '600',
  },
});
