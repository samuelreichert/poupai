import { StyleSheet, View } from 'react-native';

import { AvatarButton } from '@/components/avatar-button';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function AssetsScreen() {
  const scheme = useColorScheme() ?? 'light';

  return (
    <View style={[styles.container, { backgroundColor: Colors[scheme].surface }]}>
      <View style={styles.header}>
        <AvatarButton />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Spacing[16],
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[3],
  },
});
