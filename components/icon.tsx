import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolView } from 'expo-symbols';

type Props = {
  /** SF Symbol name — used on iOS */
  sf: string;
  /** Material icon name — used on Android and Web */
  md: React.ComponentProps<typeof MaterialIcons>['name'];
  size?: number;
  color?: string;
};

export function Icon({ sf, md, size = 24, color }: Props) {
  if (process.env.EXPO_OS === 'ios') {
    return <SymbolView name={sf as any} size={size} tintColor={color} />;
  }
  return <MaterialIcons name={md} size={size} color={color} />;
}
