import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

export const useAndroidNativeMode = () => {
  useEffect(() => {
    const root = document.documentElement;
    const isNativeAndroid = Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';

    root.classList.toggle('android-native', isNativeAndroid);
    document.body.classList.toggle('android-native', isNativeAndroid);

    return () => {
      root.classList.remove('android-native');
      document.body.classList.remove('android-native');
    };
  }, []);
};
