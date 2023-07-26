import { useState, useRef } from 'react';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { PATHS } from '../../lib/firebase';
import { type ImportStates } from '.';

type ImageType = 'images' | 'thumbnails';

export default function ImportImages() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState<ImportStates>('IDLE');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState<ImageType>('images');

  const onHandleImageImportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading('IDLE');
    setMessage('');
    const images = e.currentTarget.files;
    if (!images) return;

    setLoading('UPLOADING');
    const storage = getStorage();
    const promises = [];

    for (const file of images) {
      const fullPath = `${type === 'images' ? PATHS.IMAGES : PATHS.THUMBNAILS}/${file.name.toLocaleLowerCase()}`;
      const storageRef = ref(storage, fullPath);
      promises.push(uploadBytes(storageRef, file));
    }

    Promise.all(promises)
      .then(() => {
        setMessage(`Done. ${images.length} ${type}(s) uploaded.`);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading('DONE'));
  };

  return (
    <>
      <label htmlFor="importimages">
        <b>Import images</b>
        <p>
          Import images or thumbnails to Firestore. Images can also be imported/exported from the Firebase Console or
          CLI.
        </p>
        <fieldset>
          <legend>Type</legend>
          <label htmlFor="images">
            <input
              type="radio"
              id="images"
              name="size"
              value="images"
              checked={type === 'images'}
              onChange={(e) => setType(e.target.value as ImageType)}
            />
            Images (500x500 pixels)
          </label>
          <label htmlFor="thumbnails">
            <input
              type="radio"
              id="thumbnails"
              name="size"
              value="thumbnails"
              checked={type === 'thumbnails'}
              onChange={(e) => setType(e.target.value as ImageType)}
            />
            Thumbnails (100x100 pixels)
          </label>
        </fieldset>
        <input
          ref={fileInputRef}
          id="importimages"
          type="file"
          accept=".jpg"
          onChange={onHandleImageImportChange}
          multiple
          hidden
        />
        {message && <small>{message}</small>}
      </label>
      <button onClick={() => fileInputRef.current?.click()} aria-busy={loading === 'UPLOADING'}>
        Import images
      </button>
    </>
  );
}
