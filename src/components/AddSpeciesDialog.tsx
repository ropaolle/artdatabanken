import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, getImageInfo } from '../lib/firebase.ts';
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
  { value: 'skane', label: 'Skåne län' },
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
  // imageFile: FileList;
};

type Props = {
  open: boolean;
  hide: () => void;
  // show: (dialog: string, show?: boolean) => void;
  // show: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AddSpeciesDialog({ open, hide }: Props) {
  

  const {
    register,
    handleSubmit,
    // watch,
    // formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      species: 'Skogsmus',
      place: '',
      date: new Date().toLocaleDateString(),
      kingdom: '',
      order: '',
      family: '',
      county: '',
      speciesLatin: 'Musus musus',
      sex: '',
    },
  });



  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);
    try {
      console.log('files', images);
      await setDoc(doc(db, 'species', data.species), { ...data, updatedAt: serverTimestamp() });
    } catch (error) {
      console.error(error);
    }
  };

  // console.log(watch('example'));

  const onClick = (e: React.FormEvent) => {
    e.preventDefault();
    hide();
    // show(dialogId, false);
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
              <input {...(register('species'), { required: true })} />

              <label htmlFor="kingdom">Klass</label>
              <input list="classes-data" autoComplete="off" {...register('kingdom')} />
              <datalist id="classes-data">{toDatalist(classes)}</datalist>

              <label htmlFor="order">Ordning</label>
              <input {...register('order')} />

              <label htmlFor="family">Familj</label>
              <input {...register('family') /* , { required: true } */} />

              <label htmlFor="speciesLatin">Latinskt namn</label>
              <input {...register('speciesLatin')} />

              <label htmlFor="place">Lokal</label>
              <input {...register('place')} />
            </div>

            <div className="grid">
              <label htmlFor="county">
                Län
                <select {...register('county')}>{toOptions(counties)}</select>
              </label>
              {/* <fieldset>
                <legend>Kön</legend>
                <div className="grid">
                  <label htmlFor="small">
                    <input type="radio" value="female" {...register('sex')} />
                    Hona
                  </label>
                  <label htmlFor="medium">
                    <input type="radio" value="male" {...register('sex')} />
                    Hane
                  </label>
                </div>
              </fieldset> */}
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
                {/* <input type="file" {...register('imageFile', { onChange: handleChange })} /> */}
                <input list="images-data" autoComplete="off" {...register('image')} />
                <datalist id="images-data">{toDatalist(images)}</datalist>
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
