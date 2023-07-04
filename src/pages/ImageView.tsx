import classes from './ImageView.module.css';
import { useState, useEffect } from 'react';
import { useStoreState, showDeleteImageDialog, showUploadImageDialog } from '../state';
import Page from './Page';

export default function ImageView() {
  const images = useStoreState('images');
  const [filter, setFilter] = useState('');
  const [items, setItems] = useState(images);

  useEffect(() => {
    const filteredImages = images.filter((item) => item.filename.toLowerCase().includes(filter));
    setItems(filteredImages);
  }, [images, filter]);

  if (!images) return null;

  const imageList = items.map((image) => {
    const { filename, /* thumbnail, downloadURL, */ thumbnailURL /* , updatedAt */ } = image;
    return (
      <figure className={classes.imageCell} key={filename} onClick={() => showDeleteImageDialog(true, image)}>
        <img className={classes.image} src={thumbnailURL} alt={filename} loading="lazy" />
        <div className={classes.info}>{filename}</div>
      </figure>
    );
  });

  const handleFilterChange = (value: string) => setFilter(value);

  return (
    <Page title="Bilder" headerButtonTitle="Ladda upp bild" onHeaderButtonClick={() => showUploadImageDialog(true)}>
      <form>
        <div className="grid">
          <label htmlFor="all">
            Fritextsökning
            <input id="all" onChange={(e) => handleFilterChange(e.target.value)} />
          </label>
        </div>
      </form>
      <div className={classes.gallery}>{imageList}</div>
    </Page>
  );
}
