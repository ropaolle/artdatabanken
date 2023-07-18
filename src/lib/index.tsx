import { Timestamp } from 'firebase/firestore/lite';
import { useDebounceEffect } from './useDebounceEffect';
import { drawImageOnCanvas } from './canvas';

export const timestampToString = (timestamp?: Timestamp) =>
  timestamp ? timestamp.toDate().toISOString().substring(0, 19).replace('T', ' ') : '';

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
