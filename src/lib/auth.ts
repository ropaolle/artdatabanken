import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { app } from './firebase';

export type User = {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  uid: string | null;
};

export const auth = getAuth(app);

export const signIn = () => {
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider)
    .then((/* result */) => {
      // const credential = GoogleAuthProvider.credentialFromResult(result);
    })
    .catch((error) => {
      // const credential = GoogleAuthProvider.credentialFromError(error);
      console.error(error);
    });
};

export const signOut = () => {
  auth.signOut();
};
