import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC_JGr-jX594dCJLuFQx1Yx4w3qqMHl-lc",
  authDomain: "next-inventory-app-8e72e.firebaseapp.com",
  projectId: "next-inventory-app-8e72e",
  storageBucket: "next-inventory-app-8e72e.appspot.com",
  messagingSenderId: "341606504592",
  appId: "1:341606504592:web:3e64c66f9938fc9cf06015",
  measurementId: "G-9R07YC5ZF9"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);


export { firestore };