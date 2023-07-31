import { create } from 'zustand';
import { /* devtools, */ persist } from 'zustand/middleware';
import { Timestamp } from 'firebase/firestore/lite';
import { type User } from '../lib/auth';
import { mergeArrayOfObjects } from '../lib';
import { customStorage } from './customStorage';
import { fetchGlobalState } from './fetchGlobalState';

export type GlobalState = {
  updateGlobalState: (images: ImageInfo[], species: SpeciesInfo[], updatedAt: Timestamp, fullUpdate: boolean) => void;
  fullUpdateFetchedAt?: Timestamp;

  user: User | null;
  setUser: (user: User | null) => void;

  images: ImageInfo[];
  addOrUpdateImage: (images: ImageInfo) => void;
  deleteImage: (filename: string) => void;

  species: SpeciesInfo[];
  addOrUpdateSpecies: (species: SpeciesInfo) => void;
  deleteSpecies: (id: string) => void;
};

export const useAppStore = create<GlobalState>()(
  // devtools(
  persist<GlobalState>(
    (set) => ({
      updateGlobalState: (images, species, fullUpdateFetchedAt, fullUpdate = false) =>
        set((state) => {
          // Replace state
          if (fullUpdate) {
            return { images, species, fullUpdateFetchedAt };
          }

          // Merge state
          return {
            ...state,
            images: mergeArrayOfObjects(state.images, images),
            species: mergeArrayOfObjects(state.species, species),
          };
        }),

      user: null,
      setUser: (user) => set(() => ({ user })),

      images: [],
      addOrUpdateImage: (image) =>
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
      addOrUpdateSpecies: (species) =>
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

export { fetchGlobalState };
