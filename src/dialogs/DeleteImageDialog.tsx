import { useState } from 'react';
import { useStoreState, deleteImage, showDeleteImageDialog } from '../state';
import { doc, deleteDoc } from 'firebase/firestore';
import { db, deleteFile } from '../lib/firebase';
import Dialog, { DialogTypes } from './Dialog';

export default function DeleteImageDialog() {
  const { open, values } = useStoreState('deleteImageDialog');
  const [deletingImage, setDeletingImage] = useState(false);

  if (!values) return;

  const { filename, thumbnail, downloadURL, thumbnailURL, createdAt, updatedAt } = values;

  const handleDeleteImage = async () => {
    if (!filename || !thumbnail) return;

    setDeletingImage(true);

    Promise.all([await deleteFile(filename), await deleteFile(thumbnail), await deleteDoc(doc(db, 'images', filename))])
      .then(() => {
        deleteImage(filename);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setDeletingImage(false);
        showDeleteImageDialog(false);
      });
  };

  const hide = () => showDeleteImageDialog(false);

  return (
    <Dialog id={DialogTypes.DELETE_IMAGE_DIALOG} open={open} hide={hide} title={`Bild: ${filename}`}>
      <img src={downloadURL} alt={filename} />
      <table>
        <tbody>
          <tr>
            <td>Filnamn</td>
            <td>
              <a href={downloadURL} target="_blank">
                {filename}
              </a>
            </td>
          </tr>
          <tr>
            <td>Thumbnail</td>
            <td>
              <a href={thumbnailURL} target="_blank">
                {thumbnail}
              </a>
            </td>
          </tr>
          <tr>
            <td>Skapad</td>
            <td>{createdAt?.toDate().toLocaleString()}</td>
          </tr>
          <tr>
            <td>Uppdaterad</td>
            <td>{updatedAt?.toDate().toLocaleString()}</td>
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
