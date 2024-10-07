import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyATMxiZ4tvdou3bbRuBeyWl9tIY00sx03s",
    authDomain: "task-81-d.firebaseapp.com",
    projectId: "task-81-d",
    storageBucket: "task-81-d.appspot.com",
    messagingSenderId: "415485860058",
    appId: "1:415485860058:web:92ca0c44c259ef53a52de3",
    measurementId: "G-R4FNTT4H18"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
