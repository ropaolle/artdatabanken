import { FullMetadata, getStorage, ref, uploadBytes } from 'firebase/storage';
import { PATHS } from '../../lib/firebase';

export type ImageType = 'images' | 'thumbnails';

export default async function importImages(
  images: FileList,
  type: ImageType,
  onUpload?: (metadata: FullMetadata) => void
) {
  if (!images) return;
  const storage = getStorage();
  const promises = [];

  for (const file of images) {
    const fullPath = `${type === 'images' ? PATHS.IMAGES : PATHS.THUMBNAILS}/${file.name.toLocaleLowerCase()}`;
    const storageRef = ref(storage, fullPath);
    const job = uploadBytes(storageRef, file).then(({ metadata }) => {
      typeof onUpload === 'function' && onUpload(metadata);
      return metadata;
    });
    promises.push(job);
  }

  return await Promise.all(promises)
    .then((result) => result)
    .catch((err) => console.error(err));
}
