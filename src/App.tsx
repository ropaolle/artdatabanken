import './App.css';
import { useState /* , useEffect */ } from 'react';
import { useLocalStorage, useEffectOnce } from 'react-use';
import { initStore } from './state';
import { Home, ImageView, SpeciesView, Collections, Settings } from './pages';
import { Navigation, Footer } from './components';
import { DeleteImageDialog, UploadImageDialog, SpeciesDialog } from './dialogs';
import { /* firestoreFetch, */ type SpeciesInfo, type ImageInfo } from './lib/firebase';
import { localStorageImagesOptions, localStorageSpeciesOptions } from './lib';

function App() {
  const [page, setPage] = useState('');
  const [images] = useLocalStorage<ImageInfo[]>('imageList', [], localStorageImagesOptions);
  const [species] = useLocalStorage<SpeciesInfo[]>('speciesList', [], localStorageSpeciesOptions);

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

      <SpeciesDialog />
      <DeleteImageDialog />
      <UploadImageDialog />

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
