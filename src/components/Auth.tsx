import { useEffect } from 'react';
import { auth } from '../lib/firebase';
import { useAppStore } from '../lib/zustand';

export default function Auth() {
  const { /* user,  */ setUser } = useAppStore();

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
