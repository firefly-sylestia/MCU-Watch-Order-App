import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { RhythmBridge, canUseRhythmBridge } from '../native/rhythmBridge';

export const useAndroidNativeMode = () => {
  useEffect(() => {
    const root = document.documentElement;
    const isNativeAndroid = Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';
    const platform = Capacitor.getPlatform();

    root.classList.toggle('android-native', isNativeAndroid);
    document.body.classList.toggle('android-native', isNativeAndroid);
    root.dataset.platform = platform;
    root.dataset.native = String(Capacitor.isNativePlatform());

    if (canUseRhythmBridge()) {
      RhythmBridge.getRuntime()
        .then((runtime) => {
          root.dataset.appSystem = runtime?.system || 'Rhythm Material 3 Expressive';
          root.style.setProperty('--native-system', `'${runtime?.system || 'Rhythm'}'`);
        })
        .catch(() => {
          root.dataset.appSystem = 'Rhythm Material 3 Expressive';
        });
    }

    return () => {
      root.classList.remove('android-native');
      document.body.classList.remove('android-native');
      delete root.dataset.platform;
      delete root.dataset.native;
      delete root.dataset.appSystem;
      root.style.removeProperty('--native-system');
    };
  }, []);
};
