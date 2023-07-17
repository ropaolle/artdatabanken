# Artdatabanken

Artdatabanken med [Vite](https://vitejs.dev/guide) och [Firebase](https://console.firebase.google.com/).

## TODO

- [ ] Logga in för att editera och skriva ut...
- PRODUCTION
  - [ ] Deploy (not sure to where/what) and delete unused code and console.log statements.
  - [ ] Protect files and db with [Firebase rules](https://firebase.google.com/docs/firestore/security/get-started).
- NICE TO HAVE
  - [ ] CSS styling of the Datalists.
  - [ ] Visa en toast när: bild laddats upp/raderats och när art skapats/uppdaterats/raderats.
- DONE
  - [x] Firestore qouta hits the limit of 50k reads per day. Use bundles to cache old data.
  - [x] Remove react-use and replace with Zustand.
  - [x] Header on all printed pages
  - [x] Sidnummer printed pages
  - [x] Remove nested CSS, not supported
  - [x] CSS on the species view
  - [x] Re-import hane/hona to male/female
  - [x] Sex and place to string in the species view
  - [x] Import all images and species.
  - [x] Pager för arter och bilder
  - [x] Create page functions
  - [x] Skriv ut och spara som pdf.
  - [x] Create datalists (klass, ordning, familj, lokal)
  - [x] Bildsida: soretera på namn, skapad, uppdaterad
  - [x] Importera arter och bilder från Excel, eller csv.
  - [x] Importera bilder från Firebase
  - [x] Filtrera bilder (filnamn, används används ej)
  - [x] Filtrera arter
  - [x] Move CSS to local files, i.e UploadImageDialog.tsx + UploadImageDialog.css.
  - [x] Global state?
  - [x] Skapa och ändra arter SpeciesDialog
  - [x] Radera bild
  - [x] Uppdatera image-view.
  - [x] Delete image/record and make sure assosiated files also is deleted. Delet images that does not exist in db.
  - [x] Art: Lagra länk till bild. INte filnamn.
  - [x] Använd inte filnamn och art som dokumentnamn. Skapa ett unikt id.
  - [x] Radera art
  - [x] Normalisera filnamn. Små bokstäver och mellanslag till bindestreck.
  - [x] Uppdatera art
  - [x] Välj bild i art
  - [x] Thumbnails
  - [x] Sida med filter som visar alla poster.
  - [x] Refactor upload to use async/await insted of callbacks
  - [x] Image corp library

## Buggar

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

  - [Awesome Vite](https://reacthustle.com/blog/typescript-sort-array-of-objects-by-property#advanced-implementing-a-dynamic-compare-function)

- TYPESCRIPT

  - [Type vs Interface](https://blog.logrocket.com/types-vs-interfaces-typescript/)
  - [Implementing a Dynamic compare function](https://reacthustle.com/blog/typescript-sort-array-of-objects-by-property)

- BROWSER

  - [Favicon](https://medium.com/swlh/are-you-using-svg-favicons-yet-a-guide-for-modern-browsers-836a6aace3df)
  - [PouchDB](https://github.com/pouchdb/pouchdb)
  - [indexedDB](https://github.com/dexie/Dexie.js)

- PACKAGES

  - [DayJS](https://github.com/iamkun/dayjs)
