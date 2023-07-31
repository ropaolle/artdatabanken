import classes from './Home.module.css';
import Page from './Page';
import { Link } from '../components';
import { useAppStore } from '../state';
import { signIn } from '../lib/auth';
import example1 from '../assets/example1.jpg';
import example2 from '../assets/example2.jpg';

type Props = {
  setPage: (page: React.SetStateAction<PAGES>) => void;
};

export default function Home({ setPage }: Props) {
  const { user } = useAppStore();

  return (
    <Page title="Artdatabanken">
      <p>Skapa dina egna artsamlingar och skriv ut eller spara som pdf-filer. </p>
      <div>
        <img className={classes.img} src={example1} /> <img className={classes.img} src={example2} />
      </div>
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
      {!user && (
        <p>
          <mark>Notera.</mark> För att editera, ladda upp eller radera bilder måste du vara inloggad,{' '}
          <Link onClick={signIn}>Logga in</Link>.
        </p>
      )}
    </Page>
  );
}
