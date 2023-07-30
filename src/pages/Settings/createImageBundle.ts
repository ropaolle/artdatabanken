import { doc, setDoc, Timestamp } from 'firebase/firestore/lite';
import { db, COLLECTIONS, DOCS, PATHS, getDownloadURLs } from '../../lib/firebase';
import { metadata } from '../../lib/firebase/metadata';

export default async function createImageBundle() {
  const imageList = await getDownloadURLs(PATHS.IMAGES);
  const thumbsList = await getDownloadURLs(PATHS.THUMBNAILS);
  const imageMap = new Map(imageList.map((image) => [image.filename, image]));

  const metadataMap = new Map(
    metadata.map((metadata) => [
      metadata.filename.toLocaleLowerCase(),
      {
        filename: metadata.filename.toLocaleLowerCase(),
        createdAt: Timestamp.fromDate(new Date(metadata.createdAt)),
        updatedAt: Timestamp.fromDate(new Date(metadata.updatedAt)),
      },
    ])
  );

  for (const { filename, URL: thumbnailURL } of thumbsList) {
    if (!filename) continue;

    if (!metadataMap.has(filename)) {
      console.info('Image data missing for', filename);
      continue;
    }

    imageMap.set(filename, {
      id: filename,
      filename,
      thumbnailURL,
      URL: imageMap.get(filename)?.URL,
      createdAt: metadataMap.get(filename)?.createdAt,
      updatedAt: metadataMap.get(filename)?.updatedAt,
    });
  }

  const imageInfo = Array.from(imageMap.values());
  setDoc(doc(db, COLLECTIONS.APPLICATION, DOCS.BUNDLES), { images: imageInfo }, { merge: true });
  setDoc(doc(db, COLLECTIONS.APPLICATION, DOCS.DELETED), { images: [] }, { merge: true });
  setDoc(doc(db, COLLECTIONS.APPLICATION, DOCS.UPDATEDAT), { updatedAt: Timestamp.now() });

  return imageInfo.length;
}
