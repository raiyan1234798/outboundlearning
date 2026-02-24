import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBxqGLdLSm_aSVDQiOw9ZJdznR3PGuAc4c",
    authDomain: "outboundlearning-c7557.firebaseapp.com",
    projectId: "outboundlearning-c7557",
    storageBucket: "outboundlearning-c7557.firebasestorage.app",
    messagingSenderId: "715452118792",
    appId: "1:715452118792:web:659d9cf7251efe39ef9ebd",
    measurementId: "G-B3MV1PL1SH"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

let analytics = null;
isSupported().then((supported) => {
    if (supported) {
        analytics = getAnalytics(app);
    }
});

export { app, auth, db, storage, analytics };
