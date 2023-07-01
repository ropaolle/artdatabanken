import { ImageInfo } from '../lib/firebase';
import { Dialog, type DialogProps } from '.';

interface Props extends DialogProps {
  image: ImageInfo | undefined;
}

export default function ImageDeleteDialog({ id, open, show, children, image }: Props) {
  // const { filename, downloadURL, thumbnail, thumbnailURL, createdAt, updatedAt } = image || {};
  const deleteImage = () => {
    // TODO: Firebase delete
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
