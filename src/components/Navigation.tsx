import classes from './Navigation.module.css';
import logo from '../assets/logo.svg';
import { type PAGES } from '../pages';
import { Link } from '.';
import { useAppStore } from '../lib/zustand';
import { auth } from '../lib/firebase';

import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

type Props = {
  setPage: (page: React.SetStateAction<PAGES>) => void;
};

export default function Navigation({ setPage }: Props) {
  const { user, setUser } = useAppStore();

  const signIn = () => {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        setUser(result.user);
      })
      .catch((error) => {
        // const credential = GoogleAuthProvider.credentialFromError(error);
        console.error(error);
      });
  };

  const signOut = () => {
    auth.signOut().then(() => setUser(null));
  };

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
              <details role="list" dir="rtl">
                <summary aria-haspopup="listbox" role="link">
                  <img src={user.photoURL} className={classes.avatar} alt="Avatar" height={30} width={30} />
                </summary>
                <ul role="listbox">
                  <li>
                    <Link onClick={signOut}>Logga ut</Link>
                  </li>
                  <li>
                    <Link onClick={() => setPage('SETTINGS')}>Inställningar</Link>
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
}
