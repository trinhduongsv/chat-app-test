import firebase from 'firebase/app';

import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

var firebaseConfig = {
    apiKey: "AIzaSyCYClr2cLptZSAuz7BTL6e4Hfsho_Z2ZH8",
    authDomain: "chat-app-gr6.firebaseapp.com",
    databaseURL: "https://chat-app-gr6-default-rtdb.firebaseio.com",
    projectId: "chat-app-gr6",
    storageBucket: "chat-app-gr6.appspot.com",
    messagingSenderId: "14778343514",
    appId: "1:14778343514:web:60f596b9e20520603ff863",
    measurementId: "G-6T8H8P266K"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const storage = firebase.storage();
const auth = firebase.auth();
const db = firebase.firestore();

if (window.location.hostname === 'localhost') {
    // auth.useEmulator('http://localhost:9099');
    // db.useEmulator('localhost', '8080');
}

export { db, auth,storage };
export default firebase;