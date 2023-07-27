import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore/lite';
import { db } from '.';

// INFO: In case of big collections we probobly need to use batch, see
// https://cloud.google.com/firestore/docs/samples/firestore-data-delete-collection.

export default async (path: string) => {
  const imageSnapshots = await getDocs(collection(db, path));

  let deleteCount = 0;
  for await (const { id } of imageSnapshots.docs) {
    try {
      await deleteDoc(doc(db, path, id));
      deleteCount += 1;
    } catch (error) {
      console.error(error);
    }
  }

  return deleteCount;
};
