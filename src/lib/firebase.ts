import { initializeApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL, uploadBytesResumable, deleteObject, listAll } from 'firebase/storage';
import { getFirestore, collection, getDocs, doc, getDoc, type Timestamp } from 'firebase/firestore/lite';

const prod = {
  apiKey: 'AIzaSyDG2cSWrnZpiiRI_rtbteXWotkljcDKO-U',
  authDomain: 'artdatabanken-2023.firebaseapp.com',
  projectId: 'artdatabanken-2023',
  storageBucket: 'artdatabanken-2023.appspot.com',
  messagingSenderId: '755130876588',
  appId: '1:755130876588:web:ff1adae7ec3b17d1c01509',
};

const dev = {
  apiKey: 'AIzaSyARGHDdkUk65SPDDSc6tgj5jX9rq7FsUYk',
  authDomain: 'artdatabanken-2023-dev.firebaseapp.com',
  projectId: 'artdatabanken-2023-dev',
  storageBucket: 'artdatabanken-2023-dev.appspot.com',
  messagingSenderId: '544182237871',
  appId: '1:544182237871:web:829c6e290800094bdcf25a',
};

export const COLLECTIONS = {
  IMAGES: 'images',
  SPECIES: 'species',
  BUNDLES: 'bundles',
  APPLICATION: 'application',
  DELETED: 'deleted',
} as const;

export const PATHS = { IMAGES: 'images', THUMBNAILS: 'thumbs' } as const;

export const app = initializeApp(import.meta.env.PROD ? prod : dev);
export const storage = getStorage(app);
export const db = getFirestore(app);

/* FILES */

// export const getFileList = (filePath: string): Promise<string[]> => {
//   const listRef = ref(storage, filePath);

//   return listAll(listRef)
//     .then((res) => {
//       return Promise.resolve(res.items.map(({ name }) => name));
//     })
//     .catch((error) => {
//       return Promise.reject(error);
//     });
// };

export const getDownloadURLs = async (filePath: string): Promise<Partial<ImageInfo>[]> => {
  const promises: Promise<Partial<ImageInfo>>[] = [];

  //TODO: Not sure how many items we can fetch per call. Ther seems to be some kind of limit with
  // a pager, see https://firebase.google.com/docs/storage/web/list-files#paginate_list_results.
  const listRef = ref(storage, filePath);
  await listAll(listRef).then((res) =>
    res.items.forEach((itemRef) =>
      promises.push(getDownloadURL(itemRef).then((url) => ({ filename: itemRef.name, URL: url })))
    )
  );

  return Promise.all(promises);
};

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

export const normalizeFilename = (filename: string) => filename.replaceAll(' ', '-').toLowerCase();

export const checkIfImageExistsInDB = async (name: string): Promise<boolean> => {
  const docRef = doc(db, COLLECTIONS.IMAGES, normalizeFilename(name));
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
};

export const deleteFile = async (filename: string, path: string): Promise<void> => {
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
  id: string;
  filename: string;
  URL: string;
  thumbnailURL: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

export type SpeciesInfo = {
  id: string;
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

export async function firestoreFetchDoc<T>(path: string, id: string): Promise<T> {
  const querySnapshot = await getDoc(doc(db, path, id));
  return querySnapshot.data() as T;
}
