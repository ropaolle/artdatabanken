# Artdatabanken

Artdatabanken med [Vite](https://vitejs.dev/guide) och [Firebase](https://console.firebase.google.com/).

## TODO

- [ ] Sida med filter som visar alla bilder.
- [ ] Sida med filter som visar alla poster.

## Links

- [Favicon](https://medium.com/swlh/are-you-using-svg-favicons-yet-a-guide-for-modern-browsers-836a6aace3df)
- FIREBASE
  - [Deploy to Firebase](https://vitejs.dev/guide/static-deploy.html#google-firebase)
  - [Upload files](https://firebase.google.com/docs/storage/web/upload-files)
  - [File exists](https://jsmobiledev.com/article/storage-file-exist/)
  - [Async/Await uploadTask](https://stackoverflow.com/questions/53156127/async-await-uploadtask)
  - [Add, set and update data](https://firebase.google.com/docs/firestore/manage-data/add-data)
  - [Get data](https://firebase.google.com/docs/firestore/query-data/get-data)
- REACT
  - [Async in UseEffect](https://devtrium.com/posts/async-functions-useeffect)
  - [Responsive image grid](https://www.w3schools.com/howto/howto_css_image_grid_responsive.asp)

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
