import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { type SpeciesInfo, type ImageInfo } from './firebase';

type GlobalState = {
  initGlobalState: (images: ImageInfo[], species: SpeciesInfo[]) => void;
  images: ImageInfo[];
  addImage: (image: ImageInfo) => void;
  deleteImage: (filename: string) => void;
  species: SpeciesInfo[];
  addSpecies: (species: SpeciesInfo) => void;
  updateSpecies: (species: SpeciesInfo) => void;
  deleteSpecies: (id: string) => void;
};

export const useAppStore = create<GlobalState>()(
  devtools(
    persist(
      (set) => ({
        // Init state
        initGlobalState: (images, species) =>
          set(() => ({
            images,
            species,
          })),

        // Images
        images: [],
        addImage: (image) => set((state) => ({ ...state, images: [...state.images, image] })),
        deleteImage: (filename) =>
          set((state) => ({ ...state, images: state.images.filter((image) => image.filename !== filename) })),

        //Species
        species: [],
        addSpecies: (species) => set((state) => ({ ...state, species: [...state.species, species] })),
        updateSpecies: (species) =>
          set((state) => {
            const index = state.species.findIndex(({ id }) => species.id === id);
            if (index !== -1) state.species[index] = species;
            return {
              ...state,
              species: [...state.species],
            };
          }),
        deleteSpecies: (id) =>
          set((state) => ({ ...state, species: state.species.filter((species) => species.id !== id) })),
      }),
      {
        name: 'appStore',
      }
    )
  )
);
