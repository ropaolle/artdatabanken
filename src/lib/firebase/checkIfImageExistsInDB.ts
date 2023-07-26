import { doc, getDoc } from 'firebase/firestore/lite';
import { db, COLLECTIONS } from './index';

export const normalizeFilename = (filename: string) => filename.replaceAll(' ', '-').toLowerCase();

export const checkIfImageExistsInDB = async (name: string): Promise<boolean> => {
  const docRef = doc(db, COLLECTIONS.IMAGES, normalizeFilename(name));
  const docSnap = await getDoc(docRef);

  return docSnap.exists();
};
