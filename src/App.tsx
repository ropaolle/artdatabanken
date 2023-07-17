import './App.css';
import { useState, useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';
import { Home, ImageView, SpeciesView, Collections, Settings, type PAGES } from './pages';
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
        const bundles = await firestoreFetch<Bundles>('bundles');
        const images = bundles.find(({ id }) => id === 'images');
        const species = bundles.find(({ id }) => id === 'species');
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

  return (
    <>
      <Auth />
      <Navigation setPage={setPage} />

      {page === 'HOME' && <Home setPage={setPage} />}
      {page === 'SPECIES' && <SpeciesView />}
      {page === 'IMAGES' && <ImageView />}
      {page === 'COLLECTIONS' && <Collections />}
      {page === 'SETTINGS' && <Settings />}

      <Footer />
    </>
  );
}

export default App;
