import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const scheme = useColorScheme();
  const colors = Colors[scheme];

  return (
    <NativeTabs blurEffect="systemChromeMaterial" tintColor={colors.primary}>
      <NativeTabs.Trigger name="(home)">
        <NativeTabs.Trigger.Label>Início</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'house.fill', selected: 'house.fill' }} md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="assets">
        <NativeTabs.Trigger.Label>Ativos</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'chart.xyaxis.line', selected: 'chart.xyaxis.line' }}
          md="bar_chart_4_bars"
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="macro">
        <NativeTabs.Trigger.Label>Carteira</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'chart.pie.fill', selected: 'chart.pie.fill' }}
          md="pie_chart"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
