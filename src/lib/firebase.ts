import { initializeApp } from 'firebase/app';
import { getStorage, ref, listAll } from 'firebase/storage';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

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

// export const checkIfFileExists = (filePath: string): Promise<boolean> => {
//   const storageRef = ref(storage, filePath);

//   return getDownloadURL(storageRef)
//     .then((url) => {
//       return Promise.resolve(true);
//     })
//     .catch((error) => {
//       console.log('error', error);
//       if (error.code === 'storage/object-not-found') {
//         return Promise.resolve(false);
//       } else {
//         return Promise.reject(error);
//       }
//     });
// };

export const getFiles = (filePath: string): Promise<string[]> => {
  const listRef = ref(storage, filePath);

  return listAll(listRef)
    .then((res) => {
      // All the prefixes under listRef. You may call listAll() recursively on them.
      /* res.prefixes.forEach((folderRef) => {
        console.log('folderRef', folderRef);
      }); */

      // All the items under listRef.
      // res.items.forEach((itemRef) => {
      //   console.log('itemRef', itemRef);
      // });

      return Promise.resolve(res.items.map(({ name }) => name));
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export const getImages = async (): any => {
  // const q = query(collection(db, 'cities'), where('capital', '==', true));
  // const querySnapshot = await getDocs(q);

  const querySnapshot = await getDocs(collection(db, 'images'));

  return querySnapshot.docs.map(doc => doc.data())
  console.log('querySnapshot', querySnapshot);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, ' => ', {...doc.data()});
  });
};

// import { collection, query, where, getDocs } from 'firebase/firestore';
