importScripts('https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.2/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyA45lPXW9duKEFz3bmec_TfPxOnQR8JoYI",
    authDomain: "geosita-c8092.firebaseapp.com",
    projectId: "geosita-c8092",
    storageBucket: "geosita-c8092.appspot.com",
    messagingSenderId: "791001054395",
    appId: "1:791001054395:web:ffb50f47c55f1d9f8dbd9e",
    measurementId: "G-9CYL9GQEVC",
    databaseURL: "https://geosita-c8092-default-rtdb.firebaseio.com/",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = 'New Message';
  const notificationOptions = {
    body: payload.data.message,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
