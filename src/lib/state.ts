import { create } from 'zustand';
import { /* devtools, */ persist, type StorageValue } from 'zustand/middleware';
import { Timestamp } from 'firebase/firestore/lite';
import { type SpeciesInfo, type ImageInfo } from './firebase';
import { type User } from './auth';

type GlobalState = {
  initGlobalState: (images: ImageInfo[], species: SpeciesInfo[], updatedAt?: Timestamp) => void;
  globalStateFetchedAt?: Timestamp;
  user: User | null;
  setUser: (user: User | null) => void;
  images: ImageInfo[];
  // TODO: rename to addOrUpdateImage
  setImage: (images: ImageInfo) => void;
  deleteImage: (filename: string) => void;
  species: SpeciesInfo[];
  // TODO: rename to addOrUpdateSpecies
  setSpecies: (species: SpeciesInfo) => void;
  deleteSpecies: (id: string) => void;
};

const toTimestamp = (item: { seconds: number; nanoseconds: number } | undefined) =>
  item && new Timestamp(item.seconds, item.nanoseconds);

const objectToTimestamp = <T extends { createdAt?: Timestamp; updatedAt?: Timestamp }>(item: T) => ({
  ...item,
  updatedAt: toTimestamp(item.updatedAt),
  createdAt: toTimestamp(item.createdAt),
});

const customStorage = {
  getItem: (key: string): StorageValue<GlobalState> => {
    const str = localStorage.getItem(key);
    const { state, version }: { state: GlobalState; version: number } = JSON.parse(str || '');
    const { images, species, globalStateFetchedAt } = state;
    return {
      state: {
        ...state,
        images: images.map((image) => objectToTimestamp(image)),
        species: species.map((species: SpeciesInfo) => objectToTimestamp(species)),
        globalStateFetchedAt: toTimestamp(globalStateFetchedAt),
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

export const useAppStore = create<GlobalState>()(
  // devtools(
  persist<GlobalState>(
    (set) => ({
      initGlobalState: (images, species, globalStateFetchedAt) =>
        set(() => ({
          images,
          species,
          globalStateFetchedAt,
        })),

      user: null,
      setUser: (user) => set(() => ({ user })),

      images: [],
      setImage: (image) =>
        set((state) => {
          // Add
          const imageIndex = state.images.findIndex(({ filename }) => image.filename === filename);
          if (imageIndex === -1) {
            return { ...state, images: [...state.images, image] };
          }
          // Update
          const newImages = [...state.images];
          newImages[imageIndex] = { ...newImages[imageIndex], ...image };
          return { ...state, images: newImages };
        }),
      deleteImage: (filename) =>
        set((state) => ({ ...state, images: state.images.filter((image) => image.filename !== filename) })),

      species: [],
      setSpecies: (species) =>
        set((state) => {
          // Add
          const speciesIndex = state.species.findIndex(({ id }) => species.id === id);
          if (speciesIndex === -1) {
            return { ...state, species: [...state.species, species] };
          }
          // Update
          const newSpecies = [...state.species];
          newSpecies[speciesIndex] = { ...newSpecies[speciesIndex], ...species };
          return { ...state, species: newSpecies };
        }),
      deleteSpecies: (id) =>
        set((state) => ({ ...state, species: state.species.filter((species) => species.id !== id) })),
    }),
    {
      name: 'artdatabanken',
      storage: customStorage,
    }
  )
  // )
);
