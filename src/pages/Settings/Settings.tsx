import Page from '../Page';
import ImportImagesToFirebase from './ImportImagesToFirebase';
import ImportSpeciesToFirebase from './ImportSpeciesToFirebase';
import ImportImagesToLocaleStorage from './ImportImagesToLocaleStorage';
import ImportSpeciesToLocaleStorage from './ImportSpeciesToLocaleStorage';

export default function Settings() {
  return (
    <Page title="Inställningar">
      <h2>Import to locale storage</h2>
      <div className="grid">
        <ImportImagesToLocaleStorage />
        <ImportSpeciesToLocaleStorage />
      </div>

      <h2></h2>
      <h2>Import to Firebase</h2>
      <div className="grid">
        <ImportImagesToFirebase />
        <ImportSpeciesToFirebase />
      </div>
    </Page>
  );
}
