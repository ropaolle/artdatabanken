import { useState } from 'react';
import {
  firestoreFetch,
  type Bundles,
  db,
  COLLECTIONS,
  getFileList,
  type ImageInfo,
  getDownloadURLs,
} from '../../lib/firebase';
import { type ImportStates } from '.';
import {
  doc,
  collection,
  setDoc,
  Timestamp,
  deleteDoc,
  FieldValue,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore/lite';

export default function ExportDatabase() {
  const [filename, setFilename] = useState(`species-backup-${new Date().toLocaleDateString()}.csv`);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState<ImportStates>('IDLE');

  const saveToFile = (filename: string, content: string) => {
    const link = document.createElement('a');
    const file = new Blob([content], { type: 'text/csv;charset=utf-8,' });
    link.href = URL.createObjectURL(file);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleSaveToFile = async () => {
    setSaving('UPLOADING');

    const [{ species }] = await firestoreFetch<Bundles>('bundles');

    const csvContent = [];
    for (const { kingdom, order, family, species: s, sex, speciesLatin, place, county, date, image } of species) {
      csvContent.push(`${kingdom};${order};${family};${s};${sex};${speciesLatin};${place};${county};${date};${image}`);
    }
    // If we prepend \ufeff to the content the file will be saved as UTF-8 with BOM rather than UTF-8.
    saveToFile(filename, '\ufeff' + csvContent.join('\n'));

    setMessage(`File saved as ${filename}.`);
    setSaving('DONE');
  };

  const handleCreateImageBundle = async () => {
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
    setDoc(doc(db, COLLECTIONS.APPLICATION, 'lastChange'), { lastChange: Timestamp.now() });
  };

  return (
    <div>
      <label htmlFor="filename">
        <b>Filname</b>
        <p>Skapar en. csv med all arter i databasen. Kan läsas in med nedanstående importfunktion.</p>
        <input id="filename" value={filename} onChange={(e) => setFilename(e.currentTarget.value)} />
        <div>{message && <small>{message}</small>}</div>
      </label>
      <button onClick={handleSaveToFile} aria-busy={saving === 'UPLOADING'}>
        Exportera databas
      </button>
      <button onClick={handleCreateImageBundle} aria-busy={saving === 'UPLOADING'}>
        Create image bundle
      </button>
    </div>
  );
}
