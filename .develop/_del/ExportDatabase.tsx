import { useState } from 'react';
import { firestoreFetchDoc, COLLECTIONS, DOCS, type SpeciesInfo } from '../../lib/firebase';
import { saveToFile } from '../../lib';

export default function ExportDatabase() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSaveToFile = async () => {
    setLoading(false);
    setMessage('');

    const filename = `species-backup-${new Date().toLocaleDateString()}.csv`;

    const { species } = await firestoreFetchDoc<{ species: SpeciesInfo[] }>(COLLECTIONS.APPLICATION, DOCS.BUNDLES);

    const csvContent = [];
    for (const { kingdom, order, family, species: s, sex, speciesLatin, place, county, date, image } of species) {
      csvContent.push(`${kingdom};${order};${family};${s};${sex};${speciesLatin};${place};${county};${date};${image}`);
    }

    // If we prepend \ufeff to the content the file will be saved as UTF-8 with BOM rather than UTF-8.
    const content = '\ufeff' + csvContent.join('\n');
    const file = new Blob([content], { type: 'text/csv;charset=utf-8,' });

    try {
      await saveToFile(file, filename, [
        {
          description: 'CSV files',
          accept: {
            'application/csv': ['.csv'],
          },
        },
      ]);
      setMessage(`File saved as ${filename}.`);
    } catch (error) {
      if (error === 'ABORTED') return;
      setMessage('Something went wrong.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <label htmlFor="filename">
        <b>Export species</b>
        <p>Export all species to a .csv file.</p>
        {message && (
          <ins>
            <small>{message}</small>
          </ins>
        )}
      </label>
      <button onClick={handleSaveToFile} aria-busy={loading}>
        Export species
      </button>
    </>
  );
}
