import { createStore } from 'react-hooks-global-state';
import type { ImageInfo, SpeciesInfo } from './lib/firebase.ts';

type AppState = {
  images: ImageInfo[];
  species: SpeciesInfo[];
};

type GlobalState = {
  app: AppState;
};

type Action =
  | { type: 'initStore'; app: GlobalState }
  | { type: 'addImage'; image: ImageInfo }
  | { type: 'deleteImage'; filename: string };

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

export const { dispatch, useStoreState } = createStore(
  (state: GlobalState, action: Action) => {
    console.log('state', state);
    switch (action.type) {
      case 'initStore':
        return {
          ...action.app,
        };

      case 'addImage':
        return {
          app: { ...state.app, images: [...state.app.images, action.image] },
        };

      case 'deleteImage':
        return {
          app: { ...state.app, images: state.app.images.filter((image) => action.filename !== image.filename) },
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
  }
);
