/**
 * Icon registry — single source of truth for cross-platform icons.
 * Maps a logical IconName to each platform's icon representation.
 *
 * iOS:     SF Symbol string (systemImage prop on @expo/ui/swift-ui Button)
 * Android: XML vector drawable via require() — static literals required by Metro
 * Web:     Material icon name string (@react-native-vector-icons/material-icons)
 */

import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { SFSymbols7_0 } from 'sf-symbols-typescript';

export type IconName = 'person' | 'close';

export const sfIcons: Record<IconName, SFSymbols7_0> = {
  person: 'person.fill',
  close: 'xmark',
};

// require() calls must be static string literals — Metro cannot resolve dynamic expressions.
export const xmlIcons = {
  person: require('@/assets/icons/person.xml'),
  close: require('@/assets/icons/close.xml'),
} as const;

export const mdIcons: Record<IconName, React.ComponentProps<typeof MaterialIcons>['name']> = {
  person: 'person',
  close: 'close',
};
