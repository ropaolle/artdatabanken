import { useEffect } from 'react';
import { auth } from '../lib/auth';
import { useAppStore } from '../state';

export default function Auth() {
  const { setUser } = useAppStore();

  useEffect(() => {
    if (auth) {
      auth.onAuthStateChanged((authUser) => {
        if (authUser) {
          const { email, uid, displayName, photoURL } = authUser;
          setUser({ email, uid, displayName, photoURL });
        } else {
          setUser(null);
        }
      });
    }
  }, [setUser]);

  return null;
}
