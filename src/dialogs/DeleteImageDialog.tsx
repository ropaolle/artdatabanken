import { useState } from 'react';
import { deleteImage } from '../state';
import { doc, deleteDoc } from 'firebase/firestore';
import { db, type ImageInfo, deleteFile } from '../lib/firebase';
import Dialog, { type DialogProps } from './Dialog';

interface Props extends DialogProps {
  image: ImageInfo | undefined;
}

export default function DeleteImageDialog({ id, open, show, children, image }: Props) {
  const [deletingImage, setDeletingImage] = useState(false);

  // TODO: Destruct image ...

  const handleDeleteImage = async () => {
    const { filename, thumbnail } = image || {};
    if (!filename || !thumbnail) return;

    setDeletingImage(true);

    Promise.all([await deleteFile(filename), await deleteFile(thumbnail), await deleteDoc(doc(db, 'images', filename))])
      .then(() => {
        deleteImage(filename);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setDeletingImage(false);
        show(id, false);
      });
  };

  return (
    <Dialog {...{ id, open, show, children }} title={`Bild: ${image?.filename}`}>
      {image && (
        <>
          <img src={image.downloadURL} alt={image.filename} />
          <table>
            <tbody>
              <tr>
                <td>Filnamn</td>
                <td>
                  <a href={image.downloadURL} target="_blank">
                    {image.filename}
                  </a>
                </td>
              </tr>
              <tr>
                <td>Thumbnail</td>
                <td>
                  <a href={image.thumbnailURL} target="_blank">
                    {image.thumbnail}
                  </a>
                </td>
              </tr>
              <tr>
                <td>Skapad</td>
                <td>{image.createdAt?.toDate().toLocaleString()}</td>
              </tr>
              <tr>
                <td>Uppdaterad</td>
                <td>{image.updatedAt?.toDate().toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </>
      )}
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
          <button className="secondary" type="button" role="button" onClick={() => show(id, false)}>
            Avbryt
          </button>
        </div>
      </footer>
    </Dialog>
  );
}
