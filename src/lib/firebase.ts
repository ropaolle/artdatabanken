import { initializeApp } from 'firebase/app';
import { getStorage, ref, listAll, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { getFirestore, collection, getDocs, doc, getDoc, type Timestamp } from 'firebase/firestore';

// PROD
// const firebaseConfig = {
//   apiKey: 'AIzaSyDG2cSWrnZpiiRI_rtbteXWotkljcDKO-U',
//   authDomain: 'artdatabanken-2023.firebaseapp.com',
//   projectId: 'artdatabanken-2023',
//   storageBucket: 'artdatabanken-2023.appspot.com',
//   messagingSenderId: '755130876588',
//   appId: '1:755130876588:web:ff1adae7ec3b17d1c01509',
// };

// DEV
const firebaseConfig = {
  apiKey: 'AIzaSyARGHDdkUk65SPDDSc6tgj5jX9rq7FsUYk',
  authDomain: 'artdatabanken-2023-dev.firebaseapp.com',
  projectId: 'artdatabanken-2023-dev',
  storageBucket: 'artdatabanken-2023-dev.appspot.com',
  messagingSenderId: '544182237871',
  appId: '1:544182237871:web:829c6e290800094bdcf25a',
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);

export const checkIfFileExists = async (filePath: string): Promise<string | boolean> => {
  const storage = getStorage();
  const storageRef = ref(storage, filePath);

  return new Promise((resolve, reject) => {
    getDownloadURL(storageRef)
      .then((/* url */) => {
        resolve(true);
      })
      .catch((error) => {
        if (error.code === 'storage/object-not-found') {
          resolve(false);
        } else {
          reject(error);
        }
      });
  });
};

export const checkIfImageExistsInDB = async (name: string): Promise<boolean> => {
  const docRef = doc(db, 'images', name);
  const docSnap = await getDoc(docRef);

  return docSnap.exists();
};

export const canvasToBlob = async (ref: HTMLCanvasElement): Promise<Blob> => {
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

export const uploadFile = async (blob: Blob, path: string, onProgress: (progress: number) => void): Promise<string> => {
  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, blob);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        onProgress(progress);
      },
      (error) => {
        reject(error);
      },
      async () => {
        resolve(await getDownloadURL(uploadTask.snapshot.ref));
      }
    );
  });
};

/**
 *
 * @param filePath Firebase storage folder
 * @returns Array of filenames
 *
 * Note: res.prefixes returns all the prefixes under listRef. You may call listAll() recursively on them.
 */
export const getFileList = (filePath: string): Promise<string[]> => {
  const listRef = ref(storage, filePath);

  return listAll(listRef)
    .then((res) => {
      return Promise.resolve(res.items.map(({ name }) => name));
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export type ImageInfo = {
  filename: string;
  downloadURL: string;
  updatedAt: Timestamp;
};

export const getImageInfo = async (): Promise<ImageInfo[]> => {
  const querySnapshot = await getDocs(collection(db, 'images'));
  return querySnapshot.docs.map((doc) => doc.data() as ImageInfo);
  // return querySnapshot.docs.map((doc) => {
  //   const { filename, downloadURL, updatedAt } = doc.data();
  //   return { filename, downloadURL, updatedAt: updatedAt.toDate() };
  // });
};

export type SpeciesInfo = {
  species: string;
  updatedAt: Timestamp;
};

export const getSpeciesInfo = async (): Promise<SpeciesInfo[]> => {
  const querySnapshot = await getDocs(collection(db, 'species'));
  return querySnapshot.docs.map((doc) => doc.data() as SpeciesInfo);
};
