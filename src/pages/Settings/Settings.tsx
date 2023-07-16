import Page from '../Page';
import ImportImagesToFirebase from './ImportImagesToFirebase';
import ImportSpeciesToFirebase from './ImportSpeciesToFirebase';

export default function Settings() {
  return (
    <Page title="Inställningar">
      <h2>Import to Firebase</h2>
      <div className="grid">
        <ImportImagesToFirebase />
        <ImportSpeciesToFirebase />
      </div>
    </Page>
  );
}
