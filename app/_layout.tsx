import { Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';
import {
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
} from '@expo-google-fonts/manrope';
import { useFonts } from 'expo-font';
import { Href, Stack, useRouter, useSegments } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router/react-navigation';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Appearance } from 'react-native';

import { storage, STORAGE_KEYS } from '@/constants/storage';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { supabase } from '@/lib/supabase';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

function AuthGate() {
  const router = useRouter();
  const segments = useSegments();
  const { session, loading } = useAuth();
  const bypassAuth = __DEV__ && process.env.EXPO_PUBLIC_BYPASS_AUTH === 'true';

  useEffect(() => {
    if (bypassAuth) {
      return;
    }

    if (loading) {
      return;
    }

    const routeGroup = segments[0] as string | undefined;
    const inAuthGroup = routeGroup === '(auth)';
    const inOnboardingGroup = routeGroup === '(onboarding)';

    if (!session) {
      if (!inAuthGroup) {
        router.replace('/(auth)/sign-in' as Href);
      }
      return;
    }

    let cancelled = false;
    const currentSession = session;

    async function routeSignedInUser() {
      const cacheKey = `${STORAGE_KEYS.macroAllocationCompletedPrefix}${currentSession.user.id}`;

      const { data: profile } = await supabase
        .from('profiles')
        .select('macro_allocation_completed_at')
        .eq('id', currentSession.user.id)
        .maybeSingle();

      if (cancelled) {
        return;
      }

      if (profile?.macro_allocation_completed_at) {
        storage.set(cacheKey, 'true');
        if (inAuthGroup || inOnboardingGroup) {
          router.replace('/(tabs)' as Href);
        }
        return;
      }

      storage.delete(cacheKey);
      if (!inOnboardingGroup) {
        router.replace('/(onboarding)/macros' as Href);
      }
    }

    routeSignedInUser();

    return () => {
      cancelled = true;
    };
  }, [bypassAuth, loading, router, segments, session]);

  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Inter_400Regular,
    Inter_500Medium,
  });

  useEffect(() => {
    const stored = storage.getString(STORAGE_KEYS.colorScheme);
    if (stored === 'light' || stored === 'dark') {
      Appearance.setColorScheme(stored);
    }
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hide();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: Colors[colorScheme].surface },
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="macro/[id]" />
        <Stack.Screen name="profile" />
      </Stack>
      <AuthGate />
      <StatusBar style="auto" animated />
    </ThemeProvider>
  );
}
