import { useCallback } from 'react';

// Web stub — AdMob interstitials only run on native (Android/iOS).
export function useInterstitialAd() {
  const showOrContinue = useCallback((onContinue: () => void) => {
    onContinue();
  }, []);

  return { showOrContinue };
}
