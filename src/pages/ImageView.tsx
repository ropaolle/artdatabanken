import classes from './ImageView.module.css';
import { useState, useEffect } from 'react';
import { useStoreState, showDeleteImageDialog, showUploadImageDialog } from '../state';
import { type ImageInfo } from '../lib/firebase';
import Page from './Page';
import { toOptions, createSortFunc } from '../lib';

const sortStates = [
  { label: 'Filnamn (stigande)', value: 'filename-ascending' },
  { label: 'Filnamn (fallande)', value: 'filename-descending' },
  { label: 'Datum (stigande)', value: 'date-ascending' },
  { label: 'Datum (fallande)', value: 'date-descending' },
];

export default function ImageView() {
  const images = useStoreState('images');
  const [filter, setFilter] = useState('');
  const [items, setItems] = useState(images);
  const [sort, setSort] = useState({ column: 'filename', ascending: false });

  // Add a date field used by sort
  useEffect(() => {
    setItems(
      images.map((image) => ({
        ...image,
        date: image.updatedAt?.toDate().toLocaleDateString() || image.createdAt?.toDate().toLocaleDateString(),
      }))
    );
  }, [images]);

  useEffect(() => {
    setItems((prevValues) => {
      return prevValues
        .filter((item) => item.filename.toLowerCase().includes(filter))
        .sort(createSortFunc<ImageInfo>(sort));
    });
  }, [filter, sort]);

  if (!images) return null;

  const imageList = items.map((image) => {
    const { filename, /* thumbnail, downloadURL, */ thumbnailURL, updatedAt, createdAt } = image;
    return (
      <figure className={classes.imageCell} key={filename} onClick={() => showDeleteImageDialog(true, image)}>
        <img className={classes.image} src={thumbnailURL} alt={filename} loading="lazy" />
        <div className={classes.info}>
          {filename}
          <br />
          {updatedAt?.toDate().toLocaleDateString() || createdAt?.toDate().toLocaleDateString()}
        </div>
      </figure>
    );
  });

  const handleFilterChange = (value: string) => setFilter(value);

  const handleSortChange = (value: string) => {
    const [column, direction] = value.split('-');
    setSort({ column, ascending: direction === 'ascending' });
  };

  return (
    <Page title="Bilder" headerButtonTitle="Ladda upp bild" onHeaderButtonClick={() => showUploadImageDialog(true)}>
      <form>
        <div className="grid">
          <label htmlFor="all">
            Filnamn
            <input id="all" onChange={(e) => handleFilterChange(e.target.value)} />
          </label>

          <label htmlFor="sort">
            Sortering
            <select id="sort" onChange={(e) => handleSortChange(e.target.value)}>
              {toOptions(sortStates)}
            </select>
          </label>
        </div>
      </form>
      <div className={classes.gallery}>{imageList}</div>
    </Page>
  );
}
