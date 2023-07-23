import { useState } from 'react';
import { doc, setDoc, Timestamp, collection, addDoc } from 'firebase/firestore/lite';
import { db, type SpeciesInfo, COLLECTIONS } from '../../lib/firebase';
import { readUploadedFileAsText, type ImportStates } from '.';

export default function ImportSpecies() {
  const [importingSpecies, setImportingSpecies] = useState<ImportStates>('IDLE');
  const [species, setSpecies] = useState<SpeciesInfo[]>();
  const [speciesMessage, setSpeciesMessage] = useState('');

  const onHandleSpeciesImportChange = async (file?: File) => {
    setImportingSpecies('IDLE');
    setSpeciesMessage('');

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

    setSpecies(speciesCollection);
  };

  const handleSpeciesImport = async () => {
    if (!species) return;
    setImportingSpecies('UPLOADING');

    // Create custom bundle
    // await setDoc(doc(db, COLLECTIONS.BUNDLES, COLLECTIONS.SPECIES), { items: species, updatedAt: Timestamp.now() });

    setDoc(
      doc(db, COLLECTIONS.APPLICATION, 'bundles'),
      {
        species: species,
      },
      { merge: true }
    );

    // Add delete collection
    setDoc(doc(db, COLLECTIONS.APPLICATION, 'deleted'), { species: [] }, { merge: true });
    setDoc(doc(db, COLLECTIONS.APPLICATION, 'lastChange'), { lastChange: Timestamp.now() });

    setSpeciesMessage(`Done! ${species.length} species imported.`);
    setImportingSpecies('DONE');
  };

  return (
    <div>
      <label htmlFor="importspecies">
        <b>Arter</b>
        <p>Importerar alla arter från en .csv fil. Artnamn kontrolleras inte. Kan generera dubletter.</p>
        <input
          id="importspecies"
          type="file"
          accept=".csv"
          onChange={(e) => onHandleSpeciesImportChange(e.currentTarget.files?.[0])}
        />
        {speciesMessage && <small>{speciesMessage}</small>}
      </label>
      <button onClick={handleSpeciesImport} aria-busy={importingSpecies === 'UPLOADING'}>
        Importera arter
      </button>
    </div>
  );
}
