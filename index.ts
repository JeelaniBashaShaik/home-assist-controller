import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var LED = new Gpio(4, 'out'); //use GPIO pin 4, and specify that it is output

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBcropjkjiIWK_O7MB8d5O8V1chNqxfW9g",
  authDomain: "home-assist-ce12b.firebaseapp.com",
  databaseURL: "https://home-assist-ce12b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "home-assist-ce12b",
  storageBucket: "home-assist-ce12b.appspot.com",
  messagingSenderId: "1059869586230",
  appId: "1:1059869586230:web:ce13fb6a96fb80bc41b997",
  measurementId: "G-XC2KVYP1KQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const database = getDatabase();

function writeUserData() {
    const db = getDatabase();
    set(ref(db, 'config'), {
      point1: true,
      point2: true,
      point3: false
    });
  }

  //writeUserData();


  const db = getDatabase();
const starCountRef = ref(db, 'config');
onValue(starCountRef, (snapshot) => {
  const data = snapshot.val();
  console.log('from read config', data);
  if (data.point1 === true) {
    LED.writeSync(1);
  } else {
    LED.writeSync(0);
  }
});


const fcmTokensRef = ref(db, 'fcmTokens');
onValue(fcmTokensRef, (snapshot) => {
  const data = snapshot.val();
  console.log('fcm tokens', data);
});