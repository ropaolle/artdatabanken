import { initializeApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL, listAll } from 'firebase/storage';

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

export const checkIfFileExists = (filePath: string): Promise<boolean> => {
  const storageRef = ref(storage, filePath);

  return getDownloadURL(storageRef)
    .then((url) => {
      return Promise.resolve(true);
    })
    .catch((error) => {
      console.log('error', error);
      if (error.code === 'storage/object-not-found') {
        return Promise.resolve(false);
      } else {
        return Promise.reject(error);
      }
    });
};

export const listAllFiles = (filePath: string) => {
  const listRef = ref(storage, filePath);

  listAll(listRef)
    .then((res) => {
      // All the prefixes under listRef. You may call listAll() recursively on them.
      res.prefixes.forEach((folderRef) => {
        console.log('folderRef', folderRef);
      });

      // All the items under listRef.
      res.items.forEach((itemRef) => {
        console.log('itemRef', itemRef.name);
      });
    })
    .catch((error) => {
      // Uh-oh, an error occurred!
    });
};
