import { useState, useEffect } from 'react';
// import './App.css';
import {
  Navigation,
  ImageView,
  SpeciesView,
  SpeciesDialog,
  ImageDialog,
  ImageDeleteDialog,
  Footer,
  Dialogs,
  PageGenerator,
  Dialog,
} from './components';
import { getImageInfo, type ImageInfo, getSpeciesInfo, type SpeciesInfo } from './lib/firebase.ts';

const tattingar = [
  [
    'Fåglar',
    'Tättingar',
    'Kråkfåglar',
    'Skata',
    'Pica pica',
    'male',
    'Råstasjön',
    'stockholm',
    '2009-05-15',
    'image067.jpg',
  ],
  [
    'Fåglar',
    'Tättingar',
    'Kråkfåglar',
    'Kråka',
    'Corvus corone',
    'female',
    'Råstasjön',
    'stockholm',
    '2009-05-15',
    'image068.jpg',
  ],
  [
    'Fåglar',
    'Tättingar',
    'Kråkfåglar',
    'Råka',
    'Corvus frugilegus',
    'male',
    'Verkeån',
    'skane',
    '2010-05-19',
    'image066.jpg',
  ],
  [
    'Fåglar',
    'Tättingar',
    'Kråkfåglar',
    'Lavskrika',
    'Perisoreus infaustus',
    'male',
    'Ånnsjön',
    'jamtland',
    '2010-06-16',
    'image069.jpg',
  ],
  [
    'Fåglar',
    'Tättingar',
    'Kråkfåglar',
    'Kaja',
    'Corvus monedula',
    'male',
    'Ottenby',
    'Öland',
    '2009-07-12',
    'image070.jpg',
  ],
  [
    'Fåglar',
    'Tättingar',
    'Kråkfåglar',
    'Nötskrika',
    'Garrulus glandarius',
    'male',
    'Källhagen',
    'sodermanland',
    '2018-04-28',
    'image301.jpg',
  ],
];

const defaultTatting = (id = 0) => ({
  species: tattingar[id][3],
  place: tattingar[id][6],
  date: tattingar[id][8],
  kingdom: tattingar[id][0],
  order: tattingar[id][1],
  family: tattingar[id][2],
  county: tattingar[id][7],
  speciesLatin: tattingar[id][4],
  sex: tattingar[id][5],
  image: tattingar[id][9],
});

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

  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showSpeciesDialog, setShowSpeciesDialog] = useState(false);
  const [speciesDialog, setSpeciesDialog] = useState(defaultValues /* defaultTatting(1) */);
  const [showDialog2, setShowDialog2] = useState(true);

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

  return (
    <>
      <Navigation show={showDialog} setPage={setPage} />
      <ImageDialog open={showUploadDialog} close={() => showDialog(Dialogs.UPLOAD_IMAGE_DIALOG, false)} />
      {/* <ImageDeleteDialog open={true} close={() => showDialog(Dialogs.UPLOAD_IMAGE_DIALOG, false)} /> */}
      <SpeciesDialog
        images={images}
        open={showSpeciesDialog}
        close={() => showDialog(Dialogs.ADD_SPECIES_DIALOG, false)}
        defaultValues={speciesDialog}
      />
      <Dialog id="basDialog" title={'My dialog 2023'} open={showDialog2} show={setShowDialog2}>
        <div>OLLE</div>
        <footer>
          <button role="button" type="submit" aria-busy={false}>
            Spara
          </button>
        </footer>
      </Dialog>

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
