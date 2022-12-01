
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, child, get, onValue } from "firebase/database";

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

const app = initializeApp(firebaseConfig);
const database = getDatabase();

const eveningProfile = [
    {
        "isOn": false,
        "pointId": "point1",
        "pointName": "Hall Light"
    },
    {
        "isOn": false,
        "pointId": "point2",
        "pointName": "Hall Fan 1"
    },
    {
        "isOn": true,
        "pointId": "point3",
        "pointName": "Gate lights"
    },
    {
        "isOn": true,
        "pointId": "point4",
        "pointName": "Balcony lights"
    },
    {
        "isOn": false,
        "pointId": "point5",
        "pointName": "Bedroom light"
    },
    {
        "isOn": false,
        "pointId": "point6",
        "pointName": "Bedroom fan"
    },
    {
        "isOn": false,
        "pointId": "point7",
        "pointName": "Porch light"
    },
    {
        "isOn": false,
        "pointId": "point8",
        "pointName": "Water pump"
    }
];

const morningProfile = [
    {
        "isOn": true,
        "pointId": "point1",
        "pointName": "Hall Light"
    },
    {
        "isOn": true,
        "pointId": "point2",
        "pointName": "Hall Fan 1"
    },
    {
        "isOn": true,
        "pointId": "point3",
        "pointName": "Gate lights"
    },
    {
        "isOn": true,
        "pointId": "point4",
        "pointName": "Balcony lights"
    },
    {
        "isOn": false,
        "pointId": "point5",
        "pointName": "Bedroom light"
    },
    {
        "isOn": false,
        "pointId": "point6",
        "pointName": "Bedroom fan"
    },
    {
        "isOn": false,
        "pointId": "point7",
        "pointName": "Porch light"
    },
    {
        "isOn": false,
        "pointId": "point8",
        "pointName": "Water pump"
    }
];
set(ref(database, 'config/points'), eveningProfile);