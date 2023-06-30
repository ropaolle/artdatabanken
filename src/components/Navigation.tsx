import logo from '../assets/logo.svg';
import { Link /* , Dialogs */ } from '.';

type Props = {
  show?: (dialog: number, show?: boolean) => void;
  setPage: (page: React.SetStateAction<string | undefined>) => void;
};

export default function Navigation({ show, setPage }: Props) {
  return (
    <header className="container">
      <nav>
        <ul>
          <li>
            <Link onClick={() => setPage('')}>
              <img src={logo} className="logo" alt="Logo" height={24} width={24} /> Artdatabanken
            </Link>
          </li>
        </ul>
        <ul>
          <li>
            <Link onClick={() => setPage('species')}>Arter</Link>
          </li>
          <li>
            <Link onClick={() => setPage('images')}>Bilder</Link>
          </li>
          <li>
            <Link onClick={() => setPage('generator')}>Sidgenerator</Link>
          </li>
          {/* <li>
            <Link onClick={() => show(Dialogs.ADD_SPECIES_DIALOG)}>Ny Art</Link>
          </li> */}
        </ul>
      </nav>
    </header>
  );
}
