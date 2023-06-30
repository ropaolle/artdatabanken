// import { useState, useEffect, useRef } from 'react';
// import { db, checkIfImageExistsInDB, /* canvasToBlob, */ uploadFile, normalizeFilename } from '../lib/firebase.ts';
// import { doc, addDoc, setDoc, updateDoc, serverTimestamp, collection } from 'firebase/firestore';
// import { useForm, SubmitHandler } from 'react-hook-form';
// import ReactCrop, { type PixelCrop } from 'react-image-crop';
// import 'react-image-crop/dist/ReactCrop.css';
// import { useDebounceEffect } from '../lib/useDebounceEffect';
// import { Icon } from '@iconify/react';

type Props = {
  open: boolean;
  close: () => void;
};

export default function ImageDeleteDialog({ open, close }: Props) {
  const onClick = (e: React.FormEvent) => {
    e.preventDefault();
    close();
  };

  return (
    <dialog id="imageDeleteDialog" open={open}>
      <form className="form">
        <article>
          <a href="#" aria-label="Close" className="close" onClick={onClick}></a>

          <h3>image001.jpg</h3>
          <p>Ladda upp en ny eller ersätt befintlig bild.</p>

          <footer>
            <div className="grid">
              <div></div>
              <button
                className="contrast"
                role="button"
                type="button"
                // disabled={!defaultValues.id}
                // onClick={handleDelete}
              >
                Radera
              </button>
              <button
                role="button"

                // disabled={!defaultValues.id}
                // onClick={handleDelete}
              >
                Avbryt
              </button>
            </div>
          </footer>
        </article>
      </form>
    </dialog>
  );
}
