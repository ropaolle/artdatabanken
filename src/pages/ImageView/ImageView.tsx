import { useState, useEffect } from 'react';
import Page from '../Page';
import { createCompareFn, type SortProps } from '../../lib';
import { Pager } from '../../components';
import { UploadImageDialog, DeleteImageDialog } from '../../dialogs';
import { useAppStore } from '../../state';
import ImageGrid from './ImageGrid';
import FilterAndSortForm from './FilterAndSortForm';

const pageSize = 50;

export default function ImageView() {
  const { images } = useAppStore();
  const [uploadDialog, showUploadDialog] = useState(false);
  const [deleteDialog, showDeleteDialog] = useState(false);
  const [dialogValues, setDialogValues] = useState<ImageInfo>();
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState<SortProps<ImageInfo>>({ property: 'filename', order: 'desc' });
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

  return (
    <Page title="Bilder" headerButtonTitle="Ladda upp bild" onHeaderButtonClick={() => showUploadDialog(true)}>
      <UploadImageDialog open={uploadDialog} show={showUploadDialog} />
      <DeleteImageDialog open={deleteDialog} show={showDeleteDialog} values={dialogValues} />
      <FilterAndSortForm setFilter={setFilter} setSort={setSort} />
      <ImageGrid images={list} onClick={handleImageClick} />
      <Pager active={page} count={images?.length || 0} pageSize={pageSize} onClick={setPage} />
    </Page>
  );
}
