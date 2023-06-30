import { type ImageInfo } from '../lib/firebase';
import { Dialogs } from '.';

type Props = {
  images: ImageInfo[];
  show: (dialog: number, show?: boolean) => void;
};

export default function ImageView({ images, show }: Props) {
  const imageList = images.map(({ filename, downloadURL, thumbnailURL, updatedAt }) => (
    <figure className="gallery-image" key={filename}>
      <div className='zoom'><img src={thumbnailURL} alt={filename} loading="lazy" /></div>
      {/* <div className="info">
        <div>{filename}</div>
     
      </div> */}
     
    </figure>
  ));

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
