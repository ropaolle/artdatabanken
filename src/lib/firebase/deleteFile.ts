import { ref, deleteObject } from 'firebase/storage';
import { storage } from './index';

export default async function deleteFile(filename: string, path: string): Promise<void> {
  const fileRef = ref(storage, `${path}/${filename}`);

  return new Promise((resolve, reject) => {
    deleteObject(fileRef)
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}
