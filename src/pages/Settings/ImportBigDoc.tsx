import { useState } from 'react';
import { collection, addDoc, serverTimestamp, setDoc, doc } from 'firebase/firestore';
import { db, type SpeciesInfo } from '../../lib/firebase';
import { readUploadedFileAsText, ImportStates } from '.';

const SPECIES_COLLECTION = 'species';

export default function ImportBigDoc() {
  const [importingSpecies, setImportingSpecies] = useState<ImportStates>(ImportStates.IDLE);
  const [species, setSpecies] = useState<SpeciesInfo[]>();
  const [speciesMessage, setSpeciesMessage] = useState('');

  const onHandleSpeciesImportChange = async (file: File | undefined) => {
    setImportingSpecies(ImportStates.IDLE);
    setSpeciesMessage('');

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
          image: image.trim(),
        });
      }
    } catch (error) {
      console.error(error);
    }

    setSpecies(speciesCollection);
  };

  const handleSpeciesImport = async () => {
    if (!species) return;

    setImportingSpecies(ImportStates.UPLOADING);
    console.time('label');
    species[0].county = 'OLLEBOLLE';

    await setDoc(doc(db, SPECIES_COLLECTION, 'LA'), { species/* : [species[0]] */ }).then((a) => {
      console.log('a', a);
      console.timeEnd('label');
    });

    // await addDoc(collection(db, SPECIES_COLLECTION), { species, createdAt: serverTimestamp() }).then((a) => {
    //   console.log('a', a);
    //   console.timeEnd('label');
    // });

    // label: 1124.73779296875 ms

    setSpeciesMessage(`Done! ${species.length} species imported.`);

    setImportingSpecies(ImportStates.DONE);
  };

  return (
    <div>
      <label htmlFor="importspecies">
        <b>Import big doc</b>
        <input
          id="importspecies"
          type="file"
          accept=".csv"
          onChange={(e) => onHandleSpeciesImportChange(e.currentTarget.files?.[0])}
        />
        {speciesMessage && <small>{speciesMessage}</small>}
      </label>
      <button onClick={handleSpeciesImport} aria-busy={importingSpecies === ImportStates.UPLOADING}>
        Importera alla arter
      </button>
    </div>
  );
}
