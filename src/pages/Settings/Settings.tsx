import Page from '../Page';
import ImportImagesToFirebase from './ImportImagesToFirebase';
import ImportSpecies from './ImportSpecies';
import ExportDatabase from './ExportDatabase';

export default function Settings() {
  return (
    <Page title="Inställningar">
      <h2>Export to file</h2>
      <div className="grid">
        <ExportDatabase />
        <div />
      </div>

      <h2>Import to Firebase</h2>
      <div className="grid">
        <ImportImagesToFirebase />
        <ImportSpecies />
      </div>
    </Page>
  );
}
