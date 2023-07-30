import { type StorageValue } from 'zustand/middleware';
import { Timestamp } from 'firebase/firestore/lite';
import { type GlobalState } from '.';

const toTimestamp = (item: { seconds: number; nanoseconds: number } | undefined) =>
  item && new Timestamp(item.seconds, item.nanoseconds);

const objectToTimestamp = <T extends { createdAt?: Timestamp; updatedAt?: Timestamp }>(item: T) => ({
  ...item,
  updatedAt: toTimestamp(item.updatedAt),
  createdAt: toTimestamp(item.createdAt),
});

export const customStorage = {
  getItem: (key: string): StorageValue<GlobalState> => {
    const str = localStorage.getItem(key);
    const { state, version }: { state: GlobalState; version: number } = JSON.parse(str || '');
    const { images, species, fullUpdateFetchedAt } = state;
    return {
      state: {
        ...state,
        images: images.map((image) => objectToTimestamp(image)),
        species: species.map((species) => objectToTimestamp(species)),
        fullUpdateFetchedAt: toTimestamp(fullUpdateFetchedAt),
      },
      version,
    };
  },
  setItem: (key: string, newValue: StorageValue<GlobalState>): void => {
    localStorage.setItem(key, JSON.stringify(newValue));
  },
  removeItem: (key: string): void => {
    localStorage.removeItem(key);
  },
};
