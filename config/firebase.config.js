// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
const initializeApp=require("firebase/app")
const getAnalytics=require("firebase/analytics")
const dotenv=require("dotenv")

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6b0WTzlPSZvcFLc4NHSeloN4FtxJ7HkY",
  authDomain: "project-1-f9a22.firebaseapp.com",
  projectId: "project-1-f9a22",
  storageBucket: "project-1-f9a22.appspot.com",
  messagingSenderId: "613691081303",
  appId: "1:613691081303:web:567ff8c71341e0dad49912",
  measurementId: "G-CH2YW791DY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);