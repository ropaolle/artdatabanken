# Artdatabanken

Artdatabanken med [Vite](https://vitejs.dev/guide) och [Firebase](https://console.firebase.google.com/).

## Buggar

- [ ] UploadImageDialog <dialog> closes on file input cancelation in Chromiumbased browsers, workaround added in Dialog.tsx.
  - [Bug 1442824](https://bugs.chromium.org/p/chromium/issues/detail?id=1442824)
  - [HTML dialog closes automatically when file input is cancelled. How to prevent?](https://stackoverflow.com/questions/76400460/html-dialog-closes-automatically-when-file-input-is-cancelled-how-to-prevent)

## TODO

- [ ] Importera arter från Excel, eller csv.

- [ ] CSS styling on datalists
- [ ] Visa en toast när: bild laddats upp/raderats och när art skapats/uppdaterats/raderats.
- [ ] Importera bilder från Firebase
- [ ] Skriv ut
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
- NICE TO HAVE
  - [ ] Spara som pdf.
  - [ ] Security for files and db
  - [ ] Image metadata with size?

## Links

- [Artdatabanken 2018](https://artdatabanken.firebaseapp.com/generator)
- [Favicon](https://medium.com/swlh/are-you-using-svg-favicons-yet-a-guide-for-modern-browsers-836a6aace3df)
- FIREBASE
  - [Deploy to Firebase](https://vitejs.dev/guide/static-deploy.html#google-firebase)
  - [Upload files](https://firebase.google.com/docs/storage/web/upload-files)
  - [Add, set and update data](https://firebase.google.com/docs/firestore/manage-data/add-data)
  - [Get data](https://firebase.google.com/docs/firestore/query-data/get-data)
- REACT
  - [Async in UseEffect](https://devtrium.com/posts/async-functions-useeffect)
  - [REACT image corp](https://github.com/DominicTobias/react-image-crop)
  - [React-hook-form](https://react-hook-form.com/get-started)
    - [Modal form](https://codesandbox.io/s/react-hook-form-modal-form-conditional-inputs-c7n0r)
  - [DayJS](https://github.com/iamkun/dayjs)
    - HOOKS
      - [useEffect on objects](https://dev.to/hey_yogini/useeffect-dependency-array-and-object-comparison-45el)
      - [usehooks-ts](https://usehooks-ts.com/)
      - [React Use - Hooks](https://github.com/streamich/react-use)
  - GLOBAL STATE
    - [React hooks global state](https://github.com/dai-shi/react-hooks-global-state)
    - [Understanding and Properly Using React Global State](https://clerk.com/blog/understanding-and-properly-using-react-global-state?utm_source=www.google.com&utm_medium=referral&utm_campaign=none)
      - [Example](https://github.com/pjcjonas/clerk-dev-global-state-with-context)
    - [A guide to choosing the right React state management solution](https://blog.logrocket.com/guide-choosing-right-react-state-management-solution/)
      - [Recoil](https://recoiljs.org/)
- CSS
  - [Responsive image grid](https://www.w3schools.com/howto/howto_css_image_grid_responsive.asp)
  - [CSS Modules](https://www.javascriptstuff.com/css-modules-by-example/)
  - [Grid](https://www.w3schools.com/css/css_grid_container.asp)
  - [Toast notification](https://www.codingnepalweb.com/toast-notification-html-css-javascript/)
  - [datalist example](https://codepen.io/SitePoint/pen/JjbXrvE)
  - [datalist-css](https://github.com/craigbuckler/datalist-css)
  - [Iconify attributes](https://iconify.design/docs/iconify-icon/inline.html)
  - [Hide broken image link icon](https://stackoverflow.com/questions/22051573/how-to-hide-image-broken-icon-using-only-css-html)
- JavaScript
  - [Create thumbnails on the client](https://codepen.io/mttaked/pen/ZLdEKm)
  - [Create thumbnails in a Firebase cloud function](https://medium.com/@christianrb/how-to-create-an-image-thumbnail-with-firebase-cloud-functions-73d4584290ba)
  - [Get URL Parameters](https://www.sitepoint.com/get-url-parameters-with-javascript/)
- VITE
  - [Awesome Vite](https://reacthustle.com/blog/typescript-sort-array-of-objects-by-property#advanced-implementing-a-dynamic-compare-function)
- TYPESCRIPT
  - [Implementing a Dynamic compare function](https://reacthustle.com/blog/typescript-sort-array-of-objects-by-property)

## SETUP

```
yarn create vite artdatabanken --template react-swc-ts
npm install -g firebase-tools
npm run build
firebase login
firebase deploy
```

### Storage rules

```js

rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      // allow read, write: if request.auth != null;
      allow  read, write;
    }
  }
}

// BLOCK

rules_version = '2';

// Craft rules based on data in your Firestore database
// allow write: if firestore.get(
//    /databases/(default)/documents/users/$(request.auth.uid)).data.isAdmin;
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```
