import { Share } from '@capacitor/share';

export async function shareContent(payload) {
  try {
    return await Share.share(payload);
  } catch {
    return null;
  }
}
