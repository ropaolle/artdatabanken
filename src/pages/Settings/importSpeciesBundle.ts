import { doc, setDoc, Timestamp } from 'firebase/firestore/lite';
import { db, type SpeciesInfo, COLLECTIONS, DOCS } from '../../lib/firebase';
import readUploadedFileAsText from './readUploadedFileAsText';

export default async function importSpeciesBundle(file?: File) {
  if (!file) return [];

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

  await setDoc(doc(db, COLLECTIONS.APPLICATION, DOCS.BUNDLES), { species: speciesCollection }, { merge: true });
  await setDoc(doc(db, COLLECTIONS.APPLICATION, DOCS.DELETED), { species: [] }, { merge: true });
  await setDoc(doc(db, COLLECTIONS.APPLICATION, DOCS.UPDATEDAT), { updatedAt: Timestamp.now() });

  return speciesCollection;
}
