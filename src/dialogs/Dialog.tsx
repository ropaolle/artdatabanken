// import { useState, useEffect } from 'react';
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
  // handleSubmit: any;
};

/* export const DialogButton = ({ label, className }: { label: string; className: string }) => (
  <button type="button" role="button" className={className}>
    {label}
  </button>
); */

export default function Dialog({ id, title, open, show, children, onSubmit /* , handleSubmit */ }: DialogProps) {
  const handleClose = (e: React.FormEvent) => {
    e.preventDefault();
    show(id, false);
  };

  // console.log('typeof handleSubmit', typeof handleSubmit);

  // if (!handleSubmit) return null;

  return (
    <dialog id={id} open={open}>
      {/* <form onSubmit={handleSubmit(onSubmit)} className="form"> */}
      <form onSubmit={onSubmit} className="form">
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
