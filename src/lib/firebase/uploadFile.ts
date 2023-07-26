import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { storage } from './index';

const canvasToBlob = async (ref: HTMLCanvasElement): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    ref.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Failed to create blob'));
        return;
      }
      resolve(blob);
    }, 'image/jpeg');
  });
};

export default async function uploadFile(
  canvasRef: HTMLCanvasElement,
  path: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  const blob = await canvasToBlob(canvasRef);
  // Image size is stored in blob.size
  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, blob);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        typeof onProgress === 'function' && onProgress(progress);
      },
      (error) => {
        reject(error);
      },
      async () => {
        // const metadata = await getMetadata(uploadTask.snapshot.ref)
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
}
