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
  // dialogs: DialogState[];
  speciesDialog: DialogState;
};

type Action =
  | { type: 'initStore'; app: GlobalState }
  | { type: 'addImage'; image: ImageInfo }
  | { type: 'deleteImage'; filename: string }
  | { type: 'showDialog'; state: boolean; values?: SpeciesInfo };

export const initStore = (app: GlobalState) =>
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

export const showDialog = (state: boolean, values?: SpeciesInfo) =>
  dispatch({
    state,
    values,
    type: 'showDialog',
  });

// const defaults = {
//   species: '',
//   place: '',
//   date: new Date().toLocaleDateString(),
//   kingdom: '',
//   order: '',
//   family: '',
//   county: '',
//   speciesLatin: '',
//   sex: '',
//   image: '',
// };

export const { dispatch, useStoreState } = createStore(
  (state: GlobalState, action: Action) => {
    // console.log('state', state);
    switch (action.type) {
      case 'initStore':
        return {
          ...state,
          ...action.app,
          // speciesDialog: {
          //   open: true,
          // },
        };

      case 'addImage':
        return {
          ...state,
          app: { ...state.app, images: [...state.app.images, action.image] },
        };

      case 'deleteImage':
        return {
          ...state,
          app: { ...state.app, images: state.app.images.filter((image) => action.filename !== image.filename) },
        };

      case 'showDialog':
        return {
          ...state,
          speciesDialog: { ...state.speciesDialog, open: action.state, values: action.values },
        };

      // case 'setLastName':
      //   return {
      //     ...state,
      //     person: {
      //       ...state.person,
      //       lastName: action.lastName,
      //     },
      //   };

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
    // dialogs: {
    speciesDialog: {
      id: DialogTypes.SPECIES_DIALOG,
      open: false,
      // values: defaults,
    },
    // },
  }
);
