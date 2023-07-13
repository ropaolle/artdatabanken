// import { create } from 'zustand';
// import { devtools /* , persist */ } from 'zustand/middleware';
// import { type SpeciesInfo, type ImageInfo } from './firebase';

/* type DialogState<T = void> = { open: boolean; values?: T };
type ShowDialog<T = void> = (open: boolean, values?: T) => void;

type DialogType<T = void> = {
  state: DialogState<T>;
  show: ShowDialog<T>;
};

interface AppState {
  speciesDialog: DialogType<SpeciesInfo>;
  uploadImageDialog: DialogType;
  deleteImageDialog: DialogType<ImageInfo>;
}

// TODO: This is messy. Rewrite the dialog state. Try to pass values to the dialog some other way and not
// thru the state. Then we may be able to simplify this.

export const useAppStore = create<AppState>()(
  devtools(
    // persist(
    (set) => ({
      speciesDialog: {
        state: { open: false },
        show: (open, values) =>
          set((state) => ({ ...state, speciesDialog: { ...state.speciesDialog, state: { open, values } } })),
      },
      uploadImageDialog: {
        state: { open: false },
        show: (open) =>
          set((state) => ({ ...state, uploadImageDialog: { ...state.uploadImageDialog, state: { open } } })),
      },
      deleteImageDialog: {
        state: { open: false },
        show: (open, values) =>
          set((state) => ({ ...state, deleteImageDialog: { ...state.deleteImageDialog, state: { open, values } } })),
      },
    }),
    {
      name: 'appStore',
    }
    // )
  )
);
 */