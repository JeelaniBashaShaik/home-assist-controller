import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, child, get,onValue } from "firebase/database";
import axios from 'axios';
const GPIO = require('onoff').Gpio;

const SET_POINT = 0;
const UNSET_POINT = 1;

// inputs to pi
const ldrInput = new GPIO(14, 'in');
const fireInput = new GPIO(15, 'in');
const mq6Input = new GPIO(18, 'in');
const motionSensorInput = new GPIO(23, 'in');

const waterTwentyFive = new GPIO(1, 'in');
const waterFifty = new GPIO(7, 'in');
const waterSeventyFive = new GPIO(8, 'in');
const waterHundred = new GPIO(25, 'in');

// outputs from pi
const ldrOutput = new GPIO(4, 'out');
const fireOutput = new GPIO(17, 'out');
const mq6Output = new GPIO(27, 'out');
const motionSensorOutput = new GPIO(21, 'out');

const point1 = new GPIO(9, 'out');
const point2 = new GPIO(10, 'out');
const point3 = new GPIO(11, 'out');
const point4 = new GPIO(0, 'out');
const point5 = new GPIO(5, 'out');
const point6 = new GPIO(6, 'out');
const point7 = new GPIO(13, 'out');
const buzzer = new GPIO(26, 'out');
const waterPump = new GPIO(24, 'out');


ldrOutput.writeSync(1);
fireOutput.writeSync(1);
mq6Output.writeSync(1);
motionSensorOutput.writeSync(1);
point1.writeSync(1);
point2.writeSync(1);
point3.writeSync(1);
point4.writeSync(1);
point5.writeSync(1);
point6.writeSync(1);
point7.writeSync(1);
buzzer.writeSync(0);
waterPump.writeSync(1);


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
  
const fcmApiKey = 'key=AAAA9sUmczY:APA91bFipwXAZMlgRQm9GUmRFsWPiOXbvU6ZA8ycsHfKpsvgevWaLYU2CcWbuG-F9uvAxJ7CMw9ofGPPYdQci24OILXHuSgaW-7oYODucZazDJiP4i6EmUpMXnMBBUtvPxrRlLveS_MV';
const fcmEndpoint = 'https://fcm.googleapis.com/fcm/send';

const app = initializeApp(firebaseConfig);
const database = getDatabase();

let fireSensorConfig:any;

let fcmTokens: any;

const fcmTokensRef = ref(database, 'fcmTokens');
onValue(fcmTokensRef, (snapshot) => {
  const data = snapshot.val();
  let tokens = new Set()
    for(let item of Object.values(data)) {
        tokens.add(item)
    }
    fcmTokens = Array.from(tokens);
});

const pointsRef = ref(database, 'config/points');
onValue(pointsRef, (snapshot) => {
    const points: Array<any> = snapshot.val();
  //  console.log('points config', points);
   /*  points.forEach(point => {
        if (point.isOn) {
            
        }
    }) */
});

const profilesRef = ref(database, 'config/profiles');
onValue(profilesRef, (snapshot) => {
    const data = snapshot.val();
  //  console.log('profiles', data);
});

const fireSensorRef = ref(database, 'config/sensorsConfig/fire');
onValue(fireSensorRef, (snapshot) => {
    const data = snapshot.val();
    console.log('fire sensor config', data);
    fireSensorConfig = data;
    const { isTriggered, shouldNotify, location } = data;
    if (isTriggered) {
        fireOutput.writeSync(0);
        if (shouldNotify) {
            const requestBody = {
                "notification": {
                    "title": "Alert",
                    "body": `Fire sensor triggered at ${location}`
                },
                "to": fcmTokens[0]
            };
            sendNotifications(requestBody);
        }
    } else {
        fireOutput.writeSync(1);
    }
});

fireInput.watch((err: any, value: any) => {
    if (err) {
        console.log(err, 'error from fire input');
      throw err;
    }
    console.log(value, 'fire sensor output');
   /* set(ref(database, 'config/sensorsConfig/fire'), {
    ...fireSensorConfig,
    isTriggered: value
   }); */
});

const motionSensorRef = ref(database, 'config/sensorsConfig/motion');
onValue(motionSensorRef, (snapshot) => {
    const data = snapshot.val();
   // console.log(data, 'from motion sensor');
    const { isTriggered, shouldNotify, location } = data;
    if (isTriggered) {
        motionSensorOutput.writeSync(0);
        if (shouldNotify) {
            const requestBody = {
                "notification": {
                    "title": "Alert",
                    "body": `Activity detected at ${location}`
                },
                "to": fcmTokens[0]
            };
            sendNotifications(requestBody);
        }
    } else {
        motionSensorOutput.writeSync(1);
    }
});

const smokeSensorRef = ref(database, 'config/sensorsConfig/smoke');
onValue(smokeSensorRef, (snapshot) => {
    const data = snapshot.val();
    const { isTriggered, shouldNotify, location } = data;
    if (isTriggered) {
        mq6Output.writeSync(0);
        if (shouldNotify) {
            const requestBody = {
                "notification": {
                    "title": "Alert",
                    "body": `Smoke detected at ${location}`
                },
                "to": fcmTokens[0]
            };
            sendNotifications(requestBody);
        }
    } else {
        mq6Output.writeSync(1);
    }
});

const waterLevelSensorRef = ref(database, 'config/sensorsConfig/waterLevel');
onValue(waterLevelSensorRef, (snapshot) => {
    const data = snapshot.val();
    if (!data.isAutomatic) {
        if (data.shouldNotify) {
            const requestBody = {
                "notification": {
                    "title": "Alert",
                    "body": `Water level reached to ${data.currentLevel}`
                },
                "to": fcmTokens[0]
            };
            sendNotifications(requestBody);
        }
    }
});

const sendNotifications = async (requestBody: any) => {
    const { data } = await axios.post(fcmEndpoint, requestBody, { headers: {
        Authorization: fcmApiKey,
        contentType: 'application/json'
    }});
    console.log('notification sent for ', requestBody.notification.body);
}

const delay = (time: any) => { 
    return new Promise((resolve) => {
      setTimeout(resolve, time)
    })
}