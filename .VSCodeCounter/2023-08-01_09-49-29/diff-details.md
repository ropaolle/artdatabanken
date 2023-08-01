# Diff Details

Date : 2023-08-01 09:49:29

Directory c:\\GitHub\\artdatabanken\\src

Total : 51 files,  2013 codes, 5 comments, 40 blanks, all 2058 lines

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [src/App.tsx](/src/App.tsx) | TypeScript JSX | 22 | -13 | 3 | 12 |
| [src/components/Footer.tsx](/src/components/Footer.tsx) | TypeScript JSX | 2 | 0 | 0 | 2 |
| [src/components/Navigation.tsx](/src/components/Navigation.tsx) | TypeScript JSX | 6 | 0 | 1 | 7 |
| [src/dialogs/DeleteImageDialog.tsx](/src/dialogs/DeleteImageDialog.tsx) | TypeScript JSX | 5 | 0 | 1 | 6 |
| [src/dialogs/SpeciesDialog.tsx](/src/dialogs/SpeciesDialog.tsx) | TypeScript JSX | 13 | 0 | -1 | 12 |
| [src/dialogs/UploadImageDialog/UploadImageDialog.tsx](/src/dialogs/UploadImageDialog/UploadImageDialog.tsx) | TypeScript JSX | -8 | 0 | 0 | -8 |
| [src/lib/firebase.ts](/src/lib/firebase.ts) | TypeScript | -138 | -16 | -27 | -181 |
| [src/lib/firebase/checkIfFileExists.ts](/src/lib/firebase/checkIfFileExists.ts) | TypeScript | 22 | 0 | 5 | 27 |
| [src/lib/firebase/deleteCollection.ts](/src/lib/firebase/deleteCollection.ts) | TypeScript | 15 | 2 | 5 | 22 |
| [src/lib/firebase/deleteFile.ts](/src/lib/firebase/deleteFile.ts) | TypeScript | 14 | 0 | 3 | 17 |
| [src/lib/firebase/firestore.ts](/src/lib/firebase/firestore.ts) | TypeScript | 20 | 0 | 5 | 25 |
| [src/lib/firebase/getDownloadURLs.ts](/src/lib/firebase/getDownloadURLs.ts) | TypeScript | 12 | 2 | 4 | 18 |
| [src/lib/firebase/index.ts](/src/lib/firebase/index.ts) | TypeScript | 31 | 2 | 6 | 39 |
| [src/lib/firebase/metadata.ts](/src/lib/firebase/metadata.ts) | TypeScript | 1,847 | 0 | 1 | 1,848 |
| [src/lib/firebase/unused.ts](/src/lib/firebase/unused.ts) | TypeScript | 39 | 18 | 11 | 68 |
| [src/lib/firebase/uploadFile.ts](/src/lib/firebase/uploadFile.ts) | TypeScript | 38 | 2 | 4 | 44 |
| [src/lib/index.ts](/src/lib/index.ts) | TypeScript | 13 | 0 | 3 | 16 |
| [src/lib/saveToFile.ts](/src/lib/saveToFile.ts) | TypeScript | 31 | 1 | 3 | 35 |
| [src/lib/state.ts](/src/lib/state.ts) | TypeScript | -107 | -8 | -15 | -130 |
| [src/pages/About.tsx](/src/pages/About.tsx) | TypeScript JSX | 11 | 0 | 2 | 13 |
| [src/pages/Collections/A4Page.tsx](/src/pages/Collections/A4Page.tsx) | TypeScript JSX | -1 | 0 | 0 | -1 |
| [src/pages/Collections/Collections.tsx](/src/pages/Collections/Collections.tsx) | TypeScript JSX | -1 | 0 | 0 | -1 |
| [src/pages/Home.module.css](/src/pages/Home.module.css) | CSS | 3 | 0 | 1 | 4 |
| [src/pages/Home.tsx](/src/pages/Home.tsx) | TypeScript JSX | 6 | 0 | 0 | 6 |
| [src/pages/ImageView.module.css](/src/pages/ImageView.module.css) | CSS | -22 | 0 | -5 | -27 |
| [src/pages/ImageView.tsx](/src/pages/ImageView.tsx) | TypeScript JSX | -90 | -1 | -17 | -108 |
| [src/pages/ImageView/FilterAndSortForm.tsx](/src/pages/ImageView/FilterAndSortForm.tsx) | TypeScript JSX | 37 | 0 | 8 | 45 |
| [src/pages/ImageView/ImageGrid.tsx](/src/pages/ImageView/ImageGrid.tsx) | TypeScript JSX | 25 | 0 | 4 | 29 |
| [src/pages/ImageView/ImageView.module.css](/src/pages/ImageView/ImageView.module.css) | CSS | 22 | 0 | 5 | 27 |
| [src/pages/ImageView/ImageView.tsx](/src/pages/ImageView/ImageView.tsx) | TypeScript JSX | 38 | 0 | 7 | 45 |
| [src/pages/Settings/CreateImageBundle.tsx](/src/pages/Settings/CreateImageBundle.tsx) | TypeScript JSX | -42 | 0 | -8 | -50 |
| [src/pages/Settings/ExportDatabase.tsx](/src/pages/Settings/ExportDatabase.tsx) | TypeScript JSX | -58 | -2 | -11 | -71 |
| [src/pages/Settings/ImportImages.tsx](/src/pages/Settings/ImportImages.tsx) | TypeScript JSX | -82 | 0 | -8 | -90 |
| [src/pages/Settings/ImportSpeciesBundle.tsx](/src/pages/Settings/ImportSpeciesBundle.tsx) | TypeScript JSX | -66 | -1 | -12 | -79 |
| [src/pages/Settings/MergeChangesIntoBundle.tsx](/src/pages/Settings/MergeChangesIntoBundle.tsx) | TypeScript JSX | -40 | -4 | -9 | -53 |
| [src/pages/Settings/Settings.module.css](/src/pages/Settings/Settings.module.css) | CSS | 4 | 7 | 3 | 14 |
| [src/pages/Settings/Settings.tsx](/src/pages/Settings/Settings.tsx) | TypeScript JSX | 118 | 0 | 12 | 130 |
| [src/pages/Settings/createImageBundle.ts](/src/pages/Settings/createImageBundle.ts) | TypeScript | 38 | 0 | 8 | 46 |
| [src/pages/Settings/exportDatabase.ts](/src/pages/Settings/exportDatabase.ts) | TypeScript | 25 | 2 | 7 | 34 |
| [src/pages/Settings/importImages.ts](/src/pages/Settings/importImages.ts) | TypeScript | 24 | 0 | 5 | 29 |
| [src/pages/Settings/importSpeciesBundle.ts](/src/pages/Settings/importSpeciesBundle.ts) | TypeScript | 34 | 0 | 7 | 41 |
| [src/pages/Settings/index.ts](/src/pages/Settings/index.ts) | TypeScript | -16 | 0 | -6 | -22 |
| [src/pages/Settings/mergeChangesIntoBundle.ts](/src/pages/Settings/mergeChangesIntoBundle.ts) | TypeScript | 13 | 4 | 7 | 24 |
| [src/pages/Settings/readUploadedFileAsText.ts](/src/pages/Settings/readUploadedFileAsText.ts) | TypeScript | 13 | 0 | 3 | 16 |
| [src/pages/SpeciesView/Filters.tsx](/src/pages/SpeciesView/Filters.tsx) | TypeScript JSX | -1 | 0 | 0 | -1 |
| [src/pages/SpeciesView/SpeciesView.tsx](/src/pages/SpeciesView/SpeciesView.tsx) | TypeScript JSX | -1 | 0 | 0 | -1 |
| [src/pages/index.ts](/src/pages/index.ts) | TypeScript | -1 | 0 | -1 | -2 |
| [src/state/customStorage.ts](/src/state/customStorage.ts) | TypeScript | 32 | 0 | 4 | 36 |
| [src/state/fetchGlobalState.ts](/src/state/fetchGlobalState.ts) | TypeScript | 19 | 2 | 7 | 28 |
| [src/state/index.ts](/src/state/index.ts) | TypeScript | 69 | 8 | 11 | 88 |
| [src/vite-env.d.ts](/src/vite-env.d.ts) | TypeScript | 26 | 0 | 4 | 30 |

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details