import { createGlobalState } from 'react-hooks-global-state';
import type { ImageInfo, SpeciesInfo } from './lib/firebase.ts';

type AppState = {
  images: ImageInfo[];
  species: SpeciesInfo[];
};

type GlobalState = {
  app: AppState;
};

export const { useGlobalState } = createGlobalState<GlobalState>({
  app: {
    images: [],
    species: [],
  },
});
