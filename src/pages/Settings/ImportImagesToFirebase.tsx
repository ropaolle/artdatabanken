import { useState } from 'react';
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { setDoc, doc, Timestamp } from 'firebase/firestore/lite';
import { db, COLLECTIONS, PATHS, type ImageInfo } from '../../lib/firebase';
import { type ImportStates } from '.';

export default function ImportImagesToFirebase() {
  const [images, setImages] = useState<FileList>();
  const [imagesMessage, setImagesMessage] = useState('');
  const [uploadingImages, setUploadingImages] = useState<ImportStates>('IDLE');

  const onHandleImageImportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadingImages('IDLE');
    setImagesMessage('');
    setImages(e.currentTarget.files || undefined);
  };

  type BundleObject = {
    [key: string]: ImageInfo;
  };

  // TODO: Rewrite with async/await
  const handleImageImport = async () => {
    if (!images) return;

    setUploadingImages('UPLOADING');

    const storage = getStorage();

    const promises = [];
    const bundleItems: BundleObject = {};

    for (const file of images) {
      const fullPath = `${PATHS.IMAGES}/${file.name.toLocaleLowerCase()}`;
      const storageRef = ref(storage, fullPath);

      const job = uploadBytes(storageRef, file)
        .then((snapshot) => {
          return getDownloadURL(snapshot.ref)
            .then((URL) => {
              const fileInfo = !file.name.includes('_thumbnail')
                ? { filename: file.name, URL: URL }
                : { thumbnail: file.name, thumbnailURL: URL };
              const newDoc = { ...fileInfo, createdAt: Timestamp.now(), updatedAt: Timestamp.now() };
              const filename = file.name.replace('_thumbnail', '');
              bundleItems[filename] = { ...bundleItems[filename], ...newDoc };
            })
            .catch((err) => console.error(err));
        })
        .catch((err) => console.error(err));

      promises.push(job);
    }

    Promise.all(promises)
      .then(() => {
        // Create custom bundle
        setDoc(doc(db, COLLECTIONS.BUNDLES, COLLECTIONS.IMAGES), {
          items: Object.values(bundleItems),
          updatedAt: Timestamp.now(),
        });
        // Add delete collection
        setDoc(doc(db, COLLECTIONS.DELETED, 'images'), { filenames: [] });

        setImagesMessage(`Done. ${images.length} files uploaded.`);
      })
      .catch((err) => console.error(err))
      .finally(() => setUploadingImages('DONE'));
  };

  return (
    <div>
      <label htmlFor="importimages">
        <b>Bilder</b>
        <p>
          Laddar upp bilder, miniatyrer och skapar databasposter. Både bild och miniatyr ska inkluderas, t.ex.{' '}
          <ins>image066.jpg</ins> och <ins>image066_thumbnail.jpg</ins>.
        </p>
        <input id="importimages" type="file" accept=".jpg" onChange={onHandleImageImportChange} multiple />
        {imagesMessage && <small>{imagesMessage}</small>}
      </label>
      <button onClick={handleImageImport} aria-busy={uploadingImages === 'UPLOADING'}>
        Importera bilder
      </button>
    </div>
  );
}
