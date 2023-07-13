import classes from './ImageView.module.css';
import { useState, useEffect } from 'react';
import { useStoreState } from '../state';
import { type ImageInfo } from '../lib/firebase';
import Page from './Page';
import { createSortFunc, timestampToString } from '../lib';
import { toOptions } from '../lib/options';
import { Pager } from '../components';
import { UploadImageDialog, DeleteImageDialog } from '../dialogs';

const sortStates = [
  { label: 'Filnamn (stigande)', value: 'filename-ascending' },
  { label: 'Filnamn (fallande)', value: 'filename-descending' },
  { label: 'Datum (stigande)', value: 'date-ascending' },
  { label: 'Datum (fallande)', value: 'date-descending' },
];

const pageSize = 50;

export default function ImageView() {
  const images = useStoreState('images');
  const [uploadDialog, showUploadDialog] = useState(false);
  const [deleteDialog, showDeleteDialog] = useState(false);
  const [dialogValues, setDialogValues] = useState<ImageInfo>();
  const [items, setItems] = useState<ImageInfo[]>();
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState({ column: 'filename', ascending: false });
  const [page, setPage] = useState(0);
  const [list, setList] = useState<ImageInfo[]>();

  // Add a date field used by sort
  useEffect(() => {
    setItems(
      images.map((image) => ({
        ...image,
        date: timestampToString(image.updatedAt || image.createdAt),
      }))
    );
  }, [images]);

  useEffect(() => {
    if (!items) return;

    const filtered = items.filter((item) => item.filename.toLowerCase().includes(filter));
    const sorted = filtered.sort(createSortFunc<ImageInfo>(sort));
    const paged = sorted.slice(page * pageSize, (page + 1) * pageSize);

    setList(paged);
  }, [items, filter, sort, page]);

  if (!images) return null;

  const handleImageClick = (image: ImageInfo) => {
    setDialogValues(image);
    showDeleteDialog(true);
  };

  const imageList =
    list &&
    list.map((image) => {
      const { filename, /* thumbnail, URL, */ thumbnailURL, updatedAt, createdAt } = image;
      return (
        <figure className={classes.imageCell} key={filename} onClick={() => handleImageClick(image)}>
          <img className={classes.image} src={thumbnailURL} alt={filename} /* loading="lazy" */ />
          <div className={classes.info}>
            <div>{filename}</div>
            <div>
              <small>({timestampToString(updatedAt || createdAt)})</small>
            </div>
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
    <Page title="Bilder" headerButtonTitle="Ladda upp bild" onHeaderButtonClick={() => showUploadDialog(true)}>
      <UploadImageDialog open={uploadDialog} show={showUploadDialog} />
      <DeleteImageDialog open={deleteDialog} show={showDeleteDialog} values={dialogValues} />

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
      <Pager active={page} count={items?.length || 0} pageSize={pageSize} onClick={setPage} />
    </Page>
  );
}
