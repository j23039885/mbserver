const fs = require("fs");
const path = require("path");
const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  doc,
  setDoc,
} = require("firebase/firestore");

// Load the data
const menuData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "menuItems.json"), "utf8")
);

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBagIcddt7BjkYsvC33BqDQfMzsFdjy5D0",
  authDomain: "yuanfong-84448.firebaseapp.com",
  projectId: "yuanfong-84448",
  storageBucket: "yuanfong-84448.firebasestorage.app",
  messagingSenderId: "743419868803",
  appId: "1:743419868803:web:b0c2548633927bd302cdb6",
  measurementId: "G-HCBLT09FXN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Upload only Bread & Toast
const uploadBreadItems = async () => {
  const breadItems = menuData.filter(
    (item) => item.type === "Bread & Toast"
  );

  for (const item of breadItems) {
    const docData = {
      name: item.name,
      price: item.price,
    };

    const colRef = collection(db, "menu", "bread", "items");
    const docRef = doc(colRef, item.name); // Use name as document ID
    await setDoc(docRef, docData);
    console.log(`✅ Uploaded: ${item.name}`);
  }
};

uploadBreadItems().catch((err) => console.error("Upload failed:", err));
