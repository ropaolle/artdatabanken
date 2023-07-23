import { useState } from 'react';
import { firestoreFetch, type Bundles, db, COLLECTIONS } from '../../lib/firebase';
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

  const handleSaveToFile2 = async () => {
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

  const handleSaveToFile = async () => {
    const deleted = { images: [123, 124] };

    // {
    //   type: 'image',
    //   id: '123',
    // };

    // const ref = collection(db, COLLECTIONS.DELETED, 'images');
    const ref = doc(db, COLLECTIONS.DELETED, 'images');

    const obj = {
      date: '2023-07-19',
      image: '',
      sex: '',
      county: '',
      kingdom: 'Kräldjur',
      createdAt: {
        seconds: 1689766259,
        nanoseconds: 656000000,
      },
      species: 'ss',
      place: '',
      id: 'f2f27151-1ffa-4055-b12d-4240258b40b1',
      family: '',
      speciesLatin: '',
      order: '',
      updatedAt: {
        seconds: 1689766259,
        nanoseconds: 656000000,
      },
    };

    const ids = [1, 2, obj, 4, 5];
    const a = await updateDoc(ref, { ids: arrayUnion(...ids) });
    console.log('a', a);
    const t = await updateDoc(ref, { ids: arrayRemove(obj) });
    console.log('ids', ids, t);

    // TODO: 07:32

    // await setDoc(doc(db, COLLECTIONS.DELETED, 'images'), deleted, { merge: true });
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
    </div>
  );
}
