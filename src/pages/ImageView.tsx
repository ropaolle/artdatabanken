import classes from './ImageView.module.css';
import { useState, useEffect } from 'react';
import { useStoreState, showDeleteImageDialog, showUploadImageDialog } from '../state';
import { type ImageInfo } from '../lib/firebase';
import Page from './Page';
import { toOptions, createSortFunc } from '../lib';
import { Pager } from '../components';

const sortStates = [
  { label: 'Filnamn (stigande)', value: 'filename-ascending' },
  { label: 'Filnamn (fallande)', value: 'filename-descending' },
  { label: 'Datum (stigande)', value: 'date-ascending' },
  { label: 'Datum (fallande)', value: 'date-descending' },
];

const pageSize = 3;

export default function ImageView() {
  const images = useStoreState('images');
  const [items, setItems] = useState(images);
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState({ column: 'filename', ascending: false });
  const [page, setPage] = useState(0);
  const [list, setList] = useState(items);

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
    const filtered = items.filter((item) => item.filename.toLowerCase().includes(filter));
    const sorted = filtered.sort(createSortFunc<ImageInfo>(sort));
    const paged = sorted.slice(page * pageSize, (page + 1) * pageSize);

    setList(paged);
  }, [items, filter, sort, page]);

  if (!images) return null;

  const imageList = list.map((image) => {
    const { filename, /* thumbnail, downloadURL, */ thumbnailURL, updatedAt, createdAt } = image;
    return (
      <figure className={classes.imageCell} key={filename} onClick={() => showDeleteImageDialog(true, image)}>
        <img className={classes.image} src={thumbnailURL} alt={filename} /* loading="lazy" */ />
        <div className={classes.info}>
          {filename}
          <br />
          {updatedAt?.toDate().toLocaleDateString() || createdAt?.toDate().toLocaleDateString()}
        </div>
      </figure>
    );
  });

  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

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
      <Pager active={page} count={items.length} pageSize={pageSize} onClick={setPage} />
    </Page>
  );
}
