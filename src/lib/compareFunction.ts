import { type Timestamp } from 'firebase/firestore/lite';

export type SortProps<T> = {
  property: keyof T;
  order: 'asc' | 'desc';
};

type Props = string | Timestamp | undefined;

type Properties = {
  [key: string]: Props;
  createdAt?: Timestamp | undefined;
  updatedAt?: Timestamp | undefined;
};

export function createCompareFn<T extends Properties>({ property, order = 'asc' }: SortProps<T>) {
  const localeSort = (a: T, b: T) => {
    let itemA: Props = a[property];
    let itemB: Props = b[property];
    const sortOrder = order === 'asc' ? 1 : -1;

    // Convert Timestamp to string
    if (property === 'updatedAt' && a.updatedAt && b.updatedAt) {
      itemA = a.updatedAt.toDate().toLocaleString();
      itemB = b.updatedAt.toDate().toLocaleString();
    }

    // Locale string sort
    if (typeof itemA === 'string' && typeof itemB === 'string') {
      return itemA.localeCompare(itemB as string, 'sv', { sensitivity: 'base' }) * sortOrder;
    }

    // Locale string sort
    if (typeof itemA === 'number' && typeof itemB === 'number') {
      return (itemA - itemB) * sortOrder;
    }

    return 0;
  };

  return localeSort;
}
