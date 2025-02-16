import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore"; 
import { getDocs } from "firebase/firestore"; 
import { doc, getDoc } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyCa29mdIdL7sVZrFZ85jX43tSY4N-nCBpE",
    authDomain: "database-87111.firebaseapp.com",
    projectId: "database-87111",
    storageBucket: "database-87111.firebasestorage.app",
    messagingSenderId: "902097301609",
    appId: "1:902097301609:web:cc20682c69d0ba3ecfb2f8",
    measurementId: "G-HRHSPHGJPJ"
};

const application = initializeApp(firebaseConfig);

const db = getFirestore(application);

async function getPassword(username){
  const querySnapshot = await getDocs(collection(db, "information"));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const Username = data.Username;
    if (Username == username){
      console.log("login"); //TODO: fix
    } else {
      console.log("wrong password")
    }

  });
}

getPassword("asdfasdfasdffdasdf");

async function addUser(username, password){
  try {
      const docRef = await addDoc(collection(db, "information"), {
        Username: username,
        Password: password,
        Points: 0
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
}
