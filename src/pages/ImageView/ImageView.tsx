import { useState, useEffect } from 'react';
import { type ImageInfo } from '../../lib/firebase';
import Page from '../Page';
import { createCompareFn, type SortProps } from '../../lib';
import { toOptions } from '../../lib/options';
import { Pager } from '../../components';
import { UploadImageDialog, DeleteImageDialog } from '../../dialogs';
import { useAppStore } from '../../state';
import ImageGrid from './ImageGrid';

type SortState<T> = { label: string; value: string } & SortProps<T>;

const sortStates: SortState<ImageInfo>[] = [
  { label: 'Filnamn (stigande)', value: '0', property: 'filename', order: 'asc' },
  { label: 'Filnamn (fallande)', value: '1', property: 'filename', order: 'desc' },
  { label: 'Datum (stigande)', value: '2', property: 'updatedAt', order: 'asc' },
  { label: 'Datum (fallande)', value: '3', property: 'updatedAt', order: 'desc' },
];

const pageSize = 50;

export default function ImageView() {
  const { images } = useAppStore();
  const [uploadDialog, showUploadDialog] = useState(false);
  const [deleteDialog, showDeleteDialog] = useState(false);
  const [dialogValues, setDialogValues] = useState<ImageInfo>();
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState(sortStates[0]);
  const [page, setPage] = useState(0);
  const [list, setList] = useState<ImageInfo[]>([]);

  useEffect(() => {
    const filtered = images.filter((image) => image.filename.toLowerCase().includes(filter));
    const sorted = filtered.sort(createCompareFn<ImageInfo>(sort));
    const paged = sorted.slice(page * pageSize, (page + 1) * pageSize);

    setList(paged);
  }, [images, filter, sort, page]);

  const handleImageClick = (image: ImageInfo) => {
    setDialogValues(image);
    showDeleteDialog(true);
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  const handleSortChange = (value: string) => {
    setSort(sortStates[Number(value)]);
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
      <ImageGrid images={list} onClick={handleImageClick} />
      <Pager active={page} count={images?.length || 0} pageSize={pageSize} onClick={setPage} />
    </Page>
  );
}
