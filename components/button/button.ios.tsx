import { Button as SwiftButton, Host } from '@expo/ui/swift-ui';
import {
  buttonStyle as styleModifier,
  clipShape,
  frame,
  labelStyle,
  tint,
} from '@expo/ui/swift-ui/modifiers';

import { DEFAULT_SIZE } from '@/components/button/constants';
import { IconButtonProps, TextButtonProps } from '@/components/button/types';
import { sfIcons } from '@/constants/icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export type ButtonProps = IconButtonProps | TextButtonProps;

export function Button(props: ButtonProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const iconColor = props.active ? colors.primary : colors.on_surface;
  const buttonStyle = props.buttonStyle ?? 'glass';

  if (props.variant === 'icon') {
    const size = props.size ?? DEFAULT_SIZE;

    return (
      <Host style={{ width: size, height: size }}>
        <SwiftButton
          label={props.label}
          onPress={props.onPress}
          systemImage={sfIcons[props.icon]}
          modifiers={[
            styleModifier(buttonStyle),
            clipShape('circle'),
            frame({ width: size, height: size }),
            labelStyle('iconOnly'),
            tint(iconColor),
          ]}
        />
      </Host>
    );
  }

  const textButtonHeight = 44;
  const textButtonWidth = props.fullWidth ? '100%' : 180;

  return (
    <Host style={{ width: textButtonWidth, height: textButtonHeight }}>
      <SwiftButton
        onPress={props.onPress}
        label={props.label}
        systemImage={props.icon ? sfIcons[props.icon] : undefined}
        modifiers={[
          styleModifier(buttonStyle),
          tint(iconColor),
          ...(props.icon ? [labelStyle('titleAndIcon')] : []),
        ]}
      />
    </Host>
  );
}
