import { Stack, useRouter } from 'expo-router';
import { Platform } from 'react-native';

import { Button } from '@/components/button/button';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ProfileLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const sharedOptions = {
    contentStyle: { backgroundColor: Colors[colorScheme].surface },
    headerShown: true,
    headerTransparent: true,
    headerBlurEffect: 'regular' as const,
    headerShadowVisible: false,
    headerTitleStyle: { fontFamily: Fonts.manrope_semibold },
  };

  const profileScreenOptions = Platform.select({
    ios: {
      ...sharedOptions,
      presentation: 'fullScreenModal' as const,
      animation: 'default' as const,
    },
    default: {
      ...sharedOptions,
      presentation: 'transparentModal' as const,
      animation: 'fade' as const,
    },
  });

  return (
    <Stack screenOptions={profileScreenOptions}>
      <Stack.Screen
        name="index"
        options={{
          title: '',
          headerLeft: () => (
            <Button
              label="Fechar"
              variant="icon"
              icon="close"
              buttonStyle="plain"
              onPress={() => router.dismiss()}
              accessibilityLabel="Fechar"
            />
          ),
        }}
      />
      <Stack.Screen
        name="theme"
        options={{
          title: 'Aparência',
          presentation: 'card',
          animation: 'slide_from_right',
          headerBackVisible: true,
          headerBackButtonDisplayMode: 'minimal',
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: false,
          headerLargeStyle: { backgroundColor: 'transparent' },
          headerLargeTitleStyle: { fontFamily: Fonts.manrope_bold },
        }}
      />
    </Stack>
  );
}
