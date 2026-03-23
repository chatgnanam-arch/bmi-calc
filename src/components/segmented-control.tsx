import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useSettings } from '../context/settings-context';

interface SegmentedOption<T extends string> {
  label: string;
  value: T;
}

interface SegmentedControlProps<T extends string> {
  onChange: (value: T) => void;
  options: readonly SegmentedOption<T>[];
  testID?: string;
  value: T;
}

export function SegmentedControl<T extends string>({
  onChange,
  options,
  testID,
  value,
}: SegmentedControlProps<T>) {
  const { activeTheme } = useSettings();

  return (
    <View
      style={[
        styles.shell,
        {
          backgroundColor: activeTheme.colors.surfaceStrong,
          borderColor: activeTheme.colors.border,
        },
      ]}
      testID={testID}
    >
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <Pressable
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[
              styles.option,
              selected
                ? {
                    backgroundColor: activeTheme.colors.primary,
                  }
                : null,
            ]}
          >
            <Text
              style={[
                styles.label,
                {
                  color: selected
                    ? activeTheme.colors.onPrimary
                    : activeTheme.colors.mutedText,
                  fontFamily: selected
                    ? activeTheme.fonts.strong
                    : activeTheme.fonts.medium,
                },
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    padding: 4,
  },
  option: {
    alignItems: 'center',
    borderRadius: 999,
    flex: 1,
    paddingVertical: 12,
  },
  label: {
    fontSize: 15,
  },
});
