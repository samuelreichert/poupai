import {
  FilledTonalButton,
  FilledTonalIconButton,
  Host,
  Icon,
  Shape,
  type ShapeJSXElement,
  Text as ComposeText,
} from '@expo/ui/jetpack-compose';
import { size as sizeModifier } from '@expo/ui/jetpack-compose/modifiers';

import { DEFAULT_SIZE } from '@/components/button/constants';
import { IconButtonProps, TextButtonProps } from '@/components/button/types';
import { xmlIcons } from '@/constants/icons';
import { Colors } from '@/constants/theme';
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
      <Host matchContents>
        <FilledTonalIconButton
          onClick={props.onPress}
          shape={(<Shape.Circle />) as ShapeJSXElement}
          colors={{ containerColor: colors.surface_container_high, contentColor: iconColor }}
          modifiers={[sizeModifier(btnSize, btnSize)]}
        >
          <Icon source={xmlIcons[props.icon]} tintColor={iconColor} size={iconSize} />
        </FilledTonalIconButton>
      </Host>
    );
  }

  return (
    <Host matchContents>
      <FilledTonalButton
        onClick={props.onPress}
        shape={(<Shape.Pill />) as ShapeJSXElement}
        colors={{ containerColor: colors.surface_container_high, contentColor: iconColor }}
      >
        {props.icon && <Icon source={xmlIcons[props.icon]} tintColor={iconColor} size={18} />}
        <ComposeText color={iconColor}>{props.label}</ComposeText>
      </FilledTonalButton>
    </Host>
  );
}
