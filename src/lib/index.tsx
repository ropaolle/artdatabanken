import { useDebounceEffect } from './useDebounceEffect';
import { drawImageOnCanvas } from './canvas';

export type Options = {
  value: string;
  label: string;
};

export const toOptions = (options: Options[]) =>
  options.map(({ value, label }) => (
    <option key={value} value={value}>
      {label}
    </option>
  ));

export const toDatalistOptions = (items: string[] | Set<string>) =>
  Array.from(items).map((option, i) => <option key={i}>{option}</option>);

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
