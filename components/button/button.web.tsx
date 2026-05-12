import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, StyleSheet, Text } from 'react-native';

import { DEFAULT_SIZE } from '@/components/button/constants';
import { IconButtonProps, TextButtonProps } from '@/components/button/types';
import { mdIcons } from '@/constants/icons';
import { Colors, Radius, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export type ButtonProps = IconButtonProps | TextButtonProps;

export function Button(props: ButtonProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const iconColor = props.active ? colors.primary : colors.on_surface;

  if (props.variant === 'icon') {
    const btnSize = props.size ?? DEFAULT_SIZE;
    const iconSize = Math.round(btnSize * 0.5);

    return (
      <Pressable
        style={[
          styles.iconBtn,
          { width: btnSize, height: btnSize, backgroundColor: colors.surface_container_high },
        ]}
        onPress={props.onPress}
        accessibilityLabel={props.accessibilityLabel}
      >
        <MaterialIcons name={mdIcons[props.icon]} size={iconSize} color={iconColor} />
      </Pressable>
    );
  }

  return (
    <Pressable
      style={[styles.textBtn, { backgroundColor: colors.surface_container_high }]}
      onPress={props.onPress}
      accessibilityLabel={props.accessibilityLabel}
    >
      {props.icon && (
        <MaterialIcons
          name={mdIcons[props.icon]}
          size={18}
          color={iconColor}
          style={styles.textBtnIcon}
        />
      )}
      <Text style={[styles.textBtnLabel, { color: iconColor }]}>{props.label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconBtn: {
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.full,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  textBtnIcon: {
    marginRight: 8,
  },
  textBtnLabel: {
    ...Typography.body_md,
  },
});
