import { collection, getDocs, doc, getDoc, type Timestamp } from 'firebase/firestore/lite';
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
