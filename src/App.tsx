import './App.css';
import { useState, useEffect } from 'react';
// import { initStore } from './state';
import { Home, ImageView, SpeciesView, Collections, Settings, type PAGES } from './pages';
import { Navigation, Footer } from './components';
// import { /* firestoreFetch, */ type SpeciesInfo, type ImageInfo } from './lib/firebase';
// import { localStorageImagesOptions, localStorageSpeciesOptions } from './lib';
// import { useAppStore, useStore } from './lib/zustand';

function App() {
  // TODO:
  // 1. Load from local storage
  // 2. Load from Firebase
  // 3. Merge results into global state
  // const [images] = useLocalStorage<ImageInfo[]>('images', [], localStorageImagesOptions);
  // const [species] = useLocalStorage<SpeciesInfo[]>('species', [], localStorageSpeciesOptions);
  // const { initGlobalState, ...rest } = useAppStore();
  // const appStore = useAppStore();
  // console.log('appStore', appStore);
  const [page, setPage] = useState<PAGES>('HOME');

/*   const t = useStore();
  console.log('t', t); */

  useEffect(() => {
    const fetchData = async () => {
      // TODO: Sync locale storage with  Firebase.
      // const images = await firestoreFetch<ImageInfo>('images');
      // const species = await firestoreFetch<SpeciesInfo>('species');
      // initStore(images, species, dataLists);
      // initGlobalState(images || [], species || []);
      // initStore(images || [], species || []);
    };

    fetchData().catch(console.error);
  }, []);

  return (
    <>
      <Navigation setPage={setPage} />

      {page === 'HOME' && <Home />}
      {page === 'SPECIES' && <SpeciesView />}
      {page === 'IMAGES' && <ImageView />}
      {page === 'COLLECTIONS' && <Collections />}
      {page === 'SETTINGS' && <Settings />}

      <Footer />
    </>
  );
}

export default App;
