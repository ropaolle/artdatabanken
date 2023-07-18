import './App.css';
import { useState, useEffect /* , lazy, Suspense */ } from 'react';
import { Timestamp } from 'firebase/firestore/lite';
import { Home, ImageView, SpeciesView, Collections, Settings, type PAGES } from './pages';
// import { type PAGES } from './pages';
import { Navigation, Footer, Auth } from './components';
import { firestoreFetch, type Bundles, type ImageInfo, type SpeciesInfo } from './lib/firebase';
import { useAppStore } from './lib/state';

function App() {
  const { initGlobalState, updatedAt, setImage, setSpecies } = useAppStore();
  const [page, setPage] = useState<PAGES>('HOME');

  useEffect(() => {
    const fetchData = async () => {
      if (!updatedAt) {
        // Fetch all bundles
        const [images, species] = await firestoreFetch<Bundles>('bundles');
        initGlobalState((images?.items as ImageInfo[]) || [], (species?.items as SpeciesInfo[]) || [], Timestamp.now());
      }

      // Fetch all new items
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
