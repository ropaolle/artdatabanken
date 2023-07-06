import './App.css';
import { useState, useEffect } from 'react';
import { initStore } from './state';
import { ImageView, SpeciesView, PageGenerator, Settings } from './pages';
import { Navigation, Footer } from './components';
import { DeleteImageDialog, UploadImageDialog, SpeciesDialog } from './dialogs';
import { firestoreFetch, type SpeciesInfo, type ImageInfo } from './lib/firebase.ts';

function App() {
  const [page, setPage] = useState('settings');

  // TODO: Move this outside react. Is that better for preformance?
  useEffect(() => {
    const fetchData = async () => {
      const images = await firestoreFetch<ImageInfo>('images');
      const species = await firestoreFetch<SpeciesInfo>('species');
      initStore(images, species);
    };

    fetchData().catch(console.error);
  }, []);

  return (
    <>
      <Navigation setPage={setPage} />

      <SpeciesDialog />
      <DeleteImageDialog />
      <UploadImageDialog />

      <main className="container">
        {!page && (
          <>
            <h1>Artdatabanken</h1>
            <p>Skapa dina egna artsamlingar för direkt utskrift eller lagring som pdf-filer. </p>
            <h2>Hur gör man?</h2>
            <p>Hubba ...</p>
          </>
        )}

        {page === 'species' && <SpeciesView />}
        {page === 'images' && <ImageView />}
        {page === 'generator' && <PageGenerator />}
        {page === 'settings' && <Settings />}
      </main>

      <Footer />
    </>
  );
}

export default App;
