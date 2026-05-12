import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import { Colors, type ColorScheme, Fonts } from '@/constants/theme';

export function createTabStackOptions(scheme: ColorScheme): NativeStackNavigationOptions {
  return {
    contentStyle: { backgroundColor: Colors[scheme].surface },
    headerTransparent: true,
    headerBlurEffect: 'regular',
    headerLargeTitle: true,
    headerLargeTitleShadowVisible: false,
    headerLargeStyle: { backgroundColor: 'transparent' },
    headerShadowVisible: false,
    headerTitleStyle: { fontFamily: Fonts.manrope_semibold },
    headerLargeTitleStyle: { fontFamily: Fonts.manrope_bold },
  };
}
