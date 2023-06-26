import { useEffect, useState } from 'react';
import { type Timestamp } from 'firebase/firestore';
import { getImages } from '../lib/firebase.ts';

export default function SpeciesView() {
  const [images, setimages] = useState<ImageInfo[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log('fetch data');
      const data = await getImages();
      console.log('data', data);
      setimages(data);
    };

    fetchData().catch(console.error);
  }, [images]);

  const imageList = images.map(({ filename, downloadURL, updatedAt }) => (
    <figure className="gallery-image" key={filename}>
      <img src={downloadURL} alt={filename} loading="lazy" />
      <div className="info">
        <div>Namn: {filename}</div>
        <div>Skapad: {updatedAt.toDate().toLocaleDateString()}</div>
      </div>
    </figure>
  ));

  return <div className="gallery">{imageList}</div>;
}
