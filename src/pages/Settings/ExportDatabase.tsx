import { useState } from 'react';
import { firestoreFetch, type Bundles } from '../../lib/firebase';
import { ImportStates } from '.';

export default function ExportDatabase() {
  const [filename, setFilename] = useState(`species-backup-${new Date().toLocaleDateString()}.csv`);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState<ImportStates>(ImportStates.IDLE);

  const saveToFile = (filename: string, content: string) => {
    const link = document.createElement('a');
    const file = new Blob([content], { type: 'text/csv;charset=utf-8,' });
    link.href = URL.createObjectURL(file);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleSaveToFile = async () => {
    setSaving(ImportStates.UPLOADING);

    const [{ species }] = await firestoreFetch<Bundles>('bundles');

    const csvContent = [];
    for (const { kingdom, order, family, species: s, sex, speciesLatin, place, county, date, image } of species) {
      csvContent.push(`${kingdom};${order};${family};${s};${sex};${speciesLatin};${place};${county};${date};${image}`);
    }
    // If we prepend \ufeff to the content the file will be saved as UTF-8 with BOM rather than UTF-8.
    saveToFile(filename, '\ufeff' + csvContent.join('\n'));

    setMessage(`File saved as ${filename}.`);
    setSaving(ImportStates.DONE);
  };

  return (
    <div>
      <label htmlFor="filename">
        <b>Filname</b>
        <input id="filename" value={filename} onChange={(e) => setFilename(e.currentTarget.value)} />
        <div>{message && <small>{message}</small>}</div>
      </label>
      <button onClick={handleSaveToFile} aria-busy={saving === ImportStates.UPLOADING}>
        Exportera databas
      </button>
    </div>
  );
}
