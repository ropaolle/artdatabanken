import { useState, useEffect } from 'react';
// import './App.css';
import { Navigation, ImageView, SpeciesView, SpeciesDialog, ImageDialog, Footer, Dialogs } from './components';
import { getImageInfo, type ImageInfo, getSpeciesInfo, type SpeciesInfo } from './lib/firebase.ts';

function App() {
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
      <Navigation show={showDialog} />
      <ImageDialog open={showUploadDialog} hide={() => showDialog(Dialogs.UPLOAD_IMAGE_DIALOG, false)} />
      <SpeciesDialog
        images={images}
        open={showSpeciesDialog}
        hide={() => showDialog(Dialogs.ADD_SPECIES_DIALOG, false)}
      />

      <main className="container">
        <h2 id="speices">Arter</h2>
        <SpeciesView species={species} />
        <h2 id="images">Bilder</h2>
        <ImageView images={images} />
      </main>
      <Footer />
    </>
  );
}

export default App;
