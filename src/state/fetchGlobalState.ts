import {
  firestoreFetch,
  firestoreFetchDoc,
  type SpeciesInfo,
  type ImageInfo,
  COLLECTIONS,
  DOCS,
} from '../lib/firebase';
import { mergeArrayOfObjects } from '../lib';

export const fetchGlobalState = async (fullUpdate = true) => {
  // Fetch all new species and images, not jet added to persistent local storage
  const newImages = await firestoreFetch<ImageInfo>(COLLECTIONS.IMAGES);
  const newSpecies = await firestoreFetch<SpeciesInfo>(COLLECTIONS.SPECIES);

  if (!fullUpdate) {
    return { images: newImages, species: newSpecies };
  }

  type Deleted = { images: string[]; species: string[] };
  const deleted = await firestoreFetchDoc<Deleted>(COLLECTIONS.APPLICATION, DOCS.DELETED);

  type Bundles = { images: ImageInfo[]; species: SpeciesInfo[] };
  const bundles = await firestoreFetchDoc<Bundles>(COLLECTIONS.APPLICATION, DOCS.BUNDLES);

  // Exclude deleted images and species
  const bundleImages = bundles.images?.filter(({ filename }) => !deleted.images.includes(filename)) || [];
  const bundleSpecies = bundles.species?.filter(({ id }) => !deleted.species.includes(id || '')) || [];

  return {
    images: mergeArrayOfObjects(bundleImages, newImages),
    species: mergeArrayOfObjects(bundleSpecies, newSpecies),
  };
};
