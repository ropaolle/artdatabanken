import { useState } from 'react';
import { useLocalStorage } from 'react-use';
import { Timestamp } from 'firebase/firestore';
import { type SpeciesInfo } from '../../lib/firebase';
import { readUploadedFileAsText, ImportStates } from '.';

export default function ImportSpeciesToLocaleStorage() {
  const [, /* speciesList */ setSpeciesList /* , remove */] = useLocalStorage<SpeciesInfo[]>('species', []);

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

      // TODO: Use real id from Firebase,
      let i = 0;
      for (const [kingdom, order, family, species, sex, speciesLatin, place, county, date, image] of records) {
        speciesCollection.push({
          id: String(i),
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
          createdAt: Timestamp.now(),
        });
        i++;
      }
    } catch (error) {
      console.error(error);
    }

    setSpecies(speciesCollection);
  };

  const handleSpeciesImport = async () => {
    if (!species) return;

    setImportingSpecies(ImportStates.UPLOADING);

    const data: SpeciesInfo[] = [];
    for (const record of species) {
      data.push(record);
      setSpeciesMessage(`importing ${record.species}`);
    }
    setSpeciesList(data);

    setSpeciesMessage(`Done! ${species.length} species imported.`);
    setImportingSpecies(ImportStates.DONE);
  };

  return (
    <div>
      <label htmlFor="importspecies">
        <b>Arter</b>
        <input
          id="importspecies"
          type="file"
          accept=".csv"
          onChange={(e) => onHandleSpeciesImportChange(e.currentTarget.files?.[0])}
        />
        {speciesMessage && <small>{speciesMessage}</small>}
      </label>
      <button onClick={handleSpeciesImport} aria-busy={importingSpecies === ImportStates.UPLOADING}>
        Importera arter
      </button>
    </div>
  );
}
