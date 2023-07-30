import { doc, setDoc, Timestamp } from 'firebase/firestore/lite';
import { fetchGlobalState } from '../../state';
import { db, COLLECTIONS, DOCS, deleteCollection } from '../../lib/firebase';

export default async function mergeChangesIntoBundle() {
  const { images, species } = await fetchGlobalState();

  // Update bundles
  await setDoc(doc(db, COLLECTIONS.APPLICATION, DOCS.BUNDLES), { images }, { merge: true });
  await setDoc(doc(db, COLLECTIONS.APPLICATION, DOCS.BUNDLES), { species }, { merge: true });

  // Clear the delete collection
  await setDoc(doc(db, COLLECTIONS.APPLICATION, DOCS.DELETED), { images: [], species: [] } /* , { merge: true } */);

  // Delete all new images and species
  const deletedImages = await deleteCollection(COLLECTIONS.IMAGES);
  const deletedSpecies = await deleteCollection(COLLECTIONS.SPECIES);

  await setDoc(doc(db, COLLECTIONS.APPLICATION, DOCS.UPDATEDAT), { updatedAt: Timestamp.now() });

  return [deletedImages, deletedSpecies];
  // setMessage(`${deletedImages} images and ${deletedSpecies} species merged into the new bundle and then deleted.`);
}
