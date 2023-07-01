import { useState, useEffect } from 'react';
import './Dialog.css';
import type { SpeciesInfo, ImageInfo } from '../../lib/firebase';

export enum Dialogs {
  DELETE_IMAGE_DIALOG = 'DELETE_IMAGE_DIALOG',
  // UPLOAD_IMAGE_DIALOG,
  // ADD_SPECIES_DIALOG,
}

export type ShowDialog = (dialog: Dialogs, show: boolean, data?: SpeciesInfo | ImageInfo) => void;

export type DialogProps = {
  id: Dialogs;
  title?: string;
  open: boolean;
  show: ShowDialog;
  children?: React.ReactNode;
};

/* export const DialogButton = ({ label, className }: { label: string; className: string }) => (
  <button type="button" role="button" className={className}>
    {label}
  </button>
); */

export default function Dialog({ id, title, open, show, children }: DialogProps) {
  const handleClose = (e: React.FormEvent) => {
    e.preventDefault();
    show(id, false);
  };

  return (
    <dialog id={id} open={open}>
      <form className="form" /* onSubmit={handleSubmit(onSubmit)} */>
        <article>
          <header>
            <a href="#" aria-label="Close" className="close" onClick={handleClose}></a>
            <div>{title}</div>
          </header>
          {children}
        </article>
      </form>
    </dialog>
  );
}
