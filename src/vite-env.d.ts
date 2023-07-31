/// <reference types="vite/client" />

declare const APP_VERSION: string;
declare const NODE_ENV: string;

type PAGES = 'HOME' | 'IMAGES' | 'SPECIES' | 'COLLECTIONS' | 'SETTINGS';

type ImageInfo = {
  id: string;
  filename: string;
  URL: string;
  thumbnailURL: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

type SpeciesInfo = {
  id: string;
  kingdom: string;
  order: string;
  family: string;
  species: string;
  sex: string;
  county: string;
  place: string;
  speciesLatin: string;
  date: string;
  image: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};
