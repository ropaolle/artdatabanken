import { useState } from 'react';
import { doc, setDoc, Timestamp } from 'firebase/firestore/lite';
import { fetchGlobalState } from '../../state';
import { db, COLLECTIONS, DOCS, deleteCollection } from '../../lib/firebase';

export default function MergeChangesIntoBundle() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMergeChanges = async () => {
    setLoading(true);
    setMessage('');

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
    setMessage(`${deletedImages} images and ${deletedSpecies} species merged into the new bundle and then deleted.`);
    setLoading(false);
  };

  return (
    <>
      <label htmlFor="filename">
        <b>Merge changes</b>
        <p>Create new image and speices bundles that includes all changes.</p>
        <div>
          {message && (
            <ins>
              <small>{message}</small>
            </ins>
          )}
        </div>
      </label>
      <button onClick={handleMergeChanges} aria-busy={loading}>
        Merge changes into bundles
      </button>
    </>
  );
}
