import { useState } from 'react';
import { deleteImage } from '../state';
import { doc, deleteDoc } from 'firebase/firestore';
import { db, deleteFile } from '../lib/firebase';
import Dialog from './Dialog';
import { timestampToString } from '../lib/';
import { useAppStore } from '../lib/zustand';

export default function DeleteImageDialog() {
  const {
    state: { open, values },
    show,
  } = useAppStore((state) => state.deleteImageDialog);
  const [deletingImage, setDeletingImage] = useState(false);

  if (!values) return;

  const { filename, thumbnail, URL, thumbnailURL, createdAt, updatedAt } = values;

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
            <td>Filnamn</td>
            <td>
              <a href={URL} target="_blank">
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
