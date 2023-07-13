import { createStore } from 'react-hooks-global-state';
import type { ImageInfo, SpeciesInfo } from './lib/firebase.ts';

type DataLists = {
  kingdoms: Set<string>;
  orders: Set<string>;
  families: Set<string>;
  species: Set<string>;
  places: Set<string>;
};

type GlobalState = {
  images: ImageInfo[];
  species: SpeciesInfo[];
  dataLists: DataLists;
};

type Action =
  | { type: 'initStore'; images: ImageInfo[]; species: SpeciesInfo[] }
  | { type: 'addImage'; image: ImageInfo }
  | { type: 'deleteImage'; filename: string }
  | { type: 'addSpecies'; species: SpeciesInfo }
  | { type: 'updateSpecies'; species: SpeciesInfo }
  | { type: 'deleteSpecies'; id: string };

export const initStore = (images: ImageInfo[], species: SpeciesInfo[]) =>
  dispatch({
    images,
    species,
    // dataLists,
    type: 'initStore',
  });

export const addImage = (image: ImageInfo) =>
  dispatch({
    image,
    type: 'addImage',
  });

export const deleteImage = (filename: string) =>
  dispatch({
    filename,
    type: 'deleteImage',
  });

export const addSpecies = (species: SpeciesInfo) =>
  dispatch({
    species,
    type: 'addSpecies',
  });

export const updateSpecies = (species: SpeciesInfo) =>
  dispatch({
    species,
    type: 'updateSpecies',
  });

export const deleteSpecies = (id: string) =>
  dispatch({
    id,
    type: 'deleteSpecies',
  });

const getDataLists = (lists: DataLists, species: SpeciesInfo[]) => {
  for (const { kingdom, order, family, species: speciesName, place } of species) {
    lists.kingdoms.add(kingdom);
    lists.orders.add(order);
    lists.families.add(family);
    lists.species.add(speciesName);
    lists.places.add(place);
  }

  return lists;
};

export const { dispatch, useStoreState } = createStore(
  (state: GlobalState, action: Action) => {
    switch (action.type) {
      case 'initStore':
        return {
          ...state,
          images: action.images,
          species: action.species,
          dataLists: getDataLists(state.dataLists, action.species),
        };

      case 'addImage':
        return {
          ...state,
          images: [...state.images, action.image],
        };

      case 'deleteImage':
        return {
          ...state,
          images: state.images.filter(({ filename }) => action.filename !== filename),
        };

      case 'addSpecies':
        return {
          ...state,
          species: [...state.species, action.species],
        };

      case 'updateSpecies': {
        const index = state.species.findIndex(({ id }) => action.species.id === id);
        if (index !== -1) state.species[index] = action.species;
        return {
          ...state,
          species: [...state.species],
        };
      }

      case 'deleteSpecies':
        return {
          ...state,
          species: state.species.filter(({ id }) => action.id !== id),
        };

      default:
        return state;
    }
  },
  {
    images: [],
    species: [],
    dataLists: {
      kingdoms: new Set<string>(),
      orders: new Set<string>(),
      families: new Set<string>(),
      species: new Set<string>(),
      places: new Set<string>(),
    },
  }
);
