import classes from './SpeciesDialog.module.css';
import { useState, useEffect } from 'react';
import { useStoreState, showSpeciesDialog, deleteSpecies, addSpecies, updateSpecies } from '../state';
import { useForm, SubmitHandler, type FieldError } from 'react-hook-form';
import { doc, updateDoc, addDoc, serverTimestamp, collection, deleteDoc } from 'firebase/firestore';
import { db, type SpeciesInfo } from '../lib/firebase.ts';
import { toDatalistOptions, toOptions } from '../lib';
import Dialog, { DialogTypes } from './Dialog';
import { counties, sexes } from '../lib/listData.ts';

type Inputs = Omit<SpeciesInfo, 'updatedAt' | 'createdAt'>;

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
  const dataLists = useStoreState('dataLists');
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

  type HorizontalInputType = {
    id: string;
    label: string;
    dataList?: Set<string> | string[];
    error?: FieldError;
    required?: boolean | string;
  };

  const HorizontalInput = ({ id, label, dataList, error, required = false }: HorizontalInputType) => (
    <>
      <label htmlFor={id}>{label}</label>
      <div>
        <input list={`${id}-data`} autoComplete="off" {...register(id as keyof Inputs, { required })} />
        {dataList && (
          <datalist id={`${id}-data`} className={classes.dataList}>
            {toDatalistOptions(dataList)}
          </datalist>
        )}
        {error && error.type === 'required' && <div className={classes.error}>{error.message}</div>}
      </div>
    </>
  );

  return (
    <Dialog
      id={DialogTypes.SPECIES_DIALOG}
      open={open}
      hide={hide}
      onSubmit={handleSubmit(onSubmit)}
      title={`Lägg till ny art`}
    >
      <div className={classes.horizontalForm}>
        <HorizontalInput
          id="species"
          label="Art*"
          dataList={dataLists.species}
          error={errors.species}
          required="This is required."
        />
        <HorizontalInput id="kingdom" label="Klass" dataList={dataLists.kingdoms} />
        <HorizontalInput id="order" label="Ordning" dataList={dataLists.orders} />
        <HorizontalInput id="family" label="Familj" dataList={dataLists.families} />
        <HorizontalInput id="speciesLatin" label="Latinskt namn" />
        <HorizontalInput id="place" label="Lokal" dataList={dataLists.places} />
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
          <datalist id="images-data">{toDatalistOptions(images.map(({ filename }) => filename))}</datalist>
        </label>

        <label htmlFor="date">
          Förhandsgranskning
          <div className={classes.thumbnailPreview}>{previewImage ? <img src={previewImage} /> : 'Bild saknas'}</div>
        </label>
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
