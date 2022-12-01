import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, child, get,onValue } from "firebase/database";

/* var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var LED = new Gpio(4, 'out'); //use GPIO pin 4, and specify that it is output */

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

const apiKey = 'key=AAAA9sUmczY:APA91bFipwXAZMlgRQm9GUmRFsWPiOXbvU6ZA8ycsHfKpsvgevWaLYU2CcWbuG-F9uvAxJ7CMw9ofGPPYdQci24OILXHuSgaW-7oYODucZazDJiP4i6EmUpMXnMBBUtvPxrRlLveS_MV';

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


const starCountRef = ref(database, 'config');
onValue(starCountRef, (snapshot) => {
  const data = snapshot.val();
  console.log('from read config', data);
  /* if (data.point1 === true) {
    LED.writeSync(1);
  } else {
    LED.writeSync(0);
  } */
});


const sendNotifications = () => {
  const dbRef = ref(database);
  get(child(dbRef, 'fcmTokens'))
};


/* const fcmTokensRef = ref(db, 'fcmTokens');
onValue(fcmTokensRef, (snapshot) => {
  const data = snapshot.val();
  console.log('fcm tokens', data);
}); */


// check sensor outputs
// map these to raspberry pi and see if it is responding
// create write methods for sensor outputs

// configure
  // setup firebase config, add listeners to rtdb, setup gpio pins for input/output

// loop
  // keep listening for gpio inputs and write to db