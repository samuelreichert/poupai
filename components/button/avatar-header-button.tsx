import { Link } from 'expo-router';
import { Platform } from 'react-native';
import Animated from 'react-native-reanimated';

import { Button } from '@/components/button/button';

export function AvatarHeaderButton() {
  if (Platform.OS === 'ios') {
    return (
      <Link href="/profile" asChild>
        <Link.AppleZoom>
          <Button
            label="Profile"
            variant="icon"
            icon="person"
            accessibilityLabel="Abrir perfil"
            buttonStyle="plain"
          />
        </Link.AppleZoom>
      </Link>
    );
  }

  return (
    <Animated.View sharedTransitionTag="profile-toggle">
      <Link href="/profile" asChild>
        <Button label="Profile" variant="icon" icon="person" accessibilityLabel="Abrir perfil" />
      </Link>
    </Animated.View>
  );
}
