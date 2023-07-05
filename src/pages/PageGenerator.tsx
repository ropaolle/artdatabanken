import { useState } from 'react';
import Page from './Page';
import { importData, importImages } from '../lib/firebase';

export default function PageGenerator() {
  const [images, setImages] = useState<FileList>();

  const onHandleFileChange = (e: React.ChangeEvent<HTMLInputElement> /*  | undefined */) => {
    // console.log('e', e.currentTarget.files);
    setImages(e.currentTarget.files || undefined);
  };

  const handleImport = () => {
    if (images && images[0]) {
      importImages(images, 'images2022');
      console.log('images', images);
    }
  };

  return (
    <Page title="Sidgenerator" headerButtonTitle="Ladd upp..." onHeaderButtonClick={handleImport}>
      Innehåll ...
      <input type="file" onChange={onHandleFileChange} multiple />
    </Page>
  );
}
