import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Label>Inicio</Label>
        <Icon sf={{ default: 'house', selected: 'house.fill' }} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="assets">
        <Label>Ativos</Label>
        <Icon sf={{ default: 'chart.pie', selected: 'chart.pie.fill' }} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="macro">
        <Label>Macro</Label>
        <Icon sf={{ default: 'globe', selected: 'globe' }} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
