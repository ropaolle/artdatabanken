import { useState } from 'react';
import { db, COLLECTIONS, getDownloadURLs } from '../../lib/firebase';
import { type ImportStates } from '.';
import { doc, setDoc, Timestamp } from 'firebase/firestore/lite';

export default function CreateImageBundle() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState<ImportStates>('IDLE');

  const handleCreateImageBundle = async () => {
    setLoading('BUSY');
    setMessage('');

    const imageList = await getDownloadURLs('images');
    const thumbsList = await getDownloadURLs('thumbs');
    const imageMap = new Map(imageList.map((image) => [image.filename, image]));

    for (const { filename, URL: thumbnailURL } of thumbsList) {
      imageMap.set(filename, {
        filename,
        thumbnailURL,
        URL: imageMap.get(filename)?.URL,
        createdAt: Timestamp.now(),
      });
    }

    const imageInfo = Array.from(imageMap.values());

    setDoc(
      doc(db, COLLECTIONS.APPLICATION, 'bundles'),
      {
        images: imageInfo,
      },
      { merge: true }
    );

    setDoc(doc(db, COLLECTIONS.APPLICATION, 'deleted'), { images: [] }, { merge: true });
    setDoc(doc(db, COLLECTIONS.APPLICATION, 'updatedAt'), { updatedAt: Timestamp.now() });

    setMessage(`Image bundle with ${imageInfo.length} images created.`);
    setLoading('DONE');
  };

  return (
    <>
      <label htmlFor="filename">
        <b>Image bundle</b>
        <p>Regenerate the image bundle based on all existing images in the storage.</p>
        <div>{message && <small>{message}</small>}</div>
      </label>
      <button onClick={handleCreateImageBundle} aria-busy={loading === 'BUSY'}>
        Create image bundle
      </button>
    </>
  );
}
