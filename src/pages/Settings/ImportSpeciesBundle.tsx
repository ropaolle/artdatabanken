import { useState, useRef } from 'react';
import { doc, setDoc, Timestamp } from 'firebase/firestore/lite';
import { db, type SpeciesInfo, COLLECTIONS, DOCS } from '../../lib/firebase';
import { readUploadedFileAsText, type ImportStates } from '.';

export default function ImportSpeciesBundle() {
  const [loading, setLoading] = useState<ImportStates>('IDLE');
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onHandleSpeciesImportChange = async (file?: File) => {
    setLoading('BUSY');
    setMessage('');

    if (!file) return;

    const speciesCollection: SpeciesInfo[] = [];

    try {
      const content = await readUploadedFileAsText(file);
      const records = content.split('\n').map((row: string) => row.split(';'));

      for (const [kingdom, order, family, species, sex, speciesLatin, place, county, date, image] of records) {
        speciesCollection.push({
          id: crypto.randomUUID(),
          kingdom,
          order,
          family,
          species,
          sex,
          speciesLatin,
          place,
          county,
          date,
          image: image.trim(),
          updatedAt: Timestamp.now(),
          createdAt: Timestamp.now(),
        });
      }
    } catch (error) {
      console.error(error);
    }

    setDoc(doc(db, COLLECTIONS.APPLICATION, DOCS.BUNDLES), { species: speciesCollection }, { merge: true });

    // Add delete collection
    setDoc(doc(db, COLLECTIONS.APPLICATION, DOCS.DELETED), { species: [] }, { merge: true });
    setDoc(doc(db, COLLECTIONS.APPLICATION, DOCS.UPDATEDAT), { updatedAt: Timestamp.now() });

    setMessage(`Done! ${speciesCollection.length} species imported.`);
    setLoading('DONE');
  };

  const handleSpeciesImport = async () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <label htmlFor="importspecies">
        <b>Import species</b>
        <p>Import a .csv file with species to a bundle. The existing species bundle is owerwritten..</p>
        <input
          id="importspecies"
          type="file"
          accept=".csv"
          onChange={(e) => onHandleSpeciesImportChange(e.currentTarget.files?.[0])}
          ref={fileInputRef}
          hidden
        />
        {message && <ins><small>{message}</small></ins>}
      </label>
      <button onClick={handleSpeciesImport} aria-busy={loading === 'BUSY'}>
        Import species bundle
      </button>
    </>
  );
}
