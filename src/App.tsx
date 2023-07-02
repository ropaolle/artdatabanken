import { useState, useEffect } from 'react';
// import './App.css';
import {
  Navigation,
  ImageView,
  // SpeciesView,
  // SpeciesDialog,
  // ImageDialog,
  // ImageDeleteDialog,
  Footer,
  // Dialogs,
  PageGenerator,
  // Dialog,
  // Dialogs,
} from './components';

import { Dialogs, DeleteImageDialog, UploadImageDialog } from './dialogs';

import { getImageInfo, type ImageInfo, getSpeciesInfo, type SpeciesInfo } from './lib/firebase.ts';
// import { Dialogs } from './App.tsx';

const dialogStates = {
  [Dialogs.DELETE_IMAGE_DIALOG]: false,
  [Dialogs.UPLOAD_IMAGE_DIALOG]: false,
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
  const [page, setPage] = useState<string>();
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [species, setSpecies] = useState<SpeciesInfo[]>([]);

  // const [showUploadImageDialog, setShowImageUploadDialog] = useState(false);
  // const [showSpeciesDialog, setShowSpeciesDialog] = useState(false);
  // const [speciesDialog, setSpeciesDialog] = useState(defaultValues /* defaultTatting(1) */);
  const [showDialog, setShowDialog] = useState(dialogStates);
  const [selectedImage, setSelectedImage] = useState<ImageInfo>();

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

  const openDialog = (dialog: Dialogs, show = true, data?: SpeciesInfo | ImageInfo | undefined) => {
    switch (dialog) {
      case Dialogs.DELETE_IMAGE_DIALOG:
        setSelectedImage(data as ImageInfo);
        break;
      // case Dialogs.UPLOAD_IMAGE_DIALOG:
      //   break;
    }

    setShowDialog((prevValue) => ({ ...prevValue, [dialog]: show }));
  };

  // const showDialog = (dialog: number, show = true, data?: SpeciesInfo) => {
  //   switch (dialog) {
  //     case Dialogs.UPLOAD_IMAGE_DIALOG:
  //       setShowUploadDialog(show);
  //       break;
  //     case Dialogs.ADD_SPECIES_DIALOG:
  //       if (data) setSpeciesDialog(data);
  //       setShowSpeciesDialog(show);
  //       break;
  //   }
  // };

  return (
    <>
      <Navigation setPage={setPage} />
      {/* <ImageDialog open={showUploadDialog} close={() => showDialog(Dialogs.UPLOAD_IMAGE_DIALOG, false)} /> */}

      {/* <SpeciesDialog
        images={images}
        open={showSpeciesDialog}
        close={() => showDialog(Dialogs.ADD_SPECIES_DIALOG, false)}
        defaultValues={speciesDialog}
      /> */}

      {/* <ImageDeleteDialog open={true} close={() => showDialog(Dialogs.UPLOAD_IMAGE_DIALOG, false)} /> */}

      <UploadImageDialog
        id={Dialogs.UPLOAD_IMAGE_DIALOG}
        open={showDialog.UPLOAD_IMAGE_DIALOG}        
        show={openDialog}
        />
      <DeleteImageDialog
        id={Dialogs.DELETE_IMAGE_DIALOG}
        open={showDialog.DELETE_IMAGE_DIALOG}
        show={openDialog}        
        image={selectedImage}
      />

      {/* <Dialog id={Dialogs.IMAGE_DIALOG} title={'My dialog 2023'} open={showDialog.IMAGE_DIALOG} show={openDialog}>
        <div>OLLE</div>
        <footer>
          <button role="button" type="submit" aria-busy={false}>
            Spara
          </button>
        </footer>
      </Dialog> */}

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
        {page === 'images' && <ImageView images={images} show={openDialog} /* show={showDialog} */ />}
        {page === 'generator' && <PageGenerator />}
      </main>
      <Footer />
    </>
  );
}

export default App;
