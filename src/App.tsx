import './App.css';
import { useState, useEffect } from 'react';
import { initStore } from './state';
import { ImageView, SpeciesView, PageGenerator } from './pages';
import { Navigation, Footer } from './components';
import { DeleteImageDialog, UploadImageDialog, SpeciesDialog } from './dialogs';
import { getImageInfo, getSpeciesInfo } from './lib/firebase.ts';

function App() {
  const [page, setPage] = useState('species');

  // TODO: Move this outside react? Maybe to state.ts.
  useEffect(() => {
    const fetchData = async () => {
      const images = await getImageInfo();
      const species = await getSpeciesInfo();
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
      </main>

      {page === 'generator' && <PageGenerator />}
      <Footer />
    </>
  );
}

export default App;
