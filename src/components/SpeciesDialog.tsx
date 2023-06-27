import { useForm, SubmitHandler } from 'react-hook-form';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, type ImageInfo } from '../lib/firebase.ts';
import { toDatalist, toOptions } from '../lib';

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

const counties = [
  { value: '', label: 'Ange län…' },
  { value: 'stockholm', label: 'Stockholms län' },
  { value: 'uppsala', label: 'Uppsala län' },
  { value: 'sodermanland', label: 'Södermanlands län' },
  { value: 'ostergotland', label: 'Östergötlands län' },
  { value: 'jonkoping', label: 'Jönköpings län' },
  { value: 'kronoberg', label: 'Kronobergs län' },
  { value: 'kalmar', label: 'Kalmar län' },
  { value: 'gotland', label: 'Gotlands län' },
  { value: 'blekinge', label: 'Blekinge län' },
  { value: 'skane', label: 'skane län' },
  { value: 'halland', label: 'Hallands län' },
  { value: 'vastra-gotaland', label: 'Västra Götalands län' },
  { value: 'varmland', label: 'Värmlands län' },
  { value: 'orebro', label: 'Örebro län' },
  { value: 'vastmanland', label: 'Västmanlands län' },
  { value: 'dalarna', label: 'Dalarnas län' },
  { value: 'gavleborg', label: 'Gävleborgs län' },
  { value: 'vasternorrland', label: 'Västernorrlands län' },
  { value: 'jamtland', label: 'Jämtlands län' },
  { value: 'vasterbotten', label: 'Västerbottens län' },
  { value: 'norrbotten', label: 'Norrbottens län' },
];

const sexes = [
  { value: '', label: 'Ange kön…' },
  { value: 'male', label: 'Hane' },
  { value: 'female', label: 'Hona' },
];

const classes = [
  'Däggdjur',
  'Fräkenartade växter',
  'Fröväxter',
  'Fåglar',
  'Groddjur',
  'Insekter',
  'Kräldjur',
  'Ormbunksartade växter',
  'Snäckor',
  'Spindeldjur',
];

type Inputs = {
  species: string;
  place: string;
  date: string;
  kingdom: string;
  order: string;
  family: string;
  county: string;
  speciesLatin: string;
  sex: string;
  image: string;
};

type Props = {
  open: boolean;
  hide: () => void;
  images: ImageInfo[];
};

const defaultValues = {
  species: undefined,
  place: '',
  date: new Date().toLocaleDateString(),
  kingdom: '',
  order: '',
  family: '',
  county: '',
  speciesLatin: '',
  sex: '',
};

export default function SpeciesDialog({ open, hide, images }: Props) {
  const {
    register,
    handleSubmit,
    // watch,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: defaultTatting(2),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      // TODO: CreatedAt
      console.log('Add species', data);
      await setDoc(doc(db, 'species', data.species), { ...data, updatedAt: serverTimestamp() });
    } catch (error) {
      console.error(error);
    }
  };

  // console.log(watch('example'));

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement> | undefined) => {
    const filename = e?.target.value;
    // if (filename && imageFilenames.includes(filename)) {
    //   console.log('e', filename);
    // }
  };

  const onClick = (e: React.FormEvent) => {
    e.preventDefault();
    hide();
  };

  return (
    <dialog open={open}>
      <div className="species-view">
        <form onSubmit={handleSubmit(onSubmit)}>
          <article>
            <a href="#" aria-label="Close" className="close" onClick={onClick}></a>

            <h3>Lägg till ny art</h3>

            <div className="input-horizontal">
              <label htmlFor="species">Art*</label>
              <div>
                <input {...register('species', { required: true })} />
                {errors.species && errors.species.type === 'required' && (
                  <span className="error">This is required!</span>
                )}
              </div>

              <label htmlFor="kingdom">Klass</label>
              <div>
                <input list="classes-data" autoComplete="off" {...register('kingdom')} />
                <datalist id="classes-data">{toDatalist(classes)}</datalist>
              </div>

              <label htmlFor="order">Ordning</label>
              <div>
                <input {...register('order')} />
              </div>

              <label htmlFor="family">Familj</label>
              <div>
                <input {...register('family')} />
              </div>

              <label htmlFor="speciesLatin">Latinskt namn</label>
              <div>
                <input {...register('speciesLatin')} />
              </div>

              <label htmlFor="place">Lokal</label>
              <div>
                <input {...register('place')} />
              </div>
            </div>

            <div className="grid">
              <label htmlFor="county">
                Län
                <select {...register('county')}>{toOptions(counties)}</select>
              </label>

              <label htmlFor="sex">
                Kön
                <select {...register('sex')}>{toOptions(sexes)}</select>
              </label>
            </div>

            <div className="grid">
              <label htmlFor="date">
                Datum
                <input type="date" {...register('date')} />
              </label>

              <label htmlFor="date">
                Bild
                <input list="images-data" autoComplete="off" {...register('image', { onChange: handleChange })} />
                <datalist id="images-data">{toDatalist(images.map(({ filename }) => filename))}</datalist>
              </label>
            </div>

            <footer>
              <button role="button" type="submit">
                Spara
              </button>
            </footer>
          </article>
        </form>
      </div>
    </dialog>
  );
}
