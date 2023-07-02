import { useState, useEffect } from 'react';
import { useStoreState, showSpeciesDialog, deleteSpecies, addSpecies, updateSpecies } from '../state';
import { useForm, SubmitHandler } from 'react-hook-form';
import { doc, updateDoc, addDoc, serverTimestamp, collection, deleteDoc } from 'firebase/firestore';
import { db, type SpeciesInfo } from '../lib/firebase.ts';
import { toDatalist, toOptions } from '../lib';
import Dialog, { DialogTypes } from './Dialog';
import { classes, counties, sexes } from '../lib/listData.ts';

type Inputs = Omit<SpeciesInfo, 'updatedAt'>;

const defaults = {
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

export default function SpeciesDialog() {
  const images = useStoreState('images');
  const { open, values } = useStoreState('speciesDialog');
  const [previewImage, setPreviewImage] = useState<string>();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useForm<Inputs>();

  const loadPreview = (filename: string | undefined) => {
    const image = images.find((image) => image.filename === filename);
    setPreviewImage(image?.thumbnailURL);
  };

  useEffect(() => {
    reset(values || defaults);
    loadPreview(values?.image);
  }, [values]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset(defaults);
      showSpeciesDialog(false);
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      // console.log('Add species', data);
      if (data.id) {
        await updateDoc(doc(db, 'species', data.id), {
          ...data,
          updatedAt: serverTimestamp(),
        });
        updateSpecies(data);
      } else {
        const doc = await addDoc(collection(db, 'species'), { ...data, createdAt: serverTimestamp() });
        addSpecies({ ...data, id: doc.id });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement> | undefined) => {
    loadPreview(e?.target.value);
  };

  const handleDelete = async () => {
    if (values?.id) {
      try {
        await deleteDoc(doc(db, 'species', values.id));
        showSpeciesDialog(false);
        deleteSpecies(values.id);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const hide = () => showSpeciesDialog(false);

  return (
    <Dialog
      id={DialogTypes.SPECIES_DIALOG}
      open={open}
      hide={hide}
      onSubmit={handleSubmit(onSubmit)}
      title={`Lägg till ny art`}
    >
      <div className="input-horizontal">
        <label htmlFor="species">Art*</label>
        <div>
          <input {...register('species', { required: true })} />
          {errors.species && errors.species.type === 'required' && <span className="error">This is required!</span>}
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
          <input list="images-data" autoComplete="off" {...register('image', { onChange: handleImageChange })} />
          <datalist id="images-data">{toDatalist(images.map(({ filename }) => filename))}</datalist>
        </label>

        <div className="info-preview">
          <label htmlFor="date">Förhandsgranskning</label>
          {previewImage ? <img src={previewImage} /> : <div>Bild saknas.</div>}
        </div>
      </div>

      <footer>
        <div className="grid">
          <div></div>
          <button className="contrast" role="button" type="button" disabled={!values?.id} onClick={handleDelete}>
            Radera
          </button>
          <button role="button" type="submit" aria-busy={isSubmitting}>
            Spara
          </button>
        </div>
      </footer>
    </Dialog>
  );
}
