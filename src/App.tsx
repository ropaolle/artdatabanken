import './App.css';
import { useState, useEffect /* , lazy, Suspense */ } from 'react';
import { Timestamp } from 'firebase/firestore/lite';
import { Home, ImageView, SpeciesView, Collections, Settings, type PAGES } from './pages';
// import { type PAGES } from './pages';
import { Navigation, Footer, Auth } from './components';
import { firestoreFetch, firestoreFetchDoc, type ImageInfo, type SpeciesInfo, COLLECTIONS } from './lib/firebase';
import { useAppStore } from './lib/state';

function App() {
  const { initGlobalState, globalStateFetchedAt, setImage, setSpecies } = useAppStore();
  const [page, setPage] = useState<PAGES>('SETTINGS');

  useEffect(() => {
    const fetchData = async () => {
      const { updatedAt: databaseUpdatedAt } = await firestoreFetchDoc<{ updatedAt: Timestamp }>(
        COLLECTIONS.APPLICATION,
        'updatedAt'
      );

      // Fetch bundles and sync with global app storage and persistent local storage
      if (!globalStateFetchedAt || globalStateFetchedAt < databaseUpdatedAt) {
        type Deleted = { images: string[]; species: string[] };
        const deleted = await firestoreFetchDoc<Deleted>(COLLECTIONS.APPLICATION, 'deleted');

        type Bundles = { images: ImageInfo[]; species: SpeciesInfo[] };
        const bundles = await firestoreFetchDoc<Bundles>(COLLECTIONS.APPLICATION, 'bundles');

        // Exclude deleted images and species
        const images = bundles.images.filter(({ filename }) => !deleted.images.includes(filename));
        const species = bundles.species.filter(({ id }) => !deleted.species.includes(id || ''));

        initGlobalState(images, species, Timestamp.now());
      }

      // Fetch all new species and images, not jet added to  persistent local storage
      const images = await firestoreFetch<ImageInfo>('images');
      for (const image of images) {
        setImage(image);
      }

      const species = await firestoreFetch<SpeciesInfo>('species');
      for (const item of species) {
        setSpecies(item);
      }
    };

    fetchData().catch(console.error);
  }, []);

  // const Home = lazy(() => import('./pages/Home'));
  // const SpeciesView = lazy(() => import('./pages/SpeciesView/SpeciesView'));
  // const ImageView = lazy(() => import('./pages/ImageView'));
  // const Collections = lazy(() => import('./pages/Collections/Collections'));
  // const Settings = lazy(() => import('./pages/Settings'));

  return (
    <>
      <Auth />
      <Navigation setPage={setPage} />
      {/* <Suspense fallback={<div>Olle</div>}> */}
      {page === 'HOME' && <Home setPage={setPage} />}
      {page === 'SPECIES' && <SpeciesView />}
      {page === 'IMAGES' && <ImageView />}
      {page === 'COLLECTIONS' && <Collections />}
      {page === 'SETTINGS' && <Settings />}
      {/* </Suspense> */}
      <Footer />
    </>
  );
}

export default App;
