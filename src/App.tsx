import { useState, useEffect } from 'react';
import { initStore } from './state';
// import './App.css';
import { Navigation, ImageView, Footer, PageGenerator, SpeciesView } from './components';
import { DialogTypes, DeleteImageDialog, UploadImageDialog, SpeciesDialog } from './dialogs';
import { getImageInfo, type ImageInfo, getSpeciesInfo, type SpeciesInfo } from './lib/firebase.ts';

function App() {
  const [page, setPage] = useState<string>();

  // TODO: Move this outside react? Maybe to state.ts.
  useEffect(() => {
    const fetchData = async () => {
      const images = await getImageInfo();
      const species = await getSpeciesInfo();
      initStore({ images, species });
    };
    fetchData().catch(console.error);
  }, []);

  return (
    <>
      <Navigation setPage={setPage} />
      {/* TODO: Shold app state be loaded once and passed as propps to components or be loaded inn the components?  */}
      <SpeciesDialog />

      {/* <UploadImageDialog id={DialogTypes.UPLOAD_IMAGE_DIALOG} open={showDialog.UPLOAD_IMAGE_DIALOG} show={openDialog} />

      <DeleteImageDialog
        id={DialogTypes.DELETE_IMAGE_DIALOG}
        open={showDialog.DELETE_IMAGE_DIALOG}
        show={openDialog}
        image={selectedImage}
      /> */}

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
        {/* {page === 'images' && <ImageView show={openDialog} />} */}
        {page === 'generator' && <PageGenerator />}
      </main>
      <Footer />
    </>
  );
}

export default App;
