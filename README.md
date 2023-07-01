# Artdatabanken

Artdatabanken med [Vite](https://vitejs.dev/guide) och [Firebase](https://console.firebase.google.com/).

## TODO

- [ ] Radera bild
  - Visa info om att raderingen lyckades och stäng dialog.
- [ ] Filtrera bilder (filnamn, används används ej)
- [ ] CSS styling on datalists
- [ ] Importera arter från Excel
- [ ] Importera bilder från Firebase
- [ ] Delete image/record and make sure assosiated files also is deleted. Delet images that does not exist in db.
- [ ] Skriv ut eller spara som pdf.
- [ ] Security for files and db
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
  - [Responsive image grid](https://www.w3schools.com/howto/howto_css_image_grid_responsive.asp)
  - [REACT image corp](https://github.com/DominicTobias/react-image-crop)
    - [React image cropping libraries](https://blog.logrocket.com/top-react-image-cropping-libraries/#react-image-crop)
    - [How-to](https://levelup.gitconnected.com/crop-images-on-upload-in-your-react-app-with-react-image-crop-5f3cd0ad2b35)
    - [How-to 2](https://github.com/DominicTobias/react-image-crop/issues/32)
    - [Example](https://codesandbox.io/s/react-image-crop-demo-with-react-hooks-forked-8khsjq?file=/src/App.tsx:4265-4277)
    - [Optimizing canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas)
  - [React-hook-form](https://react-hook-form.com/get-started)
    - [Modal form](https://codesandbox.io/s/react-hook-form-modal-form-conditional-inputs-c7n0r)
  - [DayJS](https://github.com/iamkun/dayjs)
  - [useEffect on objects](https://dev.to/hey_yogini/useeffect-dependency-array-and-object-comparison-45el)
- CSS
  - [Grid](https://www.w3schools.com/css/css_grid_container.asp)
- JavaScript
  - [Create thumbnails on the client](https://codepen.io/mttaked/pen/ZLdEKm)
  - [Create thumbnails in a Firebase cloud function](https://medium.com/@christianrb/how-to-create-an-image-thumbnail-with-firebase-cloud-functions-73d4584290ba)
  - [Get URL Parameters](https://www.sitepoint.com/get-url-parameters-with-javascript/)

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
