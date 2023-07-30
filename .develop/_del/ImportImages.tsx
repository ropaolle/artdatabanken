import { useState, useRef } from 'react';
import importImages, { ImageType } from './importImages.ts';

export default function ImportImages() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState('images');

  const onHandleImageImportChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(false);
    setMessage('');

    const images = e.currentTarget.files;
    if (!images) return;
    const result = (await importImages(images, type as ImageType, (metadata) => setMessage(metadata.name))) || [];

    setMessage(`Done. ${result.length} ${type}(s) uploaded.`);
    setLoading(false);
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
              onChange={(e) => setType(e.target.value)}
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
              onChange={(e) => setType(e.target.value)}
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
        {message && (
          <ins>
            <small>{message}</small>
          </ins>
        )}
      </label>
      <button onClick={() => fileInputRef.current?.click()} aria-busy={loading}>
        Import images
      </button>
    </>
  );
}
