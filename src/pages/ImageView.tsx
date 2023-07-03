import classes from './ImageView.module.css';
import { useStoreState, showDeleteImageDialog, showUploadImageDialog } from '../state';
import Page from './Page';

export default function ImageView() {
  const images = useStoreState('images');

  if (!images) return null;

  const imageList = images.map((image) => {
    const { filename, /* thumbnail, downloadURL, */ thumbnailURL /* , updatedAt */ } = image;
    return (
      <figure className={classes.imageCell} key={filename} onClick={() => showDeleteImageDialog(true, image)}>
        <img className={classes.image} src={thumbnailURL} alt={filename} loading="lazy" />
      </figure>
    );
  });

  return (
    <Page title="Bilder" headerButtonTitle="Ladda upp bild" onHeaderButtonClick={() => showUploadImageDialog(true)}>
      <div className={classes.gallery}>{imageList}</div>
    </Page>
  );
}
