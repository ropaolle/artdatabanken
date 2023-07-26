import './App.css';
import { useState, useEffect, lazy, Suspense } from 'react';
import { Timestamp } from 'firebase/firestore/lite';
import { /* Home, ImageView, SpeciesView, Collections, Settings, */ type PAGES } from './pages';
// import { type PAGES } from './pages';
import { Navigation, Footer, Auth } from './components';
// import { firestoreFetchDoc, COLLECTIONS } from './lib/firebase';
import { useAppStore, fetchGlobalState } from './state';

function App() {
  const { initGlobalState /* , globalStateFetchedAt */ } = useAppStore();
  const [page, setPage] = useState<PAGES>('HOME');

  useEffect(() => {
    const fetchData = async () => {
      // TODO: Partial update not working
      // const { updatedAt: databaseUpdatedAt } = await firestoreFetchDoc<{ updatedAt: Timestamp }>(
      //   COLLECTIONS.APPLICATION,
      //   'updatedAt'
      // );
      // const fullUpdate = !globalStateFetchedAt || databaseUpdatedAt > globalStateFetchedAt;
      const { images, species } = await fetchGlobalState(/* fullUpdate */);
      console.log('images.length', images.length);

      initGlobalState(images, species, Timestamp.now());
    };

    fetchData().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Home = lazy(() => import('./pages/Home'));
  const SpeciesView = lazy(() => import('./pages/SpeciesView/SpeciesView'));
  const ImageView = lazy(() => import('./pages/ImageView'));
  const Collections = lazy(() => import('./pages/Collections/Collections'));
  const Settings = lazy(() => import('./pages/Settings'));

  return (
    <>
      <Auth />
      <Navigation setPage={setPage} />
      <Suspense fallback={<div>Olle</div>}>
        {page === 'HOME' && <Home setPage={setPage} />}
        {page === 'SPECIES' && <SpeciesView />}
        {page === 'IMAGES' && <ImageView />}
        {page === 'COLLECTIONS' && <Collections />}
        {page === 'SETTINGS' && <Settings />}
      </Suspense>
      <Footer />
    </>
  );
}

export default App;
