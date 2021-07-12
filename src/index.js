import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import firebase from "firebase";
import "firebase/firestore";

var firebaseConfig = {
  apiKey: "AIzaSyAACkzQU8gv2T0IQtqIZsj48wajUqUTA0s",
  authDomain: "stacks-e4ee3.firebaseapp.com",
  projectId: "stacks-e4ee3",
  storageBucket: "stacks-e4ee3.appspot.com",
  messagingSenderId: "615299316977",
  appId: "1:615299316977:web:9987732ef71ee42a13bd50",
  measurementId: "G-S0CW1FWL5N",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
