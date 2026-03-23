import { StyleSheet, Text, TextInput, View } from 'react-native';

import { useSettings } from '../context/settings-context';

interface NumberFieldProps {
  error?: string;
  label: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  testID: string;
  unit?: string;
  value: string;
}

export function NumberField({
  error,
  label,
  onChangeText,
  placeholder,
  testID,
  unit,
  value,
}: NumberFieldProps) {
  const { activeTheme } = useSettings();

  return (
    <View style={styles.wrapper}>
      <Text
        style={[
          styles.label,
          {
            color: activeTheme.colors.text,
            fontFamily: activeTheme.fonts.medium,
          },
        ]}
      >
        {label}
      </Text>
      <View
        style={[
          styles.inputRow,
          {
            backgroundColor: activeTheme.colors.input,
            borderColor: error ? activeTheme.colors.error : activeTheme.colors.border,
          },
        ]}
      >
        <TextInput
          keyboardType="decimal-pad"
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={activeTheme.name === 'dark' ? 'rgba(162,178,180,0.4)' : 'rgba(180,165,155,0.5)'}
          selectionColor={activeTheme.colors.primary}
          style={[
            styles.input,
            {
              color: activeTheme.colors.text,
              fontFamily: activeTheme.fonts.medium,
            },
          ]}
          testID={testID}
          value={value}
        />
        {unit ? (
          <Text
            style={[
              styles.unit,
              {
                color: activeTheme.colors.mutedText,
                fontFamily: activeTheme.fonts.medium,
              },
            ]}
          >
            {unit}
          </Text>
        ) : null}
      </View>
      {error ? (
        <Text
          style={[
            styles.error,
            {
              color: activeTheme.colors.error,
              fontFamily: activeTheme.fonts.body,
            },
          ]}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  label: {
    fontSize: 15,
  },
  inputRow: {
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  input: {
    flex: 1,
    fontSize: 18,
  },
  unit: {
    fontSize: 15,
    marginLeft: 6,
  },
  error: {
    fontSize: 13,
    lineHeight: 18,
  },
});
