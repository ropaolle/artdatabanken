import { initializeApp } from 'firebase/app';
import { getStorage, ref, listAll, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  type Timestamp,
  DocumentData,
} from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDG2cSWrnZpiiRI_rtbteXWotkljcDKO-U',
  authDomain: 'artdatabanken-2023.firebaseapp.com',
  projectId: 'artdatabanken-2023',
  storageBucket: 'artdatabanken-2023.appspot.com',
  messagingSenderId: '755130876588',
  appId: '1:755130876588:web:ff1adae7ec3b17d1c01509',
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);

export const checkIfFileExists = async (filePath: string): Promise<string | boolean> => {
  const storage = getStorage();
  const storageRef = ref(storage, filePath);

  return new Promise((resolve, reject) => {
    getDownloadURL(storageRef)
      .then((url) => {
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

export const getImageInfo = async (): Promise<DocumentData[]> => {
  const querySnapshot = await getDocs(collection(db, 'images'));
  return querySnapshot.docs.map((doc) => doc.data());
};

/* export const getImageFilenames = async (): Promise<string[]> => {
  // const q = query(collection(db, 'cities'), where('capital', '==', true));
  // const querySnapshot = await getDocs(q);

  const querySnapshot = await getDocs(collection(db, 'images'));

  // return querySnapshot.docs.map((doc) => doc.data());
  // console.log('querySnapshot', querySnapshot);
  const images: string[] = [];
  querySnapshot.forEach((doc) => {
    const { filename } = doc.data();
    images.push(filename);
    // doc.data() is never undefined for query doc snapshots

    // console.log(doc.id, ' => ', { ...doc.data() });
  });

  return images;
}; */
