import Page from './Page';
import { type PAGES } from '../pages';
import { Link } from '../components';

type Props = {
  setPage: (page: React.SetStateAction<PAGES>) => void;
};

export default function Home({ setPage }: Props) {
  return (
    <Page title="Artdatabanken">
      <p>Skapa dina egna artsamlingar och skriv ut eller spara som pdf-filer. </p>
      <h2>Hur gör man?</h2>
      <ol>
        <li>
          Ladda upp och beskär bilder på sidan <Link onClick={() => setPage('IMAGES')}>Bilder</Link>.{' '}
        </li>
        <li>
          Lägg till en eller nya arter på sidan <Link onClick={() => setPage('SPECIES')}>Arter</Link>.
        </li>
        <li>
          Skriv ut samlingar gruperade på familj eller spara pdf-filer på sidan{' '}
          <Link onClick={() => setPage('COLLECTIONS')}>Samlingar</Link>.
        </li>
      </ol>
    </Page>
  );
}
