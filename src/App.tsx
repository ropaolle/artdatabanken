import './App.css';
import { useState, useEffect } from 'react';
// import { initStore } from './state';
import { Home, ImageView, SpeciesView, Collections, Settings } from './pages';
import { Navigation, Footer } from './components';
import { DeleteImageDialog, UploadImageDialog, SpeciesDialog } from './dialogs';
import { /* firestoreFetch, type SpeciesInfo, type ImageInfo, */ getURL } from './lib/firebase.ts';
import { useLocalStorage } from 'usehooks-ts';

const dummy = {
  myData: 'sdfsdf',
};

function App() {
  const [page, setPage] = useState('species');
  const [isDarkTheme, setDarkTheme] = useLocalStorage('darkTheme', dummy);

  const toggleTheme = async () => {
    const url = await getURL('images/bild096.jpg');
    setDarkTheme({ url });
    // setDarkTheme((prevValue: boolean) => !prevValue)
  };

  // TODO: Should fetch be moved outside react? Is that better for preformance?
  useEffect(() => {
    const fetchData = async () => {
      // const images = await firestoreFetch<ImageInfo>('images');
      // const species = await firestoreFetch<SpeciesInfo>('species');
      // const dataLists = {
      //   kingdoms: new Set<string>(),
      //   orders: new Set<string>(),
      //   families: new Set<string>(),
      //   species: new Set<string>(),
      //   places: new Set<string>(),
      // };
      // for (const { kingdom, order, family, species: speciesName, place } of species) {
      //   dataLists.kingdoms.add(kingdom);
      //   dataLists.orders.add(order);
      //   dataLists.families.add(family);
      //   dataLists.species.add(speciesName);
      //   dataLists.places.add(place);
      // }
      // initStore(images, species, dataLists);
    };

    fetchData().catch(console.error);
  }, []);

  return (
    <>
      <Navigation setPage={setPage} />

      <SpeciesDialog />
      <DeleteImageDialog />
      <UploadImageDialog />

      <button onClick={toggleTheme}>{`The current theme is ${isDarkTheme ? `dark` : `light`}`}</button>

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
