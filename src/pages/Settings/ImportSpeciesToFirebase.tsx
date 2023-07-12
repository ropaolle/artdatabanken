import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, type SpeciesInfo } from '../../lib/firebase';

const SPECIES_COLLECTION = 'species';

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

export default function ImportSpeciesToFirebase() {
  const [importingSpecies, setImportingSpecies] = useState<States>(States.IDLE);
  const [species, setSpecies] = useState<SpeciesInfo[]>();
  const [speciesMessage, setSpeciesMessage] = useState('');

  const onHandleSpeciesImportChange = async (file: File | undefined) => {
    setImportingSpecies(States.IDLE);
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

    setImportingSpecies(States.UPLOADING);

    for await (const record of species) {
      addDoc(collection(db, SPECIES_COLLECTION), { ...record, createdAt: serverTimestamp() });
      setSpeciesMessage(`importing ${record.species}`);
    }

    setSpeciesMessage(`Done! ${species.length} species imported.`);

    setImportingSpecies(States.DONE);
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
      <button onClick={handleSpeciesImport} aria-busy={importingSpecies === States.UPLOADING}>
        Importera arter
      </button>
    </div>
  );
}
