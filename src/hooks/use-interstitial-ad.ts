import { useCallback, useEffect, useRef } from 'react';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import { Platform } from 'react-native';

// Replace with your real Interstitial Ad Unit ID before publishing.
// Get it from: https://apps.admob.com
const INTERSTITIAL_AD_UNIT_ID = __DEV__
  ? TestIds.INTERSTITIAL
  : Platform.select({
      android: 'ca-app-pub-8522218237638794/7393397794', // TODO: replace
      ios: 'ca-app-pub-8522218237638794/7393397794',     // TODO: replace
    }) ?? TestIds.INTERSTITIAL;

// Show an interstitial every N recalculations — not on every tap.
const SHOW_EVERY_N = 3;

export function useInterstitialAd() {
  const interstitial = useRef(InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID));
  const isLoaded = useRef(false);
  const pressCount = useRef(0);

  useEffect(() => {
    const ad = interstitial.current;

    const unsubscribeLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
      isLoaded.current = true;
    });

    const unsubscribeClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      isLoaded.current = false;
      ad.load();
    });

    const unsubscribeError = ad.addAdEventListener(AdEventType.ERROR, () => {
      isLoaded.current = false;
    });

    ad.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeError();
    };
  }, []);

  const showOrContinue = useCallback((onContinue: () => void) => {
    pressCount.current += 1;

    if (pressCount.current % SHOW_EVERY_N === 0 && isLoaded.current) {
      const ad = interstitial.current;
      const unsub = ad.addAdEventListener(AdEventType.CLOSED, () => {
        unsub();
        onContinue();
      });
      ad.show();
    } else {
      onContinue();
    }
  }, []);

  return { showOrContinue };
}
