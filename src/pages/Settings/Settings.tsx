import classes from './Settings.module.css';
import { useState, useRef } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import Page from '../Page';
import createImageBundle from './createImageBundle';
import importSpeciesBundle from './importSpeciesBundle';
import exportDatabase from './exportDatabase';
import importImages, { type ImageType } from './importImages';
import mergeChangesIntoBundle from './mergeChangesIntoBundle';

type FormValues = { imageType: string; importSpecies: FileList; importImages: FileList | undefined };

export default function Settings() {
  const [loading, setLoading] = useState({
    createImageBundle: false,
    importSpecies: false,
    importImages: false,
    mergeChanges: false,
  });
  const importSpeciesRef = useRef<HTMLInputElement>(null);
  const importImagesRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, watch } = useForm<FormValues>({ defaultValues: { imageType: 'images' } });

  const onCreateImageBundle: SubmitHandler<FormValues> = async () => {
    setLoading((prev) => ({ ...prev, createImageBundle: true }));
    const imageCount = await createImageBundle();
    setLoading((prev) => ({ ...prev, createImageBundle: false }));
    toast.success(`Image bundle with ${imageCount} images created.`);
  };

  const onImportSpecies = async (file?: File) => {
    if (!file) return;
    setLoading((prev) => ({ ...prev, importSpecies: true }));
    const species = await importSpeciesBundle(file);
    setLoading((prev) => ({ ...prev, importSpecies: false }));
    toast.success(`Done! ${species.length} species imported.`);
  };

  const onExportDatabase: SubmitHandler<FormValues> = async () => {
    const suggestedName = `species-backup-${new Date().toLocaleDateString()}.csv`;
    const filename = await exportDatabase(suggestedName);
    toast.success(`Database exported to ${filename}.`);
  };

  const onImportImages = async (files?: FileList) => {
    if (!files) return;
    setLoading((prev) => ({ ...prev, importImages: true }));
    const imageType = watch('imageType') as ImageType;
    const metadata = await importImages(files, imageType);
    setLoading((prev) => ({ ...prev, importImages: false }));
    if (importImagesRef.current) {
      importImagesRef.current.value = '';
    }
    toast.success(`${metadata?.length} ${imageType}(s) uploaded.`);
  };

  const onMergeChanges: SubmitHandler<FormValues> = async () => {
    setLoading((prev) => ({ ...prev, mergeChanges: true }));
    const [deletedImages, deletedSpecies] = await mergeChangesIntoBundle();
    toast.success(`${deletedImages} images and ${deletedSpecies} species merged into the new bundle and then deleted.`);
    setLoading((prev) => ({ ...prev, mergeChanges: false }));
  };

  return (
    <Page title="Settings">
      <Toaster />

      <form>
        <div className={classes.actionGrid}>
          <div className={classes.cell}>
            <b>Image bundle</b>
            <p>Regenerate the image bundle based on all existing images in the storage.</p>
            <button
              className={classes.button}
              onClick={handleSubmit(onCreateImageBundle)}
              aria-busy={loading.createImageBundle}
            >
              Create image bundle
            </button>
          </div>

          <div className={classes.cell}>
            <b>Import or export database</b>
            <p>
              Import a .csv file with species to a bundle. The existing species bundle is owerwritten. Or export all
              species to a .csv file.
            </p>
            <div>
              <input
                {...register('importSpecies', { onChange: (e) => onImportSpecies(e.currentTarget.files?.[0]) })}
                type="file"
                accept=".csv"
                ref={importSpeciesRef}
                hidden
              />
              <button
                className={classes.button}
                onClick={(e) => {
                  e.preventDefault();
                  importSpeciesRef.current?.click();
                }}
                aria-busy={loading.importSpecies}
              >
                Import species bundle
              </button>
              <button className={classes.button} onClick={handleSubmit(onExportDatabase)}>
                Export database
              </button>
            </div>
          </div>

          <div className={classes.cell}>
            <b>Import images</b>
            <p>
              Import images or thumbnails to Firestore. Images can also be imported/exported from the Firebase Console
              or CLI.
            </p>
            <input
              {...register('importImages', { onChange: (e) => onImportImages(e.currentTarget.files) })}
              type="file"
              accept=".jpg"
              ref={importImagesRef}
              hidden
              multiple
            />
            <fieldset>
              <legend>Type</legend>
              <label htmlFor="images">
                <input {...register('imageType')} type="radio" value="images" />
                Images (500x500 pixels)
              </label>
              <label htmlFor="thumbnails">
                <input {...register('imageType')} type="radio" value="thumbnails" />
                Thumbnails (100x100 pixels)
              </label>
            </fieldset>
            <button
              className={classes.button}
              onClick={(e) => {
                e.preventDefault();
                importImagesRef.current?.click();
              }}
              aria-busy={loading.importImages}
            >
              Import images
            </button>
          </div>

          <div className={classes.cell}>
            <b>Merge changes</b>
            <p>Create new image and speices bundles that includes all changes.</p>
            <button className={classes.button} onClick={handleSubmit(onMergeChanges)} aria-busy={loading.mergeChanges}>
              Merge changes into bundles
            </button>
          </div>
        </div>
      </form>
    </Page>
  );
}
