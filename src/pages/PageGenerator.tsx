import Page from './Page';
import { importData } from '../lib/firebase';

export default function PageGenerator() {
  return (
    <Page title="Sidgenerator" headerButtonTitle="Ladd upp..." onHeaderButtonClick={importData}>
      Innehåll ...
    </Page>
  );
}
