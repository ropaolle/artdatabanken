import './App.css';
import { useState, useEffect /* , lazy, Suspense */ } from 'react';
import { Timestamp } from 'firebase/firestore/lite';
import { Home, ImageView, SpeciesView, Collections, Settings, type PAGES } from './pages';
// import { type PAGES } from './pages';
import { Navigation, Footer, Auth } from './components';
import { firestoreFetch, firestoreFetchDoc, type Bundles, type ImageInfo, type SpeciesInfo } from './lib/firebase';
import { useAppStore } from './lib/state';

function App() {
  // const t = useAppStore()
  // console.log('t', t);

  const { initGlobalState, updatedAt, setImage, setSpecies } = useAppStore();
  // console.log('updatedAt', updatedAt);
  // return null;

  const [page, setPage] = useState<PAGES>('SETTINGS');

  useEffect(() => {
    const fetchData = async () => {
      // TODO: Load bundles and deleted if !updatedAt || bundles updatedAt > updatedAt
      // New data structure: BUNDLES > data > updatedAt, images, species

      const { lastChange } = await firestoreFetchDoc<{lastChange: Timestamp}>('application', 'lastChange');
      // console.log('updatedAt', updatedAt.toDate().toLocaleString());
      // console.log('lastChange', lastChange.toDate().toLocaleString());
      // console.log('lastChange', updatedAt === lastChange, updatedAt < lastChange, updatedAt > lastChange);


      if (!updatedAt || updatedAt < lastChange) {
        type Deleted = { images: string[]; species: string[] };
        const deleted = await firestoreFetchDoc<Deleted>('application', 'deleted');
        // console.log('deleted', deleted);
        const bundles = await firestoreFetchDoc<Bundles>('application', 'bundles');
        console.log('bundles', bundles);
        // return null;

        // Filter deletions from bundles
        const images = bundles.images.filter(({ filename }) => !deleted.images.includes(filename));
        const species = bundles.species.filter(({ id }) => !deleted.species.includes(id || ''));

        // // console.log('images, species', images, species);
        // initGlobalState(i || [], s || [], Timestamp.now());
        initGlobalState(images || [], species || [], Timestamp.now());
      }

      // Fetch all new items
      const images = await firestoreFetch<ImageInfo>('images');
      // console.log('images', images);
      for (const image of images) {
        setImage(image);
      }
      const species = await firestoreFetch<SpeciesInfo>('species');
      // console.log('species', species);
      for (const item of species) {
        setSpecies(item);
      }
    };

    fetchData().catch(console.error);
  }, []);

  // useEffect(() => {
  //   console.log('updatedAt', updatedAt);
  // }, [updatedAt]);

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
