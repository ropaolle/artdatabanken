import { useState } from 'react';
import { db, COLLECTIONS } from '../../lib/firebase';
import { type ImportStates } from '.';
import { doc, setDoc, Timestamp, getDocs, collection, deleteDoc } from 'firebase/firestore/lite';
import { fetchGlobalState } from '../../lib/state';

export default function MergeChangesIntoBundle() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState<ImportStates>('IDLE');

  const handleCreateImageBundle = async () => {
    setLoading('BUSY');
    setMessage('');

    const { images, species } = await fetchGlobalState();

    // Update bundles
    setDoc(doc(db, COLLECTIONS.APPLICATION, 'bundles'), { images }, { merge: true });
    setDoc(doc(db, COLLECTIONS.APPLICATION, 'bundles'), { species }, { merge: true });

    // Clear the delete collection
    setDoc(doc(db, COLLECTIONS.APPLICATION, 'deleted'), { images: [], species: [] } /* , { merge: true } */);

    // Delete all new images and species
    // TODO: Do I need to batch this? https://cloud.google.com/firestore/docs/samples/firestore-data-delete-collection
    const imageSnapshots = await getDocs(collection(db, COLLECTIONS.IMAGES));
    for (const { id } of imageSnapshots.docs) {
      deleteDoc(doc(db, COLLECTIONS.IMAGES, id));
    }
    const speciesSnapshots = await getDocs(collection(db, COLLECTIONS.SPECIES));
    for (const { id } of speciesSnapshots.docs) {
      deleteDoc(doc(db, COLLECTIONS.SPECIES, id));
    }

    setDoc(doc(db, COLLECTIONS.APPLICATION, 'updatedAt'), { updatedAt: Timestamp.now() });
    setMessage(`Info of added and deleted...`);
    setLoading('DONE');
  };

  return (
    <>
      <label htmlFor="filename">
        <b>Merge changes</b>
        <p>Create new image and speices bundles that includes all changes.</p>
        <div>{message && <small>{message}</small>}</div>
      </label>
      <button onClick={handleCreateImageBundle} aria-busy={loading === 'BUSY'}>
        Merge changes into bundles
      </button>
    </>
  );
}
