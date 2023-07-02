import { useEffect } from 'react';
import './Dialog.css';
import type { SpeciesInfo, ImageInfo } from '../lib/firebase';
import type { SubmitHandler, FieldValues } from 'react-hook-form';

export enum Dialogs {
  DELETE_IMAGE_DIALOG = 'DELETE_IMAGE_DIALOG',
  UPLOAD_IMAGE_DIALOG = 'UPLOAD_IMAGE_DIALOG',
  // ADD_SPECIES_DIALOG,
}

export type ShowDialog = (dialog: Dialogs, show: boolean, data?: SpeciesInfo | ImageInfo) => void;

export type DialogProps = {
  id: Dialogs;
  title?: string;
  open: boolean;
  show: ShowDialog;
  children?: React.ReactNode;
  onSubmit?: SubmitHandler<FieldValues>;
};

export default function Dialog({ id, title, open, show, children, onSubmit }: DialogProps) {
  // BUGG: Chromium bugg that closes dialogs when a file input dialog is canceled, see
  // https://stackoverflow.com/questions/76400460/html-dialog-closes-automatically-when-file-input-is-cancelled-how-to-prevent.
  useEffect(() => {
    let prematurelyClosed = false;
    const dialog = document.getElementById(id) as HTMLDialogElement;

    const handleCancel = (e: Event) => {
      prematurelyClosed = e.target !== dialog;
    };

    const handleClose = () => {
      if (prematurelyClosed) {
        dialog.show();
        prematurelyClosed = false;
      }
    };

    dialog.addEventListener('cancel', handleCancel);
    dialog.addEventListener('close', handleClose);

    // cleanup this component
    return () => {
      window.removeEventListener('cancel', handleCancel);
      window.removeEventListener('close', handleClose);
    };
  });

  const handleClose = (e: React.FormEvent) => {
    e.preventDefault();
    show(id, false);
  };

  return (
    <dialog id={id} open={open}>
      <form onSubmit={onSubmit} className="form">
        <article>
          <header>
            <a href="#" aria-label="Close" className="close" onClick={handleClose} />
            <div>{title}</div>
          </header>
          {children}
        </article>
      </form>
    </dialog>
  );
}
