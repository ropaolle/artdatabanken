import { useEffect, useState } from 'react';
import { type Timestamp } from 'firebase/firestore';
import { getImages } from '../lib/firebase.ts';

type ImageInfo = {
  filename: string;
  downloadURL: string;
  updatedAt: Timestamp;
};

export default function ImageView() {
  const [imageList, setImageList] = useState<ImageInfo[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const images = await getImages();
      setImageList(images);
    };

    fetchData().catch(console.error);
  }, []);

  const images = imageList.map(({ filename, downloadURL, updatedAt }) => (
    <figure className="gallery-image" key={filename}>
      <img src={downloadURL} alt={filename} loading="lazy" />
      <div className="info">
        <div>Namn: {filename}</div>
        <div>Skapad: {updatedAt.toDate().toLocaleDateString()}</div>
      </div>
    </figure>
  ));

  return (
    <div className="gallery">
      {images}
      {images}
    </div>
  );
}
