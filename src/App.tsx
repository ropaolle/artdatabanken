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
        // TODO: Fetch all deletions and remove from the bundles
        // Fetch all deletions
        type Deleted = { deletedImages: string[]; deletedSpecies: string[] };
        const [{ deletedImages, deletedSpecies }] = await firestoreFetch<Deleted>('deleted');
        console.log('deleted', deletedImages, deletedSpecies);
        // Fetch all bundles
        const [{ images, species }] = await firestoreFetch<Bundles>('bundles');

        // Filter deletions from bundles
        const i = images.filter(({ filename }) => !deletedImages.includes(filename));
        const s = species.filter(({ id }) => !deletedSpecies.includes(id || ''));

        console.log('images, species', images, species);
        initGlobalState(i || [], s || [], Timestamp.now());
        // initGlobalState(images || [], species || [], Timestamp.now());
      }

      // Fetch all new items
      const images = await firestoreFetch<ImageInfo>('images');
      console.log('images', images);
      for (const image of images) {
        setImage(image);
      }
      const species = await firestoreFetch<SpeciesInfo>('species');
      console.log('species', species);
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
