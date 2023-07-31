import classes from './Navigation.module.css';
import { forwardRef } from 'react';
import logo from '../assets/logo.svg';
import { Link } from '.';
import { useAppStore } from '../state';
import { signIn, signOut } from '../lib/auth';

type Props = {
  setPage: (page: PAGES) => void;
};

const Navigation = forwardRef<HTMLDetailsElement, Props>(function Navigation({ setPage }, ref) {
  const { user } = useAppStore();

  return (
    <header className="container-fluid">
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
          {user?.photoURL && (
            <li>
              <details role="list" dir="rtl" ref={ref}>
                <summary aria-haspopup="listbox" role="link">
                  <img src={user.photoURL} className={classes.avatar} alt="Avatar" height={30} width={30} />
                </summary>
                <ul role="listbox">
                  <li>
                    <Link onClick={signOut}>Logga ut</Link>
                  </li>
                  {user?.email === 'ropaolle@gmail.com' && (
                    <li>
                      <Link onClick={() => setPage('SETTINGS')}>Inställningar</Link>
                    </li>
                  )}
                  <li>
                      <Link onClick={() => setPage('ABOUT')}>Om</Link>
                    </li>
                </ul>
              </details>
            </li>
          )}
          {!user && (
            <li>
              <Link onClick={signIn}>Logga in</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
});

export default Navigation;
