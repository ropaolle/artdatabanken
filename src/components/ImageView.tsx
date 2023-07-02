import { useStoreState, showDeleteImageDialog, showUploadImageDialog } from '../state';

export default function ImageView() {
  const images = useStoreState('images');

  if (!images) return null;

  const imageList = images.map((image) => {
    const { filename, thumbnail, downloadURL, thumbnailURL, updatedAt } = image;
    return (
      <figure
        className="gallery-image"
        key={filename}
        onClick={() => showDeleteImageDialog(true, image)}
        // onClick={() => show(DialogTypes.DELETE_IMAGE_DIALOG, true, image)}
      >
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
          <button role="button" onClick={() => showUploadImageDialog(true)}>
            Ladd upp bild
          </button>
        </div>
      </div>
      <div className="gallery">{imageList}</div>
    </div>
  );
}
