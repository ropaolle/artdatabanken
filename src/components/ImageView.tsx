import { type ImageInfo } from '../lib/firebase';
import { Dialogs, type ShowDialog } from '.';

type Props = {
  images: ImageInfo[];
  show: ShowDialog;
  // show: (dialog: number, show?: boolean) => void;
};

export default function ImageView({ images, show }: Props) {
  const imageList = images.map((image) => {
    const { filename, thumbnail, downloadURL, thumbnailURL, updatedAt } = image;
    return (
      <figure className="gallery-image" key={filename} onClick={() => show(Dialogs.DELETE_IMAGE_DIALOG, true, image)}>
        <div className="zoom">
          <img src={thumbnailURL} alt={filename} loading="lazy" />
        </div>
        {/* <div className="info">
        <div>{filename}</div>
     
      </div> */}
      </figure>
    );
  });

  return (
    <div className="image-view">
      <div className="grid">
        <h1 id="images">Bilder</h1>
        <div className="header-buttons">
          <button role="button" onClick={() => show(Dialogs.UPLOAD_IMAGE_DIALOG)}>
            Ladd upp bild
          </button>
        </div>
      </div>
      <div className="gallery">{imageList}</div>
    </div>
  );
}
