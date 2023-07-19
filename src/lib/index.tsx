import { Timestamp } from 'firebase/firestore/lite';
import { useDebounceEffect } from './useDebounceEffect';
import { drawImageOnCanvas } from './canvas';
// import { type ImageInfo, type SpeciesInfo } from './firebase';

export const timestampToString = (timestamp?: Timestamp) =>
  timestamp ? timestamp.toDate().toISOString().substring(0, 19).replace('T', ' ') : '';

// Locale string sort on objects of string values
// TODO: Messy, should be reconstructed with som kind of condition who makes TypeScript to
// define or infer the type of a[column]/b[column].

export type SortProp<T> = {
  column: keyof T;
  order: 'asc' | 'desc';
};

export function createSortFunc<T>({ column, order = 'asc' }: SortProp<T>) {
  const localeSort = (a: T, b: T) => {
    let itemA = a[column] as unknown;
    let itemB = b[column] as unknown;
    const sortOrder = order === 'asc' ? -1 : 1;

    if (itemA instanceof Timestamp && itemB instanceof Timestamp) {
      itemA = itemA.toDate().toLocaleString();
      itemB = itemB.toDate().toLocaleString();
    }

    if (typeof itemA === 'string' && typeof itemB === 'string') {
      return itemA.localeCompare(itemB, 'sv', { sensitivity: 'base' }) * sortOrder;
    }

    return 0;
  };

  return localeSort;
}

export { useDebounceEffect, drawImageOnCanvas };
