import { getStorage, ref, getDownloadURL, listAll, getMetadata as gMd, type FullMetadata } from 'firebase/storage';
import { doc, getDoc } from 'firebase/firestore/lite';
import { db, COLLECTIONS, storage } from './index';

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

/* bucket: "artdatabanken.appspot.com"
cacheControl: undefined
contentDisposition: "inline; filename*=utf-8''DSC02905%20%282%29.JPG"
contentEncoding: "identity"
contentLanguage: undefined
contentType: "image/jpeg"
customMetadata: undefined
fullPath: "images/DSC02905 (2).JPG"
generation: "1689605764954557"
md5Hash: "RqkIuUhCAYzGQSLZpZImYQ=="
metageneration: "1"
name: "DSC02905 (2).JPG"
size: 3328900
timeCreated: "2023-07-17T14:56:04.995Z"
type: "file"
updated: "2023-07-17T14:56:04.995Z" */

export default async function getMetadata(filePath: string): Promise<Partial<FullMetadata>[]> {
  const promises: Promise<Partial<FullMetadata>>[] = [];

  // Not sure how many items we can fetch per call. Ther seems to be some kind of limit with
  // a pager, see https://firebase.google.com/docs/storage/web/list-files#paginate_list_results.
  const listRef = ref(storage, filePath);
  await listAll(listRef).then((res) =>
    res.items.forEach((itemRef) => promises.push(gMd(itemRef).then((metadata) => metadata)))
  );

  return Promise.all(promises);
}

export const checkIfImageExistsInDB = async (name: string): Promise<boolean> => {
  const docRef = doc(db, COLLECTIONS.IMAGES, name /* normalizeFilename(name) */);
  const docSnap = await getDoc(docRef);

  return docSnap.exists();
};
