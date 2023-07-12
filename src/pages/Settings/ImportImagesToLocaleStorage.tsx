import { useState } from 'react';
import { Timestamp } from 'firebase/firestore';
import { getURL, type ImageInfo } from '../../lib/firebase';
import { useLocalStorage } from 'usehooks-ts';
import { readUploadedFileAsText, ImportStates } from '.';

export default function ImportImagesToLocaleStorage() {
  const [imageList, setImageList] = useLocalStorage<ImageInfo[]>('imageList', []);

  const [importingLocaleStorage, setImportingLocaleStorage] = useState<ImportStates>(ImportStates.IDLE);
  const [localeStorage, setLocaleStorage] = useState<string[]>();
  const [localeStorageMessage, setlocaleStorageMessage] = useState('');

  const onHandleImportLocaleStorageChange = async (file: File | undefined) => {
    if (!file) return;

    const content = await readUploadedFileAsText(file);
    const images = content.split('\r\n');
    setLocaleStorage(images);
  };

  const handleLocaleStorageImport = async () => {
    if (!localeStorage) return;
    setImportingLocaleStorage(ImportStates.UPLOADING);

    const data: ImageInfo[] = [];
    for await (const image of localeStorage) {
      setlocaleStorageMessage(`adding ${image}`);
      const thumbnail = image.replace('.jpg', '') + '_thumbnail.jpg';
      data.push({
        filename: image,
        URL: await getURL(`images/${image}`),
        thumbnail,
        thumbnailURL: await getURL(`images/${thumbnail}`),
        createdAt: Timestamp.fromDate(new Date()),
      });
    }

    setImageList(data);
    setlocaleStorageMessage(`Done! ${Object.keys(data).length} images imported.`);
    setImportingLocaleStorage(ImportStates.DONE);
  };

  return (
    <div>
      <label htmlFor="importlocalstorage">
        <b>Locale storage</b>
        <input
          id="importlocalstorage"
          type="file"
          accept=".txt"
          onChange={(e) => onHandleImportLocaleStorageChange(e.currentTarget.files?.[0])}
        />
        {localeStorageMessage && <small>{localeStorageMessage}</small>}
      </label>
      <button onClick={handleLocaleStorageImport} aria-busy={importingLocaleStorage === ImportStates.UPLOADING}>
        Importera till 'locale storage'
      </button>
    </div>
  );
}
