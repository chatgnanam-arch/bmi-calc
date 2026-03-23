import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { Platform, StyleSheet, View } from 'react-native';

// Replace with your real Ad Unit IDs before publishing.
// Get them from: https://apps.admob.com
const BANNER_AD_UNIT_ID = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : Platform.select({
      android: 'ca-app-pub-8522218237638794/1734444250', // TODO: replace
      ios: 'ca-app-pub-8522218237638794/1734444250',     // TODO: replace
    }) ?? TestIds.ADAPTIVE_BANNER;

interface AdBannerProps {
  onAdLoaded?: () => void;
}

export function AdBanner({ onAdLoaded }: AdBannerProps) {
  return (
    <View style={styles.wrapper}>
      <BannerAd
        requestOptions={{ requestNonPersonalizedAdsOnly: false }}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        unitId={BANNER_AD_UNIT_ID}
        onAdLoaded={onAdLoaded}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
});
