import classes from './SpeciesDialog.module.css';
import { useState, useEffect, useCallback } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { doc, setDoc, Timestamp, deleteDoc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore/lite';
import { db, type SpeciesInfo, COLLECTIONS, DOCS } from '../lib/firebase';
import { toDatalistOptions, counties, sexes } from '../lib/options';
import Dialog from './Dialog';
import { useAppStore } from '../lib/state';
import { HorizontalInput, Input, Select } from './fields';

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
  values?: SpeciesInfo;
};

export default function SpeciesDialog({ open, show, values }: Props) {
  const { addOrUpdateSpecies, deleteSpecies, images, species, user } = useAppStore();
  const [previewImage, setPreviewImage] = useState<string>();
  const {
    register,
    handleSubmit,
    reset,
    // getValues,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useForm<Inputs>();

  const loadPreview = useCallback(
    (filename?: string) => {
      const image = images.find((image) => image.filename === filename);
      setPreviewImage(image?.thumbnailURL);
    },
    [images]
  );

  useEffect(() => {
    reset(values || defaults);
  }, [values, reset]);

  useEffect(() => {
    loadPreview(values?.image);
  }, [loadPreview, values?.image]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset(defaults);
      show(false);
    }
  }, [isSubmitSuccessful, reset, show]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!user) return;

    try {
      const id = data.id || crypto.randomUUID();

      const species: SpeciesInfo = {
        ...data,
        updatedAt: Timestamp.now(),
      };

      if (!data.id) {
        species.id = id;
        species.createdAt = Timestamp.now();
      }

      await setDoc(doc(db, COLLECTIONS.SPECIES, id), species);
      addOrUpdateSpecies(species);
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageChange = async (e?: React.ChangeEvent<HTMLInputElement>) => {
    loadPreview(e?.target.value);
  };

  const handleDelete = async () => {
    if (!user) return;

    if (values?.id) {
      try {
        // Check if doc exists
        const check = await getDoc(doc(db, COLLECTIONS.SPECIES, values.id));
        // Delete doc if it exists. If not it is part of a bundle and shall be tagged for deletion.
        if (check.exists()) {
          await deleteDoc(doc(db, COLLECTIONS.SPECIES, values.id));
        } else {
          await updateDoc(doc(db, COLLECTIONS.APPLICATION, DOCS.DELETED), { species: arrayUnion(values?.id) });
        }
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

  const dataList = (key: keyof Inputs) => species.map((species) => species[key] || '');

  return (
    <Dialog open={open} hide={hide} onSubmit={handleSubmit(onSubmit)} title={`Lägg till ny art`}>
      <div className={classes.horizontalForm}>
        <HorizontalInput
          id="species"
          label="Art*"
          dataList={dataList('species')}
          error={errors.species}
          required="This is required."
          register={register}
        />
        <HorizontalInput id="kingdom" label="Klass" dataList={dataList('kingdom')} register={register} />
        <HorizontalInput id="order" label="Ordning" dataList={dataList('order')} register={register} />
        <HorizontalInput id="family" label="Familj" dataList={dataList('family')} register={register} />
        <HorizontalInput id="speciesLatin" label="Latinskt namn" register={register} />
        <HorizontalInput id="place" label="Lokal" dataList={dataList('place')} register={register} />
      </div>

      <div className="grid">
        <Select id="county" label="Län" options={counties} register={register} />
        <Select id="sex" label="Kön" options={sexes} register={register} />
        <Input id="date" label="Datum" type="date" register={register} />
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
          <button
            className="contrast"
            role="button"
            type="button"
            disabled={!user || !values?.id}
            onClick={handleDelete}
          >
            Radera
          </button>
          <button role="button" type="submit" disabled={!user} aria-busy={isSubmitting}>
            Spara
          </button>
        </div>
      </footer>
    </Dialog>
  );
}
