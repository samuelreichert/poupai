import { Colors, type ColorScheme, Fonts } from '@/constants/theme';

export function createTabStackOptions(scheme: ColorScheme) {
  return {
    contentStyle: { backgroundColor: Colors[scheme].surface },
    headerTransparent: true,
    headerBlurEffect: 'regular' as const,
    headerLargeTitle: true,
    headerLargeTitleShadowVisible: false,
    headerLargeStyle: { backgroundColor: 'transparent' },
    headerShadowVisible: false,
    headerTitleStyle: { fontFamily: Fonts.manrope_semibold },
    headerLargeTitleStyle: { fontFamily: Fonts.manrope_bold },
  };
}
