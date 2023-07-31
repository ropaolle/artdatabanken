import { useState } from 'react';
import { doc, deleteDoc, updateDoc, arrayUnion, /* setDoc, arrayRemove, */ getDoc } from 'firebase/firestore/lite';
import { db, COLLECTIONS, PATHS, DOCS, deleteFile } from '../lib/firebase';
import Dialog from './Dialog';
import { timestampToString } from '../lib/';
import { useAppStore } from '../state';

type Props = {
  open: boolean;
  show: React.Dispatch<boolean>;
  values?: ImageInfo;
};

export default function DeleteImageDialog({ open, show, values }: Props) {
  const { deleteImage, user, species } = useAppStore();
  const [deletingImage, setDeletingImage] = useState(false);

  const imageIsUsedBy = species.filter(({ image }) => image === values?.filename).map(({ species }) => species);

  if (!values) return;

  const { filename, URL, createdAt, updatedAt } = values;

  const handleDeleteImage = async () => {
    if (!user || !filename) return;

    setDeletingImage(true);

    // Check if doc exists
    const check = await getDoc(doc(db, COLLECTIONS.IMAGES, filename));

    Promise.all([
      deleteFile(filename, PATHS.IMAGES),
      deleteFile(filename, PATHS.THUMBNAILS),
      // Delete doc if it exists. If not, it is part of a bundle and should just be flagged for deletion.
      check.exists()
        ? deleteDoc(doc(db, COLLECTIONS.IMAGES, filename))
        : updateDoc(doc(db, COLLECTIONS.APPLICATION, DOCS.DELETED), { images: arrayUnion(filename) }),
    ])
      .then(() => {
        deleteImage(filename);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setDeletingImage(false);
        show(false);
      });
  };

  const hide = () => show(false);

  return (
    <Dialog open={open} hide={hide} title={`Bild: ${filename}`}>
      <img src={URL} alt={filename} />
      <table>
        <tbody>
          <tr>
            <td>Används av</td>
            <td>{imageIsUsedBy.join(', ') || 'används ej'}</td>
          </tr>
          <tr>
            <td>Direktlänk</td>
            <td>
              <a href={URL} target="_blank">
                {filename}
              </a>
            </td>
          </tr>
          <tr>
            <td>Skapad</td>
            <td>{timestampToString(createdAt)}</td>
          </tr>
          <tr>
            <td>Uppdaterad</td>
            <td>{timestampToString(updatedAt)}</td>
          </tr>
        </tbody>
      </table>

      <footer>
        <div className="grid">
          <div></div>
          <button
            className="contrast"
            type="button"
            role="button"
            onClick={handleDeleteImage}
            disabled={!user}
            aria-busy={deletingImage}
          >
            Radera
          </button>
          <button className="secondary" type="button" role="button" onClick={hide}>
            Avbryt
          </button>
        </div>
      </footer>
    </Dialog>
  );
}
