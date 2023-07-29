import { type Timestamp } from 'firebase/firestore/lite';
import { createCompareFn, type SortProps } from './compareFunction';
import { saveToFile } from './saveToFile';

export const timestampToString = (timestamp?: Timestamp) => timestamp?.toDate().toLocaleString() || '';

export const mergeArrayOfObjects = <T extends { id: string }>(list: T[], newItems: T[]) => {
  list = [...list];

  for (const item of newItems) {
    const index = list.findIndex(({ id }) => item.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...item };
    } else {
      list.push(item);
    }
  }

  return list;
};

export { createCompareFn, SortProps, saveToFile };
