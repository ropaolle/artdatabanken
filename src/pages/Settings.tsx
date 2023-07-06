import { useState } from 'react';
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { collection, addDoc, setDoc, doc, serverTimestamp, Timestamp } from 'firebase/firestore';
import Page from './Page';
import { db, type SpeciesInfo } from '../lib/firebase';

const IMAGES_COLLECTION = 'images2';
const IMAGES_PATH = 'images2022';
const SPEICES_COLLECTION = 'speices2';

const readUploadedFileAsText = (file: File): Promise<string> => {
  const fileReader = new FileReader();

  return new Promise((resolve, reject) => {
    fileReader.onerror = () => {
      fileReader.abort();
      reject(new DOMException('Problem parsing input file.'));
    };

    fileReader.onload = () => {
      resolve(fileReader.result as string);
    };
    fileReader.readAsText(file);
  });
};

enum States {
  'IDLE',
  'UPLOADING',
  'DONE',
}

export default function Settings() {
  const [images, setImages] = useState<FileList>();
  const [imagesMessage, setImagesMessage] = useState('');
  const [uploadingImages, setUploadingImages] = useState<States>(States.IDLE);
  const [importingSpecies, setImportingSpecies] = useState<States>(States.IDLE);

  const [speices, setSpeices] = useState<SpeciesInfo[]>();
  const [speicesMessage, setSpeicesMessage] = useState('');

  const onHandleImageImportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadingImages(States.IDLE);
    setImagesMessage('');
    setImages(e.currentTarget.files || undefined);
  };

  // TODO: Rewrite with async/await
  const handleImageImport = async () => {
    if (!images) return;

    setUploadingImages(States.UPLOADING);

    const storage = getStorage();

    const promises = [];

    for (const file of images) {
      const fullPath = `${IMAGES_PATH}/${file.name.toLocaleLowerCase()}`;
      const storageRef = ref(storage, fullPath);

      const job = uploadBytes(storageRef, file)
        .then((snapshot) => {
          return getDownloadURL(snapshot.ref)
            .then((downloadURL) => {
              const newDoc = !file.name.includes('_thumbnail')
                ? { filename: file.name, URL: downloadURL, createdAt: Timestamp.fromDate(new Date()) }
                : { thumbnail: file.name, thumbnailURL: downloadURL, createdAt: Timestamp.fromDate(new Date()) };

              return setDoc(doc(db, IMAGES_COLLECTION, file.name.replace('_thumbnail', '')), newDoc, { merge: true })
                .then(() => {
                  setImagesMessage(`${file.name} uploaded.`);
                })
                .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));

      promises.push(job);
    }

    Promise.all(promises)
      .then((x) => {
        setImagesMessage(`Done. ${images.length} files uploaded.`);
        console.log(x);
      })
      .catch((err) => console.log(err))
      .finally(() => setUploadingImages(States.DONE));
  };

  const onHandleSpeciesImportChange = async (file: File | undefined) => {
    setImportingSpecies(States.IDLE);
    setSpeicesMessage('');

    if (!file) return;

    const speciesCollection: SpeciesInfo[] = [];

    try {
      const content = await readUploadedFileAsText(file);
      const records = content.split('\n').map((row: string) => row.split(';'));

      for (const [kingdom, order, family, species, sex, speciesLatin, place, county, date, image] of records) {
        speciesCollection.push({
          kingdom,
          order,
          family,
          species,
          sex,
          speciesLatin,
          place,
          county,
          date,
          image,
        });
      }
    } catch (error) {
      console.error(error);
    }

    setSpeices(speciesCollection);
  };

  const handleSpeicesImport = async () => {
    if (!speices) return;

    setImportingSpecies(States.UPLOADING);

    for await (const record of speices) {
      addDoc(collection(db, SPEICES_COLLECTION), { ...record, createdAt: serverTimestamp() });
      setSpeicesMessage(`importing ${record.species}`);
    }

    setSpeicesMessage(`Done! ${speices.length} speices imported.`);

    setImportingSpecies(States.DONE);
  };

  return (
    <Page title="Inställningar">
      <div className="grid">
        <div>
          <label htmlFor="">
            <input type="file" onChange={onHandleImageImportChange} multiple />
            {imagesMessage && <small>{imagesMessage}</small>}
          </label>
          <button onClick={handleImageImport} aria-busy={uploadingImages === States.UPLOADING}>
            Importera bilder
          </button>
        </div>

        <div>
          <label htmlFor="importspeices">
            <input
              type="file"
              accept=".csv"
              onChange={(e) => onHandleSpeciesImportChange(e.currentTarget.files?.[0])}
            />
            {speicesMessage && <small>{speicesMessage}</small>}
          </label>
          <button onClick={handleSpeicesImport} aria-busy={importingSpecies === States.UPLOADING}>
            Importera arter
          </button>
        </div>
      </div>
    </Page>
  );
}
