import { useState } from 'react';
import { doc, setDoc, Timestamp } from 'firebase/firestore/lite';
import { db, COLLECTIONS, DOCS, PATHS, getDownloadURLs } from '../../lib/firebase';
import { type ImportStates } from '.';
import { metadata } from '../../lib/firebase/metadata';

export default function CreateImageBundle() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState<ImportStates>('IDLE');

  const handleCreateImageBundle = async () => {
    setLoading('BUSY');
    setMessage('');

    const imageList = await getDownloadURLs(PATHS.IMAGES);
    const thumbsList = await getDownloadURLs(PATHS.THUMBNAILS);
    const imageMap = new Map(imageList.map((image) => [image.filename, image]));

    const metadataMap = new Map(
      metadata.map((metadata) => [
        metadata.filename.toLocaleLowerCase(),
        {
          // ...metadata,
          filename: metadata.filename.toLocaleLowerCase(),
          createdAt: Timestamp.fromDate(new Date(metadata.createdAt)),
          updatedAt: Timestamp.fromDate(new Date(metadata.updatedAt)),
        },
      ])
    );

    for (const { filename, URL: thumbnailURL } of thumbsList) {
      if (!filename) continue;

      if (!metadataMap.has(filename)) {
        console.info('Image data missing for', filename);
        continue;
      }

      imageMap.set(filename, {
        id: filename,
        filename,
        thumbnailURL,
        URL: imageMap.get(filename)?.URL,
        createdAt: metadataMap.get(filename)?.createdAt,
        updatedAt: metadataMap.get(filename)?.updatedAt,
      });
    }

    const imageInfo = Array.from(imageMap.values());
    setDoc(doc(db, COLLECTIONS.APPLICATION, DOCS.BUNDLES), { images: imageInfo }, { merge: true });
    setDoc(doc(db, COLLECTIONS.APPLICATION, DOCS.DELETED), { images: [] }, { merge: true });
    setDoc(doc(db, COLLECTIONS.APPLICATION, DOCS.UPDATEDAT), { updatedAt: Timestamp.now() });

    setMessage(`Image bundle with ${imageInfo.length} images created.`);
    setLoading('DONE');
  };

  return (
    <>
      <label htmlFor="filename">
        <b>Image bundle</b>
        <p>Regenerate the image bundle based on all existing images in the storage.</p>
        <div>
          {message && (
            <ins>
              <small>{message}</small>
            </ins>
          )}
        </div>
      </label>
      <button onClick={handleCreateImageBundle} aria-busy={loading === 'BUSY'}>
        Create image bundle
      </button>
    </>
  );
}
