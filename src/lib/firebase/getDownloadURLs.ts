import { ref, getDownloadURL, listAll } from 'firebase/storage';
import { storage } from './index';

export default async function getDownloadURLs(filePath: string): Promise<Partial<ImageInfo>[]> {
  const promises: Promise<Partial<ImageInfo>>[] = [];

  //INFO: Not sure how many items we can fetch per call. Ther seems to be some kind of limit with
  // a pager, see https://firebase.google.com/docs/storage/web/list-files#paginate_list_results.
  const listRef = ref(storage, filePath);
  await listAll(listRef).then((res) =>
    res.items.forEach((itemRef) =>
      promises.push(getDownloadURL(itemRef).then((url) => ({ filename: itemRef.name, URL: url })))
    )
  );

  return Promise.all(promises);
}
