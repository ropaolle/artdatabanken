import { type ImageInfo } from '../lib/firebase';

type Props = {
  images: ImageInfo[];
};

export default function ImageView({ images }: Props) {
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
    <div className="species-view">
      <h1 id="images">Bilder</h1>
      <div className="gallery">{imageList}</div>
    </div>
  );
}
