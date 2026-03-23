import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

import { useSettings } from '../context/settings-context';

interface RoundIconButtonProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
}

export function RoundIconButton({ icon, onPress }: RoundIconButtonProps) {
  const { activeTheme } = useSettings();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: activeTheme.colors.surface,
          borderColor: activeTheme.colors.border,
        },
        pressed ? styles.pressed : null,
      ]}
    >
      <MaterialIcons color={activeTheme.colors.text} name={icon} size={22} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  pressed: {
    transform: [{ scale: 0.96 }],
  },
});
