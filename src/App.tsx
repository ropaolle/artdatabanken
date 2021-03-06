import './App.css';
import { useState, useEffect, lazy, Suspense, useRef } from 'react';
import { Timestamp } from 'firebase/firestore/lite';
import { Home /* , ImageView, SpeciesView, Collections, Settings */ } from './pages';
import { Navigation, Footer, Auth } from './components';
import { firestoreFetchDoc, COLLECTIONS } from './lib/firebase';
import { useAppStore, fetchGlobalState } from './state';

function App() {
  const { user, updateGlobalState, fullUpdateFetchedAt } = useAppStore();
  const [page, setPage] = useState<PAGES>('HOME');
  const [family, setFamily] = useState('');
  const menuDrodownRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const isFullUpdateNeeded = async () => {
        const { updatedAt: databaseUpdatedAt } = await firestoreFetchDoc<{ updatedAt: Timestamp }>(
          COLLECTIONS.APPLICATION,
          'updatedAt'
        );

        return !fullUpdateFetchedAt || databaseUpdatedAt > fullUpdateFetchedAt;
      };

      const fullUpdate = await isFullUpdateNeeded();
      const { images, species } = await fetchGlobalState(fullUpdate);

      updateGlobalState(images, species, Timestamp.now(), fullUpdate);
    };

    fetchData().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSetPage = (page: PAGES, family?: string) => {
    menuDrodownRef.current?.removeAttribute('open');
    family && setFamily(family);
    setPage(page);
  };

  // const Home = lazy(() => import('./pages/Home'));
  const SpeciesView = lazy(() => import('./pages/SpeciesView/SpeciesView'));
  const ImageView = lazy(() => import('./pages/ImageView/ImageView'));
  const Collections = lazy(() => import('./pages/Collections/Collections'));
  const Settings = lazy(() => import('./pages/Settings/Settings'));
  const About = lazy(() => import('./pages/About'));

  return (
    <>
      <Auth />
      <Navigation setPage={handleSetPage} ref={menuDrodownRef} />
      {page === 'HOME' && <Home setPage={handleSetPage} />}
      <Suspense /* fallback={<div>Olle</div>} */>
        {/* {page === 'HOME' && <Home setPage={setPage} />} */}
        {page === 'SPECIES' && <SpeciesView />}
        {page === 'IMAGES' && <ImageView />}
        {page === 'COLLECTIONS' && <Collections defaultFamily={family} />}
        {page === 'SETTINGS' && user?.email === 'ropaolle@gmail.com' && <Settings />}
        {page === 'ABOUT' && <About />}
      </Suspense>
      <Footer />
    </>
  );
}

export default App;
