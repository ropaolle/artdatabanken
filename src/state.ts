import { createStore } from 'react-hooks-global-state';
import type { ImageInfo, SpeciesInfo } from './lib/firebase.ts';
import { DialogTypes } from './dialogs/Dialog.tsx';

type DialogState = {
  id: DialogTypes;
  open: boolean;
};

interface DeleteImageDialogState extends DialogState {
  values?: ImageInfo;
}
interface SpeciesDialogState extends DialogState {
  values?: SpeciesInfo;
}

type GlobalState = {
  images: ImageInfo[];
  species: SpeciesInfo[];
  speciesDialog: SpeciesDialogState;
  deleteImageDialog: DeleteImageDialogState;
  uploadImageDialog: DialogState;
};

type Action =
  | { type: 'initStore'; images: ImageInfo[]; species: SpeciesInfo[] }
  | { type: 'addImage'; image: ImageInfo }
  | { type: 'deleteImage'; filename: string }
  | { type: 'addSpecies'; species: SpeciesInfo }
  | { type: 'updateSpecies'; species: SpeciesInfo }
  | { type: 'deleteSpecies'; id: string }
  | { type: 'showSpeciesDialog'; state: boolean; values?: SpeciesInfo }
  | { type: 'showDeleteImageDialog'; state: boolean; values?: ImageInfo }
  | { type: 'showUploadImageDialog'; state: boolean };

export const initStore = (images: ImageInfo[], species: SpeciesInfo[]) =>
  dispatch({
    images,
    species,
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

export const showDeleteImageDialog = (state: boolean, values?: ImageInfo) =>
  dispatch({
    state,
    values,
    type: 'showDeleteImageDialog',
  });

export const showUploadImageDialog = (state: boolean) =>
  dispatch({
    state,
    type: 'showUploadImageDialog',
  });

export const { dispatch, useStoreState } = createStore(
  (state: GlobalState, action: Action) => {
    // console.log('state', state);
    // console.log('action', action);
    switch (action.type) {
      case 'initStore':
        return {
          ...state,
          images: action.images,
          species: action.species,
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
          species: { ...state.species },
        };
      }

      case 'deleteSpecies':
        return {
          ...state,
          species: state.species.filter(({ id }) => action.id !== id),
        };

      case 'showSpeciesDialog':
        return {
          ...state,
          speciesDialog: { ...state.speciesDialog, open: action.state, values: action.values },
        };

      case 'showDeleteImageDialog':
        return {
          ...state,
          deleteImageDialog: { ...state.deleteImageDialog, open: action.state, values: action.values },
        };

      case 'showUploadImageDialog':
        return {
          ...state,
          uploadImageDialog: { ...state.uploadImageDialog, open: action.state },
        };

      default:
        return state;
    }
  },
  {
    images: [],
    species: [],
    speciesDialog: {
      id: DialogTypes.SPECIES_DIALOG,
      open: false,
    },
    uploadImageDialog: {
      id: DialogTypes.UPLOAD_IMAGE_DIALOG,
      open: false,
    },
    deleteImageDialog: {
      id: DialogTypes.DELETE_IMAGE_DIALOG,
      open: false,
    },
  }
);
