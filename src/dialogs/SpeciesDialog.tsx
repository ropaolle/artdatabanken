import classes from './SpeciesDialog.module.css';
import { useState, useEffect } from 'react';
import { useForm, SubmitHandler, type FieldError } from 'react-hook-form';
import { doc, addDoc, setDoc, Timestamp, collection, deleteDoc } from 'firebase/firestore';
import { db, type SpeciesInfo, COLLECTIONS } from '../lib/firebase.ts';
import { toDatalistOptions, toOptions, counties, sexes } from '../lib/options';
import Dialog from './Dialog';
import { useAppStore } from '../lib/zustand.ts';

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

type Props = {
  open: boolean;
  show: React.Dispatch<boolean>;
  values: SpeciesInfo | undefined;
};

export default function SpeciesDialog({ open, show, values }: Props) {
  const { setSpecies, deleteSpecies, images, species } = useAppStore();

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
  }, [values, reset]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset(defaults);
      show(false);
    }
  }, [isSubmitSuccessful, reset, show]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const species: SpeciesInfo = {
        ...data,
        updatedAt: Timestamp.now(),
      };

      if (!data.id) {
        const doc = await addDoc(collection(db, COLLECTIONS.SPECIES), {
          ...species,
          createdAt: Timestamp.now(),
        });
        setSpecies({ ...data, id: doc.id });
      } else {
        await setDoc(doc(db, COLLECTIONS.SPECIES, data.id), species);
        setSpecies(data);
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
        await deleteDoc(doc(db, COLLECTIONS.SPECIES, values.id));
        show(false);
        deleteSpecies(values.id);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const hide = () => {
    reset(defaults);
    show(false);
  };

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
        <input id={id} list={`${id}-data`} autoComplete="off" {...register(id as keyof Inputs, { required })} />
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
    <Dialog open={open} hide={hide} onSubmit={handleSubmit(onSubmit)} title={`Lägg till ny art`}>
      <div className={classes.horizontalForm}>
        <HorizontalInput
          id="species"
          label="Art*"
          dataList={species.map(({ species }) => species)}
          error={errors.species}
          required="This is required."
        />
        <HorizontalInput id="kingdom" label="Klass" dataList={species.map(({ kingdom }) => kingdom)} />
        <HorizontalInput id="order" label="Ordning" dataList={species.map(({ order }) => order)} />
        <HorizontalInput id="family" label="Familj" dataList={species.map(({ family }) => family)} />
        <HorizontalInput id="speciesLatin" label="Latinskt namn" />
        <HorizontalInput id="place" label="Lokal" dataList={species.map(({ place }) => place)} />
      </div>

      <div className="grid">
        <label htmlFor="county">
          Län
          <select id="county" {...register('county')}>
            {toOptions(counties)}
          </select>
        </label>

        <label htmlFor="sex">
          Kön
          <select id="sex" {...register('sex')}>
            {toOptions(sexes)}
          </select>
        </label>

        <label htmlFor="date">
          Datum
          <input id="sex" type="date" {...register('date')} />
        </label>
      </div>

      <div className="grid">
        <label htmlFor="date">
          Bild
          <input
            id="date"
            list="images-data"
            autoComplete="off"
            {...register('image', { onChange: handleImageChange })}
          />
          {images && <datalist id="images-data">{toDatalistOptions(images.map(({ filename }) => filename))}</datalist>}
        </label>

        <label>
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
