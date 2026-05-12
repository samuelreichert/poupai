import { ScrollView, StyleSheet } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function AssetsScreen() {
  const scheme = useColorScheme();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={[styles.container, { backgroundColor: Colors[scheme].surface }]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
