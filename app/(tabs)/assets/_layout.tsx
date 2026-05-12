import { Stack } from 'expo-router';

import { AvatarHeaderButton } from '@/components/button/avatar-header-button';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { createTabStackOptions } from '@/lib/tab-stack-options';

export default function AssetsTabLayout() {
  const scheme = useColorScheme();

  return (
    <Stack screenOptions={createTabStackOptions(scheme)}>
      <Stack.Screen
        name="index"
        options={{ title: 'Ativos', headerLeft: () => <AvatarHeaderButton /> }}
      />
    </Stack>
  );
}
