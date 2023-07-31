import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore/lite';
import uploadFile from './uploadFile';
import { checkIfImageExists, normalizeFilename } from './checkIfFileExists';
import deleteFile from './deleteFile';
import getDownloadURLs from './getDownloadURLs';
import deleteCollection from './deleteCollection';
import { firestoreFetch, firestoreFetchDoc, COLLECTIONS, DOCS } from './firestore';

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

export const app = initializeApp(import.meta.env.PROD ? prod : dev);
export const storage = getStorage(app);
export const db = getFirestore(app);

// Storage
export const PATHS = { IMAGES: 'images', THUMBNAILS: 'thumbs' } as const;
export { uploadFile, checkIfImageExists, normalizeFilename, deleteFile, getDownloadURLs };

// Database
export { firestoreFetch, firestoreFetchDoc, COLLECTIONS, DOCS, deleteCollection };
