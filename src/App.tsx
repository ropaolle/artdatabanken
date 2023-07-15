import './App.css';
import { useState, useEffect } from 'react';
// import { initStore } from './state';
import { Home, ImageView, SpeciesView, Collections, Settings, type PAGES } from './pages';
import { Navigation, Footer } from './components';
// import { /* firestoreFetch, */ type SpeciesInfo, type ImageInfo } from './lib/firebase';
// import { localStorageImagesOptions, localStorageSpeciesOptions } from './lib';
import { useAppStore } from './lib/zustand';

function App() {
  // TODO:
  // 1. Load from local storage
  // 2. Load from Firebase
  // 3. Merge results into global state
  // const [images] = useLocalStorage<ImageInfo[]>('images', [], localStorageImagesOptions);
  // const [species] = useLocalStorage<SpeciesInfo[]>('species', [], localStorageSpeciesOptions);
  // const { initGlobalState, ...rest } = useAppStore();
  const { initGlobalState, updatedAt } = useAppStore();
  // console.log('appStore', appStore);
  const [page, setPage] = useState<PAGES>('HOME');

  console.log('updatedAt', updatedAt);

  /*   const t = useStore();
  console.log('t', t); */

  useEffect(() => {
    const fetchData = async () => {
      // TODO: Sync locale storage with  Firebase.
      if (!updatedAt) {
        // Fetch all items from Firebase
        initGlobalState([], [], new Date());
      } else {
        // Fetch all items newer then updatedAt from Firebase
      }
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
