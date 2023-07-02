import { useState, useEffect } from 'react';
import { initStore } from './state';
// import './App.css';
import { Navigation, ImageView, Footer, PageGenerator, SpeciesView } from './components';
import { DialogTypes, DeleteImageDialog, UploadImageDialog, SpeciesDialog } from './dialogs';
import { getImageInfo, type ImageInfo, getSpeciesInfo, type SpeciesInfo } from './lib/firebase.ts';

const dialogStates = {
  [DialogTypes.DELETE_IMAGE_DIALOG]: false,
  [DialogTypes.UPLOAD_IMAGE_DIALOG]: false,
  [DialogTypes.SPECIES_DIALOG]: false,
};

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
  image: '',
};

function App() {
  // const [value, update] = useGlobalState('app');
  const [page, setPage] = useState<string>();
  // const [images, setImages] = useState<ImageInfo[]>([]);
  // const [species, setSpecies] = useState<SpeciesInfo[]>([]);
  const [showDialog, setShowDialog] = useState(dialogStates);
  const [selectedImage, setSelectedImage] = useState<ImageInfo>();

  // TODO: Move this outside react? Maybe to state.ts.
  useEffect(() => {
    const fetchData = async () => {
      const images = await getImageInfo();
      const species = await getSpeciesInfo();
      initStore({ app: { images, species } });
      // setSpecies(() => species);
    };
    fetchData().catch(console.error);
  }, []);

  const openDialog = (dialog: DialogTypes, show = true, data?: SpeciesInfo | ImageInfo | undefined) => {
    switch (dialog) {
      case DialogTypes.DELETE_IMAGE_DIALOG:
        setSelectedImage(data as ImageInfo);
        break;
      // case Dialogs.UPLOAD_IMAGE_DIALOG:
      //   break;
    }

    setShowDialog((prevValue) => ({ ...prevValue, [dialog]: show }));
  };

  // console.log('value app', value);

  return (
    <>
      <Navigation setPage={setPage} />

      <SpeciesDialog />

      <UploadImageDialog id={DialogTypes.UPLOAD_IMAGE_DIALOG} open={showDialog.UPLOAD_IMAGE_DIALOG} show={openDialog} />

      <DeleteImageDialog
        id={DialogTypes.DELETE_IMAGE_DIALOG}
        open={showDialog.DELETE_IMAGE_DIALOG}
        show={openDialog}
        image={selectedImage}
      />

      <main className="container">
        {!page && (
          <>
            <h1>Artdatabanken</h1>
            <p>Skapa dina egna artsamlingar för direkt utskrift eller lagring som pdf-filer. </p>
            <h2>Hur gör man?</h2>
            <p>Hubba ...</p>
          </>
        )}

        {/* {page === 'species' && <SpeciesView species={species} images={images} show={showDialog} />} */}
        {page === 'species' && <SpeciesView /* show={openDialog}  */ />}
        {page === 'images' && <ImageView show={openDialog} />}
        {page === 'generator' && <PageGenerator />}
      </main>
      <Footer />
    </>
  );
}

export default App;
