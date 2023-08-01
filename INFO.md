# Info

- [Firebase](https://console.firebase.google.com/u/0/project/artdatabanken-2023-dev/firestore/data/~2Fapplication~2Fbundles)
- [Google Cloud](https://console.cloud.google.com/storage/browser/artdatabanken-2023-dev.appspot.com;tab=objects?forceOnBucketsSortingFiltering=true&project=artdatabanken-2023-dev&prefix=&forceOnObjectsSortingFiltering=false)

## TODO

- [ ] Check TODO:s
- NICE TO HAVE
  - [ ] [Re-usable buttons and components](https://www.youtube.com/watch?v=eXRlVpw1SIQ)
  - [ ] CSS styling of the Datalists.
  - [ ] Organize db by user id

## Known issues

- [ ] showSaveFilePicker do not exist, [TypeScript's type definitions for the file system access API are currently broken](https://github.com/microsoft/vscode/issues/141908).
  - Add `npm install --save-dev @types/wicg-file-system-access`
  - In `tsconfig.json` add `"compilerOptions": { "types": [ "@types/wicg-file-system-access"] }`
- [ ] UploadImageDialog `<dialog>` closes on file input cancelation in Chromiumbased browsers, workaround added in Dialog.tsx.
  - [Bug 1442824](https://bugs.chromium.org/p/chromium/issues/detail?id=1442824)
  - [HTML dialog closes automatically when file input is cancelled. How to prevent?](https://stackoverflow.com/questions/76400460/html-dialog-closes-automatically-when-file-input-is-cancelled-how-to-prevent)

## SETUP

```sh
yarn create vite artdatabanken --template react-swc-ts
npm install -g firebase-tools
npm run build
firebase login
firebase use artdatabanken-2023 (https://artdatabanken-2023.web.app)
firebase use artdatabanken-2023-dev (https://artdatabanken-2023-dev.web.app)
firebase deploy --only hosting
```

## Upload images and import databas

1. Delete all files and and clear the database.
2. Upload all images (500x500) and thumbs (100x100) to the buckets images and thumbs.
3. Create database bundles for all images.
4. Import all species into a bundle.

## GCloud Buckets

### Uploading files

Uploading files or folders can be done directly from the console [Artdatabanken-2023-dev consol](<https://console.cloud.google.com/storage/browser/artdatabanken-2023-dev.appspot.com?project=artdatabanken-2023-dev&pageState=(%22StorageObjectListTable%22:(%22f%22:%22%255B%255D%22))&prefix=&forceOnObjectsSortingFiltering=false>).

### Download images

Downloadin complete buckets can only be done from the CLI.

- [Install GCloud](https://cloud.google.com/storage/docs/discover-object-storage-gcloud)

```sh
gsutil -m cp -r "gs://artdatabanken-2023-dev.appspot.com/images" .
```

## Links

- [Artdatabanken 2018](https://artdatabanken.firebaseapp.com/generator)

- FIREBASE

  - [Deploy](https://vitejs.dev/guide/static-deploy.html#google-firebase)
  - [Upload files](https://firebase.google.com/docs/storage/web/upload-files)
  - [Add data](https://firebase.google.com/docs/firestore/manage-data/add-data)
  - [Get data](https://firebase.google.com/docs/firestore/query-data/get-data)
  - [Authentication](https://firebase.google.com/docs/auth/web/google-signin)
  - [Rules](https://firebase.google.com/docs/rules/basics)
  - [Bundles](https://firebase.google.com/docs/firestore/bundles)
  - [Node code snippets](https://github.com/firebase/snippets-node/blob/HEAD/firestore/main/index.js)

- REACT

  - [Async in UseEffect](https://devtrium.com/posts/async-functions-useeffect)
  - Hooks
    - [React Use](https://github.com/streamich/react-use)
    - [Usehooks TS](https://usehooks-ts.com/)
    - [useEffect on objects](https://dev.to/hey_yogini/useeffect-dependency-array-and-object-comparison-45el)
  - Globale state
    - [Zustand](https://github.com/pmndrs/zustand)
    - [Zustand doc](https://docs.pmnd.rs/zustand/migrations/migrating-to-v4)
    - [Understanding and Properly Using React Global State](https://clerk.com/blog/understanding-and-properly-using-react-global-state?utm_source=www.google.com&utm_medium=referral&utm_campaign=none)
    - [A guide to choosing the right React state management solution](https://blog.logrocket.com/guide-choosing-right-react-state-management-solution/)
      - [Recoil](https://recoiljs.org/)

- CSS

  - [CSS Modules](https://www.javascriptstuff.com/css-modules-by-example/)
  - [Toast notification](https://www.codingnepalweb.com/toast-notification-html-css-javascript/)
  - Datalists
    - [Customise Datalist](https://dev.to/siddev/customise-datalist-45p0)
    - [datalist example](https://codepen.io/SitePoint/pen/JjbXrvE)
    - [datalist-css](https://github.com/craigbuckler/datalist-css)

- JavaScript

  - [MSDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

- VITE

  - [Awesome Vite](https://github.com/vitejs/awesome-vite)

- TYPESCRIPT

  - [Type vs Interface](https://blog.logrocket.com/types-vs-interfaces-typescript/)
  - [Implementing a Dynamic compare function](https://reacthustle.com/blog/typescript-sort-array-of-objects-by-property)

- BROWSER

  - [Favicon](https://medium.com/swlh/are-you-using-svg-favicons-yet-a-guide-for-modern-browsers-836a6aace3df)
  - [PouchDB](https://github.com/pouchdb/pouchdb)
  - [indexedDB](https://github.com/dexie/Dexie.js)

- PACKAGES

  - [DayJS](https://github.com/iamkun/dayjs)

## Build

```sh
$ npm run build

> artdatabanken@0.0.1 build
> tsc && vite build

vite v4.3.9 building for production...
✓ 109 modules transformed.
dist/index.html                           0.54 kB │ gzip:   0.34 kB
dist/assets/logo-c03e61ba.svg             1.55 kB │ gzip:   0.66 kB
dist/assets/placeholder-01320683.svg      5.41 kB │ gzip:   2.07 kB
dist/assets/SpeciesView-e1879ee0.css      0.10 kB │ gzip:   0.11 kB
dist/assets/Page-42e6fe10.css             0.14 kB │ gzip:   0.12 kB
dist/assets/ImageView-92623bc0.css        0.32 kB │ gzip:   0.23 kB
dist/assets/Collections-6cf79215.css      1.05 kB │ gzip:   0.49 kB
dist/assets/SpeciesDialog-0680bb30.css    5.25 kB │ gzip:   1.38 kB
dist/assets/index-0cf76ffe.css           74.49 kB │ gzip:  10.59 kB
dist/assets/Page-21248a12.js              0.55 kB │ gzip:   0.34 kB
dist/assets/Home-aa284ea2.js              0.97 kB │ gzip:   0.51 kB
dist/assets/options-4b100823.js           1.60 kB │ gzip:   0.65 kB
dist/assets/Collections-b6b496da.js       2.45 kB │ gzip:   1.15 kB
dist/assets/index-52092936.js             2.68 kB │ gzip:   1.30 kB
dist/assets/SpeciesView-57759d88.js       4.00 kB │ gzip:   1.69 kB
dist/assets/ImageView-6545750b.js         6.02 kB │ gzip:   2.55 kB
dist/assets/SpeciesDialog-4ad1f8eb.js    37.66 kB │ gzip:  13.01 kB
dist/assets/index-6430aea9.js           460.17 kB │ gzip: 117.59 kB
✓ built in 2.31s
```
