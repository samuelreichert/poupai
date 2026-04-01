import { Platform, Pressable, StyleSheet, type PressableProps, type ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';

import { Colors, Glass } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface GlassButtonProps extends PressableProps {
  size: number;
  children: React.ReactNode;
}

export function GlassButton({ size, children, style, ...props }: GlassButtonProps) {
  const scheme = useColorScheme() ?? 'light';
  const tint = scheme === 'dark' ? 'dark' : 'light';

  const containerStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    overflow: 'hidden',
  };

  if (Platform.OS === 'ios') {
    return (
      <Pressable style={[containerStyle, style as ViewStyle]} {...props}>
        <BlurView
          tint={tint}
          intensity={Glass.blurIntensity}
          style={[StyleSheet.absoluteFill, styles.center]}
        >
          {children}
        </BlurView>
      </Pressable>
    );
  }

  return (
    <Pressable
      style={[
        containerStyle,
        { backgroundColor: Colors[scheme].surface_container_high, elevation: 2 },
        style as ViewStyle,
      ]}
      {...props}
    >
      <>{children}</>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
