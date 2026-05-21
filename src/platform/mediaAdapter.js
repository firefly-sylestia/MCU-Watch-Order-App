import { Media } from '@capacitor-community/media';

export async function savePhotoToAlbum({ dataUri, albumName, fileName }) {
  try { await Media.createAlbum({ name: albumName }); } catch {}
  const albums = await Media.getAlbums();
  const album = (albums?.albums || []).find((a) => a.name === albumName);
  if (!album?.identifier) return false;
  await Media.savePhoto({ path: dataUri, albumIdentifier: album.identifier, fileName });
  return true;
}
