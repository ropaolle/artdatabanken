import { showUploadImageDialog } from '../state';
import Page from './Page';

export default function PageGenerator() {
  return (
    <Page title="Sidgenerator" headerButtonTitle='Ladd upp...' onHeaderButtonClick={() => showUploadImageDialog(true)}>
      Innehåll ...
    </Page>
  );
}
