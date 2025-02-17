import express from 'express';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, updateDoc } from 'firebase/firestore';
import { collection, addDoc } from 'firebase/firestore';
import { getDocs } from 'firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';

const app = express();
const port = process.env.PORT || 10000;
const host = '0.0.0.0';
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use(cookieParser());

let login = false;

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
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function checkLoginStatus(username, password){
  const querySnapshot = await getDocs(collection(db, "information"));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const Username = data.Username;
    const Password = data.Password;
    if (Username == username){
        if (Password == password){
            login = true;
        }
    }
  });
}

async function getLeaderboard() {
    const amountDoc = await getDoc(doc(db, 'leaderboard', 'amount'));
    const nameDoc = await getDoc(doc(db, 'leaderboard', 'name'));
    
    const amountData = amountDoc.data();    
    const nameData = nameDoc.data();
    
    amountData.values.forEach(value => {
        console.log(value); //remove and value is each element in array
    });
    
    nameData.values.forEach(value => {
        console.log(value); //same as above
    });
}

async function changeLeaderboard(amount, name) {
    const amountRef = doc(db, 'leaderboard', 'amount');
    const nameRef = doc(db, 'leaderboard', 'name');

    await updateDoc(amountRef, {
        values: amount
    });
    await updateDoc(nameRef, {
        values: name
    });
}

async function addUser(username, password){
  try {
      const docRef = await addDoc(collection(db, "information"), {
        Username: username,
        Password: password,
        Points: 0,
        Location: [],
        Donation: 0,

      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
}

app.get('/', (req, res) => {
    const user = req.cookies.user;
    if (user){
        res.sendFile(path.join(__dirname, "public", "index.html"));
    } else {
        res.sendFile(path.join(__dirname, "public", "login.html"))
    } 
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "signup.html"));

});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"))
});

app.post('/submit', async (req, res) => {
    const username = req.body.Username;
    const password = req.body.Password;
    await checkLoginStatus(username, password)
    if (login){
        res.cookie('user', username, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 86400000
        });
        res.sendFile(path.join(__dirname, "public", "index.html"));
    } else {
        res.sendFile(path.join(__dirname, "public", "login.html"))
    }
});

app.post('/create', async (req, res) => {
    await addUser(req.body.Username, req.body.Password);
    await checkLoginStatus(req.body.Username, req.body.Password);
    res.cookie('user', username, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 86400000
    });
    res.sendFile(path.join(__dirname, "public", "index.html"));
});




app.get('/location', (req, res) => {
    const user = req.cookies.user;
    if (user){
        res.sendFile(path.join(__dirname, "public", "location.html"));
    } else {
        res.sendFile(path.join(__dirname, "public", "login.html"))
    }
});

app.get('/profile', (req, res) => {
    const user = req.cookies.user;
    if (user){
        res.sendFile(path.join(__dirname, "public", "profile.html"));
    } else {
        res.sendFile(path.join(__dirname, "public", "login.html"))
    }
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`);
});

