import Page from '../Page';
import ImportImagesToLocaleStorage from './ImportImagesToLocaleStorage';
import ImportImagesToFirebase from './ImportImagesToFirebase';
import ImportSpeciesToFirebase from './ImportSpeciesToFirebase';

export default function Settings() {
  return (
    <Page title="Inställningar">
      <div className="grid">
        <ImportImagesToFirebase />
        <ImportSpeciesToFirebase />
        <ImportImagesToLocaleStorage />
      </div>
    </Page>
  );
}
