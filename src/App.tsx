import './App.css';
import { useState, useEffect } from 'react';
import { initStore } from './state';
import { ImageView, SpeciesView, PageGenerator, Settings } from './pages';
import { Navigation, Footer } from './components';
import { DeleteImageDialog, UploadImageDialog, SpeciesDialog } from './dialogs';
import { firestoreFetch, type SpeciesInfo, type ImageInfo } from './lib/firebase.ts';



function App() {
  const [page, setPage] = useState('species');

  // TODO: Should fetch be moved outside react? Is that better for preformance?
  useEffect(() => {
    const fetchData = async () => {
      const images = await firestoreFetch<ImageInfo>('images');
      const species = await firestoreFetch<SpeciesInfo>('species');

      const dataLists = {
        kingdoms: new Set<string>(),
        orders: new Set<string>(),
        families: new Set<string>(),
        species: new Set<string>(),
        places: new Set<string>(),
      };

      for (const { kingdom, order, family, species: speciesName, place } of species) {
        dataLists.kingdoms.add(kingdom);
        dataLists.orders.add(order);
        dataLists.families.add(family);
        dataLists.species.add(speciesName);
        dataLists.places.add(place);
      }

      initStore(images, species, dataLists);
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
