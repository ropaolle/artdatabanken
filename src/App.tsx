import './App.css';
import { useState } from 'react';
import { useLocalStorage, useEffectOnce } from 'react-use';
import { initStore } from './state';
import { Home, ImageView, SpeciesView, Collections, Settings } from './pages';
import { Navigation, Footer } from './components';
import { /* firestoreFetch, */ type SpeciesInfo, type ImageInfo } from './lib/firebase';
import { localStorageImagesOptions, localStorageSpeciesOptions } from './lib';

function App() {
  const [page, setPage] = useState('species');
  const [images] = useLocalStorage<ImageInfo[]>('images', [], localStorageImagesOptions);
  const [species] = useLocalStorage<SpeciesInfo[]>('species', [], localStorageSpeciesOptions);

  useEffectOnce(() => {
    const fetchData = async () => {
      // TODO: Sync locale storage with  Firebase.
      // const images = await firestoreFetch<ImageInfo>('images');
      // const species = await firestoreFetch<SpeciesInfo>('species');
      // initStore(images, species, dataLists);
      initStore(images || [], species || []);
    };

    fetchData().catch(console.error);
  });

  return (
    <>
      <Navigation setPage={setPage} />

      {!page && <Home />}
      {page === 'species' && <SpeciesView />}
      {page === 'images' && <ImageView />}
      {page === 'collections' && <Collections />}
      {page === 'settings' && <Settings />}

      <Footer />
    </>
  );
}

export default App;
