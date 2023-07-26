import { useState } from 'react';
import { doc, setDoc, Timestamp, getDocs, collection, deleteDoc } from 'firebase/firestore/lite';
import { type ImportStates } from '.';
import { fetchGlobalState } from '../../state';
import { db, COLLECTIONS, DOCS } from '../../lib/firebase';

export default function MergeChangesIntoBundle() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState<ImportStates>('IDLE');

  const handleCreateImageBundle = async () => {
    setLoading('BUSY');
    setMessage('');

    const { images, species } = await fetchGlobalState();

    // Update bundles
    setDoc(doc(db, COLLECTIONS.APPLICATION, DOCS.BUNDLES), { images }, { merge: true });
    setDoc(doc(db, COLLECTIONS.APPLICATION, DOCS.BUNDLES), { species }, { merge: true });

    // Clear the delete collection
    setDoc(doc(db, COLLECTIONS.APPLICATION, DOCS.DELETED), { images: [], species: [] } /* , { merge: true } */);

    // TODO: Do I need to batch this? https://cloud.google.com/firestore/docs/samples/firestore-data-delete-collection
    // Delete all new images and species
    const imageSnapshots = await getDocs(collection(db, COLLECTIONS.IMAGES));
    for (const { id } of imageSnapshots.docs) {
      deleteDoc(doc(db, COLLECTIONS.IMAGES, id));
    }
    const speciesSnapshots = await getDocs(collection(db, COLLECTIONS.SPECIES));
    for (const { id } of speciesSnapshots.docs) {
      deleteDoc(doc(db, COLLECTIONS.SPECIES, id));
    }

    setDoc(doc(db, COLLECTIONS.APPLICATION, DOCS.UPDATEDAT), { updatedAt: Timestamp.now() });
    setMessage(`Info of added and deleted...`);
    setLoading('DONE');
  };

  return (
    <>
      <label htmlFor="filename">
        <b>Merge changes</b>
        <p>Create new image and speices bundles that includes all changes.</p>
        <div>{message && <ins><small>{message}</small></ins>}</div>
      </label>
      <button onClick={handleCreateImageBundle} aria-busy={loading === 'BUSY'}>
        Merge changes into bundles
      </button>
    </>
  );
}
