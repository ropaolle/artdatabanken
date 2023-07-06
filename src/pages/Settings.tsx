import { useState } from 'react';
import Page from './Page';
import { importData, importImages, type SpeciesInfo } from '../lib/firebase';

const readUploadedFileAsText = (file: File): Promise<string /*  | null */> => {
  const fileReader = new FileReader();

  return new Promise((resolve, reject) => {
    fileReader.onerror = () => {
      fileReader.abort();
      reject(new DOMException('Problem parsing input file.'));
    };

    fileReader.onload = () => {
      resolve(fileReader.result as string);
    };
    fileReader.readAsText(file);
  });
};

export default function Settings() {
  const [images, setImages] = useState<FileList>();

  const onHandleImageImportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImages(e.currentTarget.files || undefined);
  };

  const onHandleSpeciesImportChange = async (file: File | undefined) => {
    if (!file) return;
    
    const speciesCollection: SpeciesInfo[] = [];

    try {
      const content = await readUploadedFileAsText(file);
      const records = content.split('\n').map((row: string) => row.split(';'));
      
      for (const [kingdom, order, family, species, sex, speciesLatin, place, county, date, image] of records) {
        speciesCollection.push({ kingdom, order, family, species, sex, speciesLatin, place, county, date, image })
      }

      console.log('speciesCollection', speciesCollection);
    } catch (error) {
      console.error(error);
    }
  };

  const handleImport = () => {
    if (images && images[0]) {
      importImages(images, 'images2022');
      console.log('images', images);
    }
  };

  return (
    <Page title="Inställningar">
      <div className="grid">
        <div>
          <input type="file" onChange={onHandleImageImportChange} multiple />
          <button>Importera bilder</button>
        </div>
        <div>
          <input type="file" accept=".csv" onChange={(e) => onHandleSpeciesImportChange(e.currentTarget.files?.[0])} />
          <button>Importera arter</button>
        </div>
      </div>
    </Page>
  );
}
