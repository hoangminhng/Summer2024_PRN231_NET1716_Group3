// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyArFMoobUvdi9LlJYUa6DlDSAgjUTnQ9TQ",
  authDomain: "hostelmanagement-e7e30.firebaseapp.com",
  projectId: "hostelmanagement-e7e30",
  storageBucket: "hostelmanagement-e7e30.appspot.com",
  messagingSenderId: "74869570038",
  appId: "1:74869570038:web:1e21797bfc6b59591b2fd7",
  measurementId: "G-13LHWPZZYJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
// const analytics = getAnalytics(app);

export const generateToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    console.log("Notification is", permission);
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: process.env.REACT_APP_VAP_ID_KEY,
      });
      console.log("Message token:", token);
      return token;
    } else {
      const token = "";
      return token;
    }
  } catch (error) {
    console.log("An error occured while getting the token: ", error);
  }
};
