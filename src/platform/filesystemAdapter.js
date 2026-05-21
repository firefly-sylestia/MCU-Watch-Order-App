import { Filesystem, Directory } from '@capacitor/filesystem';

export async function writeDocumentsFile(path, data, recursive = true) {
  return Filesystem.writeFile({ path, data, directory: Directory.Documents, recursive });
}

export async function writeExternalFile(path, data, recursive = true) {
  return Filesystem.writeFile({ path, data, directory: Directory.ExternalStorage, recursive });
}
