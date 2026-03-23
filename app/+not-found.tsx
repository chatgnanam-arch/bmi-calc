import { useRouter } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { useSettings } from '../src/context/settings-context';
import { ActionButton } from '../src/components/action-button';
import { HeadingBlock } from '../src/components/heading-block';
import { ScreenContainer } from '../src/components/screen-container';
import { SurfaceCard } from '../src/components/surface-card';

export default function NotFoundScreen() {
  const router = useRouter();
  const { activeTheme } = useSettings();

  return (
    <ScreenContainer>
      <HeadingBlock
        eyebrow="Not found"
        subtitle="That route does not exist in this app yet."
        title="Lost in the garden"
      />
      <SurfaceCard style={styles.card}>
        <Text
          style={[
            styles.copy,
            {
              color: activeTheme.colors.text,
              fontFamily: activeTheme.fonts.body,
            },
          ]}
        >
          Head back to the calculator and continue from there.
        </Text>
        <ActionButton
          icon="home"
          label="Return home"
          onPress={() => router.replace('/')}
        />
      </SurfaceCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 18,
  },
  copy: {
    fontSize: 16,
    lineHeight: 24,
  },
});
