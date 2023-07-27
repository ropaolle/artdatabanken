import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { PATHS } from '.';

export default function checkIfFileExists(filePath: string): Promise<boolean> {
  const storage = getStorage();
  const storageRef = ref(storage, filePath);

  return getDownloadURL(storageRef)
    .then(() => {
      return Promise.resolve(true);
    })
    .catch((error) => {
      if (error.code === 'storage/object-not-found') {
        return Promise.resolve(false);
      } else {
        return Promise.reject(error);
      }
    });
}

export const normalizeFilename = (filename: string) => filename.replaceAll(' ', '-').toLowerCase();

export const checkIfImageExists = (filename: string): Promise<boolean> => {
  const filePath = `${PATHS.IMAGES}/${normalizeFilename(filename)}`;
  return checkIfFileExists(filePath);
};
