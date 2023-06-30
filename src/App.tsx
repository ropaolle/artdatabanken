import { useState, useEffect } from 'react';
// import './App.css';
import {
  Navigation,
  ImageView,
  SpeciesView,
  SpeciesDialog,
  ImageDialog,
  Footer,
  Dialogs,
  PageGenerator,
} from './components';
import { getImageInfo, type ImageInfo, getSpeciesInfo, type SpeciesInfo } from './lib/firebase.ts';

const defaultValues = {
  species: '',
  place: '',
  date: new Date().toLocaleDateString(),
  kingdom: '',
  order: '',
  family: '',
  county: '',
  speciesLatin: '',
  sex: '',
  image: 'image515.jpg',
};

function App() {
  const [page, setPage] = useState<string>();
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [species, setSpecies] = useState<SpeciesInfo[]>([]);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showSpeciesDialog, setShowSpeciesDialog] = useState(false);
  const [speciesDialog, setSpeciesDialog] = useState(defaultValues);

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

  const showDialog = (dialog: number, show = true, data?: SpeciesInfo) => {
    switch (dialog) {
      case Dialogs.UPLOAD_IMAGE_DIALOG:
        setShowUploadDialog(show);
        break;
      case Dialogs.ADD_SPECIES_DIALOG:
        if (data) setSpeciesDialog(data);
        setShowSpeciesDialog(show);
        break;
    }
  };

  // console.log('speciesDialog', speciesDialog);

  return (
    <>
      <Navigation show={showDialog} setPage={setPage} />
      <ImageDialog open={showUploadDialog} hide={() => showDialog(Dialogs.UPLOAD_IMAGE_DIALOG, false)} />
      <SpeciesDialog
        images={images}
        open={showSpeciesDialog}
        close={() => showDialog(Dialogs.ADD_SPECIES_DIALOG, false)}
        defaultValues={speciesDialog}
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

        {page === 'species' && <SpeciesView species={species} images={images} show={showDialog} />}
        {page === 'images' && <ImageView images={images} show={showDialog} />}
        {page === 'generator' && <PageGenerator />}
      </main>
      <Footer />
    </>
  );
}

export default App;
