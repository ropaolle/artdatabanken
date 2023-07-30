import { useState, useRef } from 'react';
import importSpeciesBundle from './importSpeciesBundle.ts';

export default function ImportSpeciesBundle() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onHandleSpeciesImportChange = async (file?: File) => {
    setLoading(true);
    const speciesCollection = await importSpeciesBundle(file);
    setMessage(speciesCollection.length > 0 ? `Done! ${speciesCollection.length} species imported.` : '');
    setLoading(false);
  };

  const handleSpeciesImport = async () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <label htmlFor="importspecies">
        <b>Import species</b>
        <p>Import a .csv file with species to a bundle. The existing species bundle is owerwritten..</p>
        <input
          id="importspecies"
          type="file"
          accept=".csv"
          onChange={(e) => onHandleSpeciesImportChange(e.currentTarget.files?.[0])}
          ref={fileInputRef}
          hidden
        />
        {message && (
          <ins>
            <small>{message}</small>
          </ins>
        )}
      </label>
      <button onClick={handleSpeciesImport} aria-busy={loading}>
        Import species bundle
      </button>
    </>
  );
}
