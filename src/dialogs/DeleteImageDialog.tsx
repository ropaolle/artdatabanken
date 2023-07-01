import { doc, deleteDoc } from 'firebase/firestore';
import { db, type ImageInfo, deleteFile } from '../lib/firebase';
import Dialog, { type DialogProps } from './Dialog';

interface Props extends DialogProps {
  image: ImageInfo | undefined;
}

export default function DeleteImageDialog({ id, open, show, children, image }: Props) {
  const deleteImage = async () => {
    if (!image?.filename) return;

    try {
      await deleteFile(image.filename);
    } catch (error) {
      console.error(error);
    }

    try {
      await deleteFile(image.thumbnail);
    } catch (error) {
      console.error(error);
    }

    try {
      await deleteDoc(doc(db, 'images', image.filename));
    } catch (error) {
      console.error(error);
    }
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
          <button className="contrast" type="button" role="button" onClick={deleteImage}>
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
