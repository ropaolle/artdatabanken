import { collection, getDocs, doc, getDoc } from 'firebase/firestore/lite';
import { db } from '.';

export const COLLECTIONS = {
  IMAGES: 'images',
  SPECIES: 'species',
  APPLICATION: 'application',
} as const;

export const DOCS = {
  BUNDLES: 'bundles',
  DELETED: 'deleted',
  UPDATEDAT: 'updatedAt',
} as const;

export async function firestoreFetch<T>(path: string): Promise<T[]> {
  const querySnapshot = await getDocs(collection(db, path));
  return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as T));
}

export async function firestoreFetchDoc<T>(path: string, id: string): Promise<T> {
  const querySnapshot = await getDoc(doc(db, path, id));
  return querySnapshot.data() as T;
}
