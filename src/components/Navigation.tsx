import logo from '../assets/logo.svg';
import { type PAGES } from '../pages';
import { Link } from '.';

type Props = {
  setPage: (page: React.SetStateAction<PAGES>) => void;
};

export default function Navigation({ setPage }: Props) {
  return (
    <header className="container">
      <nav>
        <ul>
          <li>
            <Link onClick={() => setPage('HOME')}>
              <img src={logo} className="logo" alt="Logo" height={24} width={24} /> Artdatabanken
            </Link>
          </li>
        </ul>
        <ul>
          <li>
            <Link onClick={() => setPage('SPECIES')}>Arter</Link>
          </li>
          <li>
            <Link onClick={() => setPage('IMAGES')}>Bilder</Link>
          </li>
          <li>
            <Link onClick={() => setPage('COLLECTIONS')}>Samlingar</Link>
          </li>
          <li>
            <Link onClick={() => setPage('SETTINGS')}>Inställningar</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
