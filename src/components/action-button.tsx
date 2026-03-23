import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useSettings } from '../context/settings-context';
import type { AppTheme } from '../theme/theme';

type ActionButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ActionButtonProps {
  disabled?: boolean;
  icon?: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
  testID?: string;
  variant?: ActionButtonVariant;
}

export function ActionButton({
  disabled,
  icon,
  label,
  onPress,
  testID,
  variant = 'primary',
}: ActionButtonProps) {
  const { activeTheme } = useSettings();
  const variantStyle = getVariantStyle(variant, activeTheme);

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variantStyle.button,
        disabled ? styles.disabled : null,
        pressed && !disabled ? styles.pressed : null,
      ]}
      testID={testID}
    >
      <View style={styles.content}>
        {icon ? (
          <MaterialIcons color={variantStyle.text.color} name={icon} size={18} />
        ) : null}
        <Text style={[styles.label, variantStyle.text]}>{label}</Text>
      </View>
    </Pressable>
  );
}

function getVariantStyle(variant: ActionButtonVariant, theme: AppTheme) {
  switch (variant) {
    case 'secondary':
      return {
        button: {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderWidth: 1,
        },
        text: {
          color: theme.colors.text,
          fontFamily: theme.fonts.strong,
        },
      };
    case 'ghost':
      return {
        button: {
          backgroundColor: 'transparent',
          borderColor: theme.colors.border,
          borderWidth: 0,
        },
        text: {
          color: theme.colors.primaryStrong,
          fontFamily: theme.fonts.strong,
        },
      };
    case 'primary':
    default:
      return {
        button: {
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.primary,
          borderWidth: 1,
        },
        text: {
          color: theme.colors.onPrimary,
          fontFamily: theme.fonts.strong,
        },
      };
  }
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 18,
    justifyContent: 'center',
    minHeight: 54,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    transform: [{ scale: 0.985 }],
  },
});
