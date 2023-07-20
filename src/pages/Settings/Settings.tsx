import Page from '../Page';
import ImportImagesToFirebase from './ImportImagesToFirebase';
import ImportSpeciesToFirebase from './ImportSpeciesToFirebase';
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
        <ImportSpeciesToFirebase />
      </div>
    </Page>
  );
}
