import { useState, useEffect } from 'react';
// import './App.css';
import { Navigation, ImageView, SpeciesView, SpeciesDialog, ImageDialog, Footer, Dialogs } from './components';
import { getImageInfo, type ImageInfo, getSpeciesInfo, type SpeciesInfo } from './lib/firebase.ts';

function App() {
  const [page, setPage] = useState<string>();
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [species, setSpecies] = useState<SpeciesInfo[]>([]);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showSpeciesDialog, setShowSpeciesDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const images = await getImageInfo();
      const species = await getSpeciesInfo();
      // console.log('images', images);
      // console.log('species', species);
      setImages(() => images);
      setSpecies(() => species);
    };
    fetchData().catch(console.error);
  }, []);

  const showDialog = (dialog: number, show = true) => {
    switch (dialog) {
      case Dialogs.UPLOAD_IMAGE_DIALOG:
        setShowUploadDialog(show);
        break;
      case Dialogs.ADD_SPECIES_DIALOG:
        setShowSpeciesDialog(show);
        break;
    }
  };

  return (
    <>
      <Navigation show={showDialog} setPage={setPage} />
      <ImageDialog open={showUploadDialog} hide={() => showDialog(Dialogs.UPLOAD_IMAGE_DIALOG, false)} />
      <SpeciesDialog
        images={images}
        open={showSpeciesDialog}
        hide={() => showDialog(Dialogs.ADD_SPECIES_DIALOG, false)}
      />

      <main className="container">
        {!page && (
          <>
            <h1>Artdatabanken</h1>
            <p>Skapa dina egna artsamlingar för direkt utskrift eller lagring som pdf-filer. </p>
            <h2>Hur gör man?</h2>
            <p></p>
          </>
        )}

        {page === 'species' && (
          <>
            <h1 id="images">Bilder</h1>
            <ImageView images={images} />
          </>
        )}

        {page === 'images' && (
          <>
            <h1 id="images">Bilder</h1>
            <ImageView images={images} />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

export default App;
