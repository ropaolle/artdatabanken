import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDG2cSWrnZpiiRI_rtbteXWotkljcDKO-U",
  authDomain: "artdatabanken-2023.firebaseapp.com",
  projectId: "artdatabanken-2023",
  storageBucket: "artdatabanken-2023.appspot.com",
  messagingSenderId: "755130876588",
  appId: "1:755130876588:web:ff1adae7ec3b17d1c01509"
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
