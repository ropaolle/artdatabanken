import { useState } from 'react';
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { setDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ImportStates } from '.';

const IMAGES_PATH = 'images';
const IMAGES_COLLECTION = 'images';

export default function ImportImagesToFirebase() {
  const [images, setImages] = useState<FileList>();
  const [imagesMessage, setImagesMessage] = useState('');
  const [uploadingImages, setUploadingImages] = useState<ImportStates>(ImportStates.IDLE);

  const onHandleImageImportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadingImages(ImportStates.IDLE);
    setImagesMessage('');
    setImages(e.currentTarget.files || undefined);
  };

  // TODO: Rewrite with async/await
  const handleImageImport = async () => {
    if (!images) return;

    setUploadingImages(ImportStates.UPLOADING);

    const storage = getStorage();

    const promises = [];

    for (const file of images) {
      const fullPath = `${IMAGES_PATH}/${file.name.toLocaleLowerCase()}`;
      const storageRef = ref(storage, fullPath);

      const job = uploadBytes(storageRef, file)
        .then((snapshot) => {
          return getDownloadURL(snapshot.ref)
            .then((URL) => {
              const newDoc = !file.name.includes('_thumbnail')
                ? { filename: file.name, URL: URL, createdAt: Timestamp.fromDate(new Date()) }
                : { thumbnail: file.name, thumbnailURL: URL, createdAt: Timestamp.fromDate(new Date()) };

              return setDoc(doc(db, IMAGES_COLLECTION, file.name.replace('_thumbnail', '')), newDoc, { merge: true })
                .then(() => {
                  setImagesMessage(`${file.name} uploaded.`);
                })
                .catch((err) => console.error(err));
            })
            .catch((err) => console.error(err));
        })
        .catch((err) => console.error(err));

      promises.push(job);
    }

    Promise.all(promises)
      .then(() => {
        setImagesMessage(`Done. ${images.length} files uploaded.`);
      })
      .catch((err) => console.error(err))
      .finally(() => setUploadingImages(ImportStates.DONE));
  };

  return (
    <div>
      <label htmlFor="importimages">
        <b>Bilder</b>
        <input id="importimages" type="file" onChange={onHandleImageImportChange} multiple />
        {imagesMessage && <small>{imagesMessage}</small>}
      </label>
      <button onClick={handleImageImport} aria-busy={uploadingImages === ImportStates.UPLOADING}>
        Importera bilder
      </button>
    </div>
  );
}
