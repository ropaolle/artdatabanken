import { createStore } from 'react-hooks-global-state';
import type { ImageInfo, SpeciesInfo } from './lib/firebase.ts';
import { DialogTypes } from './dialogs/Dialog.tsx';

type AppState = {
  images: ImageInfo[];
  species: SpeciesInfo[];
};

type DialogState = {
  id: DialogTypes;
  open: boolean;
  values?: SpeciesInfo;
};

type GlobalState = {
  app: AppState;
  speciesDialog: DialogState;
};

type Action =
  | { type: 'initStore'; app: AppState }
  | { type: 'addImage'; image: ImageInfo }
  | { type: 'deleteImage'; filename: string }
  | { type: 'addSpecies'; species: SpeciesInfo }
  | { type: 'updateSpecies'; species: SpeciesInfo }
  | { type: 'deleteSpecies'; id: string }
  | { type: 'showSpeciesDialog'; state: boolean; values?: SpeciesInfo };

export const initStore = (app: AppState) =>
  dispatch({
    app,
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

export const showSpeciesDialog = (state: boolean, values?: SpeciesInfo) =>
  dispatch({
    state,
    values,
    type: 'showSpeciesDialog',
  });

export const { dispatch, useStoreState } = createStore(
  (state: GlobalState, action: Action) => {
    // console.log('state', state);
    switch (action.type) {
      case 'initStore':
        return {
          ...state,
          ...action.app,
        };

      case 'addImage':
        return {
          ...state,
          app: { ...state.app, images: [...state.app.images, action.image] },
        };

      case 'deleteImage':
        return {
          ...state,
          app: { ...state.app, images: state.app.images.filter(({ filename }) => action.filename !== filename) },
        };

      case 'addSpecies':
        return {
          ...state,
          app: { ...state.app, species: [...state.app.species, action.species] },
        };

      case 'updateSpecies': {
        const index = state.app.species.findIndex(({ id }) => action.species.id === id);
        if (index !== -1) state.app.species[index] = action.species;
        return {
          ...state,
          app: { ...state.app },
        };
      }

      case 'deleteSpecies':
        return {
          ...state,
          app: { ...state.app, species: state.app.species.filter(({ id }) => action.id !== id) },
        };

      case 'showSpeciesDialog':
        return {
          ...state,
          speciesDialog: { ...state.speciesDialog, open: action.state, values: action.values },
        };

      default:
        return state;
    }
  },
  {
    // TODO: remove app level and access props directly
    app: {
      images: [],
      species: [],
    },
    speciesDialog: {
      id: DialogTypes.SPECIES_DIALOG,
      open: false,
    },
  }
);
