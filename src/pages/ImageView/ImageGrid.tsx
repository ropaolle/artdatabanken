import classes from './ImageView.module.css';
import { timestampToString } from '../../lib';

type Props = {
  images?: ImageInfo[];
  onClick: (image: ImageInfo) => void;
};

export default function ImageGrid({ images, onClick }: Props) {
  if (!images) return null;

  return (
    <div className={classes.gallery}>
      {images.map((image) => {
        const { id, filename, thumbnailURL, updatedAt, createdAt } = image;
        return (
          <figure className={classes.imageCell} key={id} onClick={() => onClick(image)}>
            <img className={classes.image} src={thumbnailURL} alt={filename} /* loading="lazy" */ />
            <div className={classes.info}>
              <div>{filename}</div>
              <div>{<small>({timestampToString(updatedAt || createdAt)})</small>}</div>
            </div>
          </figure>
        );
      })}
    </div>
  );
}
