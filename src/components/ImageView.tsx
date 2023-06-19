import { useEffect, useState } from 'react';
import { getImages } from '../lib/firebase.ts';

export default function ImageView() {
  const [imageList, setImageList] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const images = await getImages();
      setImageList(images);
    };

    fetchData().catch(console.error);
  }, []);

  const images = imageList.map(({ filename, downloadURL, updatedAt }) => (
    <div key={filename} >
      <img src={downloadURL} width={100} />
      {/* <div>{updatedAt}</div> */}
      <div>{updatedAt.toDate().toString()}</div>
    </div>
  ));

  // console.log('images', imageList);

  return (
    <>
      <h3>Bilder</h3>
      <div className="row">
        <div className="column">
          {images}          
        </div>
        <div className="column">
          {images}          
        </div>
      </div>
    </>
  );
}
