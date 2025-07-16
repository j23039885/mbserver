import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBagIcddt7BjkYsvC33BqDQfMzsFdjy5D0",
  authDomain: "yuanfong-84448.firebaseapp.com",
  projectId: "yuanfong-84448",
  storageBucket: "yuanfong-84448.firebasestorage.app",
  messagingSenderId: "743419868803",
  appId: "1:743419868803:web:b0c2548633927bd302cdb6",
  measurementId: "G-HCBLT09FXN"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };