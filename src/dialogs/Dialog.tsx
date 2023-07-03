import classes from './Dialog.module.css';
import { useEffect } from 'react';

export enum DialogTypes {
  DELETE_IMAGE_DIALOG = 'DELETE_IMAGE_DIALOG',
  UPLOAD_IMAGE_DIALOG = 'UPLOAD_IMAGE_DIALOG',
  SPECIES_DIALOG = 'SPECIES_DIALOG',
}

export type DialogProps = {
  id: DialogTypes;
  title?: string;
  open: boolean;
  hide: () => void;
  // show?: ShowDialog;
  children?: React.ReactNode;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
};

export function DialogInfo({ children }: { children: React.ReactNode }) {
  return <div className={classes.info}>{children}</div>;
}

export default function Dialog({ id, title, open, hide, children, onSubmit }: DialogProps) {
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
    hide();
  };

  return (
    <dialog id={id} open={open}>
      <form onSubmit={onSubmit} className="form">
        <article>
          <header>
            <a href="#" aria-label="Close" className="close" onClick={handleClose} />
            <div className={classes.title}>{title}</div>
          </header>
          {children}
        </article>
      </form>
    </dialog>
  );
}
