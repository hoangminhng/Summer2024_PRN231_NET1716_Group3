importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyArFMoobUvdi9LlJYUa6DlDSAgjUTnQ9TQ",
  authDomain: "hostelmanagement-e7e30.firebaseapp.com",
  projectId: "hostelmanagement-e7e30",
  storageBucket: "hostelmanagement-e7e30.appspot.com",
  messagingSenderId: "74869570038",
  appId: "1:74869570038:web:1e21797bfc6b59591b2fd7",
  measurementId: "G-13LHWPZZYJ",
};
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message: ", payload);

  const notificationTitle = payload.notification?.title;
  const notificationOptions = {
    body: payload.notification?.body,
    icon: "../public/REAS-removebg-preview.png",
  };
  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
