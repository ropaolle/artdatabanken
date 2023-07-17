# Info

## TODO

- [ ] ?
- NICE TO HAVE
  - [ ] CSS styling of the Datalists.

## Known issues

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
