import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, type ImageInfo } from '../lib/firebase.ts';
import { toDatalist, toOptions } from '../lib';

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
  close: () => void;
  defaultValues: Inputs;
  images: ImageInfo[];
};

const defaultValues2 = {
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

export default function SpeciesDialog({ open, close, defaultValues, images }: Props) {
  const [previewImage, setPreviewImage] = useState<string>();

  const {
    register,
    handleSubmit,
    // watch,
    reset,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useForm<Inputs>({
    // defaultValues: defaultValues,
  });

  const loadPreview = (filename: string) => {
    const image = images.find((image) => image.filename === filename);
    setPreviewImage(image?.thumbnailURL);
  };

  useEffect(() => {
    // console.log('reset');
    reset(defaultValues);
    loadPreview(defaultValues.image);
  }, [defaultValues, reset]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset(defaultValues2);
      close();
    }
  }, [isSubmitSuccessful, reset, close]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      // TODO: CreatedAt
      console.log('Add species', data);

      const image = images.find(({ filename }) => filename === data.image);
      // if (image) {
      //   delete image.createdAt;
      //   delete image.updatedAt;
      // }
      // console.log('image', image);
      await setDoc(doc(db, 'species', data.species), {
        ...data,
        updatedAt: serverTimestamp(),
        downloadURL: image?.downloadURL,
        thumbnailURL: image?.thumbnailURL,
      });
    } catch (error) {
      console.error(error);
    }
  };

  // console.log(watch('example'));

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement> | undefined) => {
    loadPreview(e?.target.value || '');
  };

  const onClick = (e: React.FormEvent) => {
    e.preventDefault();
    close();
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

              <label htmlFor="date">
                Datum
                <input type="date" {...register('date')} />
              </label>
            </div>

            <div className="grid">
              <label htmlFor="date">
                Bild
                <input list="images-data" autoComplete="off" {...register('image', { onChange: handleChange })} />
                <datalist id="images-data">{toDatalist(images.map(({ filename }) => filename))}</datalist>
              </label>

              <div className="info-preview">
                <label htmlFor="date">Förhandsgranskning</label>
                {previewImage ? <img src={previewImage} /> : <div>Bild saknas.</div>}
              </div>
            </div>

            <footer>
              <div className="grid">
                {/* <button role="button" type="reset">
                  Rensa
                </button>     */}
                <div></div>
                <button className='secondary' role="button" type="button">
                  Radera
                </button>     
                <button role="button" type="submit" aria-busy={isSubmitting}>
                  Spara
                </button>
              </div>
            </footer>
          </article>
        </form>
      </div>
    </dialog>
  );
}
