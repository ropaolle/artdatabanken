import './App.css';
import { useState, useEffect, lazy, Suspense } from 'react';
import { Timestamp } from 'firebase/firestore/lite';
import { /* Home, ImageView, SpeciesView, Collections, Settings, */ type PAGES } from './pages';
import { Navigation, Footer, Auth } from './components';
import { firestoreFetchDoc, COLLECTIONS } from './lib/firebase';
import { useAppStore, fetchGlobalState } from './state';

function App() {
  const { user, updateGlobalState, fullUpdateFetchedAt } = useAppStore();
  const [page, setPage] = useState<PAGES>('HOME');

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

  const Home = lazy(() => import('./pages/Home'));
  const SpeciesView = lazy(() => import('./pages/SpeciesView/SpeciesView'));
  const ImageView = lazy(() => import('./pages/ImageView/ImageView'));
  const Collections = lazy(() => import('./pages/Collections/Collections'));
  const Settings = lazy(() => import('./pages/Settings/Settings'));

  return (
    <>
      <Auth />
      <Navigation setPage={setPage} />
      <Suspense fallback={<div>Olle</div>}>
        {page === 'HOME' && <Home setPage={setPage} />}
        {page === 'SPECIES' && <SpeciesView />}
        {page === 'IMAGES' && <ImageView />}
        {page === 'COLLECTIONS' && <Collections />}
        {page === 'SETTINGS' && user?.email === 'ropaolle@gmail.com' && <Settings />}
      </Suspense>
      <Footer />
    </>
  );
}

export default App;
