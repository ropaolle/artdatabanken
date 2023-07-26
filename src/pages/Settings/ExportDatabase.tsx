import { useState } from 'react';
import { firestoreFetchDoc, COLLECTIONS, DOCS, type SpeciesInfo } from '../../lib/firebase';
import { type ImportStates } from '.';

export default function ExportDatabase() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState<ImportStates>('IDLE');

  const saveToFile = (filename: string, content: string) => {
    const link = document.createElement('a');
    const file = new Blob([content], { type: 'text/csv;charset=utf-8,' });
    link.href = URL.createObjectURL(file);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleSaveToFile = async () => {
    setLoading('BUSY');

    const { species } = await firestoreFetchDoc<{ species: SpeciesInfo[] }>(COLLECTIONS.APPLICATION, DOCS.BUNDLES);

    const csvContent = [];
    for (const { kingdom, order, family, species: s, sex, speciesLatin, place, county, date, image } of species) {
      csvContent.push(`${kingdom};${order};${family};${s};${sex};${speciesLatin};${place};${county};${date};${image}`);
    }

    try {
      // TODO: Add fallback if showSaveFilePicker is not supported https://web.dev/patterns/files/save-a-file/
      const handle = await showSaveFilePicker({
        suggestedName: `species-backup-${new Date().toLocaleDateString()}.csv`,
        types: [
          {
            description: 'CSV files',
            accept: {
              'application/csv': ['.scv'],
            },
          },
        ],
      });

      const filename = handle.name;

      // If we prepend \ufeff to the content the file will be saved as UTF-8 with BOM rather than UTF-8.
      saveToFile(filename, '\ufeff' + csvContent.join('\n'));

      setMessage(`File saved as ${filename}.`);
      setLoading('DONE');
    } catch (error) {
      if (error instanceof DOMException && error.stack === 'Error: The user aborted a request.') {
        setLoading('IDLE');
        return;
      }
      console.error(error);
    }
  };

  return (
    <>
      <label htmlFor="filename">
        <b>Export species</b>
        <p>Export all species to a .csv file.</p>
        <div>{message && <small>{message}</small>}</div>
      </label>
      <button onClick={handleSaveToFile} aria-busy={loading === 'BUSY'}>
        Export species
      </button>
    </>
  );
}
