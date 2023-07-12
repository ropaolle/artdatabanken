import { Timestamp } from 'firebase/firestore';
import { useDebounceEffect } from './useDebounceEffect';
import { drawImageOnCanvas } from './canvas';
import { type ImageInfo, type SpeciesInfo } from './firebase.ts';

export const timestampToString = (timestamp: Timestamp | undefined) =>
  timestamp ? timestamp.toDate().toISOString().substring(0, 19).replace('T', ' ') : '';

// Locale storage

const localStorageOptions = { raw: false, serializer: JSON.stringify, deserializer: JSON.parse };

const firebaseDeserializer = <T,>(value: string): T => {
  const object = JSON.parse(value);

  for (const record of object) {
    if (record.createdAt) {
      record.createdAt = new Timestamp(record.createdAt.seconds, record.createdAt.nanoseconds);
    }
    if (record.updatedAt) {
      record.updatedAt = new Timestamp(record.updatedAt.seconds, record.updatedAt.nanoseconds);
    }
  }

  return object;
};

export const localStorageSpeciesOptions = { ...localStorageOptions, deserializer: firebaseDeserializer<SpeciesInfo[]> };
export const localStorageImagesOptions = { ...localStorageOptions, deserializer: firebaseDeserializer<ImageInfo[]> };

// Locale string sort on objects of string values
export function createSortFunc<T>({ column, ascending = true }: { column: string; ascending: boolean }) {
  const localeSort = (a: T, b: T) => {
    const itemA = a[column as keyof T];
    const itemB = b[column as keyof T];
    const order = ascending ? -1 : 1;

    if (typeof itemA !== 'string' || typeof itemB !== 'string') return 0;

    return itemA.localeCompare(itemB, 'sv', { sensitivity: 'base' }) * order;
  };

  return localeSort;
}

export { useDebounceEffect, drawImageOnCanvas };
