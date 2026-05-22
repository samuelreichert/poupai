import { type IconName } from '@/constants/icons';

type BaseButtonProps = {
  accessibilityLabel: string;
  active?: boolean;
  buttonStyle?: 'glass' | 'plain';
  label: string;
  onPress?: () => void;
};

export type IconButtonProps = BaseButtonProps & {
  variant: 'icon';
  icon: IconName;
  size?: number;
};

export type TextButtonProps = BaseButtonProps & {
  variant: 'text';
  icon?: IconName;
  fullWidth?: boolean;
};
