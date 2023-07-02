import { useGlobalState } from '../state';
import { Dialogs, type ShowDialog } from '../dialogs';

type Props = {
  show: ShowDialog;
};

export default function ImageView({ show }: Props) {
  const [value] = useGlobalState('app');

  if (!value?.images) return null;

  const imageList = value.images.map((image) => {
    const { filename, thumbnail, downloadURL, thumbnailURL, updatedAt } = image;
    return (
      <figure className="gallery-image" key={filename} onClick={() => show(Dialogs.DELETE_IMAGE_DIALOG, true, image)}>
        <div className="zoom">
          <img src={thumbnailURL} alt={filename} loading="lazy" />
        </div>
      </figure>
    );
  });

  return (
    <div className="image-view">
      <div className="grid">
        <h1 id="images">Bilder</h1>
        <div className="header-buttons">
          <button role="button" onClick={() => show(Dialogs.UPLOAD_IMAGE_DIALOG, true)}>
            Ladd upp bild
          </button>
        </div>
      </div>
      <div className="gallery">{imageList}</div>
    </div>
  );
}
