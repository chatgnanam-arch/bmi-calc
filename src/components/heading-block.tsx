import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useSettings } from '../context/settings-context';

interface HeadingBlockProps {
  action?: ReactNode;
  eyebrow: string;
  subtitle?: string;
  title: string;
}

export function HeadingBlock({
  action,
  eyebrow,
  subtitle,
  title,
}: HeadingBlockProps) {
  const { activeTheme } = useSettings();

  return (
    <View style={styles.wrapper}>
      <View style={styles.copy}>
        <View
          style={[
            styles.eyebrowChip,
            {
              backgroundColor: activeTheme.colors.surfaceStrong,
              borderColor: activeTheme.colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.eyebrow,
              {
                color: activeTheme.colors.primaryStrong,
                fontFamily: activeTheme.fonts.strong,
              },
            ]}
          >
            {eyebrow}
          </Text>
        </View>
        <Text
          style={[
            styles.title,
            {
              color: activeTheme.colors.text,
              fontFamily: activeTheme.fonts.display,
            },
          ]}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={[
              styles.subtitle,
              {
                color: activeTheme.colors.mutedText,
                fontFamily: activeTheme.fonts.body,
              },
            ]}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 14,
    marginBottom: 20,
  },
  copy: {
    flex: 1,
    gap: 8,
  },
  eyebrowChip: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 28,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
});
