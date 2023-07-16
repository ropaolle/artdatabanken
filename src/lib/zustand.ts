import { create } from 'zustand';
import { /* devtools, */ persist, type StorageValue } from 'zustand/middleware';
import { Timestamp } from 'firebase/firestore';
import { type SpeciesInfo, type ImageInfo } from './firebase';

type GlobalState = {
  initGlobalState: (images: ImageInfo[], species: SpeciesInfo[], updatedAt: Timestamp) => void;
  images: ImageInfo[];
  setImage: (images: ImageInfo) => void;
  deleteImage: (filename: string) => void;
  species: SpeciesInfo[];
  setSpecies: (species: SpeciesInfo) => void;
  deleteSpecies: (id: string) => void;
  updatedAt?: Timestamp;
};

const customStorage = {
  getItem: (key: string): StorageValue<GlobalState> => {
    const str = localStorage.getItem(key) || '';
    return {
      state: {
        ...JSON.parse(str).state,
        images: JSON.parse(str).state.images.map((image: ImageInfo) => {
          if (image.createdAt) {
            image.createdAt = new Timestamp(image.createdAt.seconds, image.createdAt.nanoseconds);
          }
          if (image.updatedAt) {
            image.updatedAt = new Timestamp(image.updatedAt.seconds, image.updatedAt.nanoseconds);
          }
          return image;
        }),

        // TODO: The same conversion for species
      },
    };
  },
  setItem: (key: string, newValue: StorageValue<GlobalState>): void => {
    const str = JSON.stringify({
      state: {
        ...newValue.state,
      },
    });
    localStorage.setItem(key, str);
  },
  removeItem: (key: string): void => {
    localStorage.removeItem(key);
  },
};

export const useAppStore = create<GlobalState>()(
  // devtools(
  persist<GlobalState>(
    (set) => ({
      // Init state, replace all existing data
      initGlobalState: (images, species, updatedAt) =>
        set(() => ({
          images,
          species,
          updatedAt,
        })),

      // Images
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

      //Species
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
