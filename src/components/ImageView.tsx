import { type ImageInfo } from '../lib/firebase';
import { Dialogs } from '.';

type Props = {
  images: ImageInfo[];
  show: (dialog: number, show?: boolean) => void;
};

export default function ImageView({ images, show }: Props) {
  const imageList = images.map(({ filename, downloadURL, thumbnailURL, updatedAt }) => (
    <figure className="gallery-image" key={filename}>
      <img src={thumbnailURL} alt={filename} loading="lazy" />
      <div className="info">
        <div>Namn: {filename}</div>
        <div>Skapad: {updatedAt.toDate().toLocaleDateString()}</div>
      </div>
    </figure>
  ));

  return (
    <div className="image-view">
      <div className="grid">
        <h1 id="images">Bilder</h1>
        <div className="header-buttons">
          <a href="#" role="button" onClick={() => show(Dialogs.UPLOAD_IMAGE_DIALOG)}>
            Ladd upp bild
          </a>
        </div>
      </div>
      <div className="gallery">{imageList}</div>
    </div>
  );
}
