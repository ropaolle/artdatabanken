import { initializeApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL, uploadBytesResumable, deleteObject } from 'firebase/storage';
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

// PAPPA
// const firebaseConfig = {
//   apiKey: "AIzaSyAtNXWmXp1afYAGQ51aXdyCR4WRc42ViN4",
//   authDomain: "artdatabanken.firebaseapp.com",
//   databaseURL: "https://artdatabanken.firebaseio.com",
//   projectId: "artdatabanken",
//   storageBucket: "artdatabanken.appspot.com",
//   messagingSenderId: "495647184718",
//   appId: "1:495647184718:web:67ae3c56aeeeacf93af01f",
//   measurementId: "G-NBMHCY9EPV"
// };

export const IMAGE_COLLECTION = 'bilder';
export const SPECIES_COLLECTION = 'arter';

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);

export const getURL = async (filePath: string): Promise<string> => {
  const storage = getStorage();
  const storageRef = ref(storage, filePath);

  return new Promise((resolve, reject) => {
    getDownloadURL(storageRef)
      .then((url) => {
        resolve(url);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

/* FILES */

export const normalizeFilename = (filename: string) => filename.replaceAll(' ', '-').toLowerCase();

export const checkIfImageExistsInDB = async (name: string): Promise<boolean> => {
  const docRef = doc(db, IMAGE_COLLECTION, normalizeFilename(name));
  const docSnap = await getDoc(docRef);

  return docSnap.exists();
};

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

export const uploadFile = async (
  canvasRef: HTMLCanvasElement,
  path: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const blob = await canvasToBlob(canvasRef);
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
        resolve(await getDownloadURL(uploadTask.snapshot.ref));
      }
    );
  });
};

export const deleteFile = async (filename: string, path = IMAGE_COLLECTION): Promise<void> => {
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
};

/* DATABASE */

export type ImageInfo = {
  filename: string;
  thumbnail: string;
  URL: string;
  thumbnailURL: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

export type SpeciesInfo = {
  id?: string;
  kingdom: string;
  order: string;
  family: string;
  species: string;
  sex: string;
  county: string;
  place: string;
  speciesLatin: string;
  date: string;
  image: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

export async function firestoreFetch<T>(path: string): Promise<T[]> {
  const querySnapshot = await getDocs(collection(db, path));

  return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as T));
}
