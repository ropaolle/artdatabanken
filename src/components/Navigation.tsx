import logo from '../assets/logo.svg';
import { Link } from '.';

type Props = {
  setPage: (page: React.SetStateAction<string>) => void;
};

export default function Navigation({ setPage }: Props) {
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
            <Link onClick={() => setPage('collections')}>Samlingar</Link>
          </li>
          <li>
            <Link onClick={() => setPage('settings')}>Inställningar</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
