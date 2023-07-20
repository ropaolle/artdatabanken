import { type Timestamp } from 'firebase/firestore/lite';
import { createCompareFn, type SortProps } from './compareFunction';

export const timestampToString = (timestamp?: Timestamp) => timestamp?.toDate().toLocaleString() || '';

export { createCompareFn, SortProps };
