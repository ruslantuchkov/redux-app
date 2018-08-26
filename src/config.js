import firebase from 'firebase';

export const appName = 'learnjscourse';
export const firebaseConfig = {
  apiKey: 'AIzaSyBlwaZYc_RwUPkQMOmDIcf-6t1zW5ranu0',
  authDomain: `${appName}.firebaseapp.com`,
  databaseURL: `https://${appName}.firebaseio.com`,
  projectId: appName,
  storageBucket: `${appName}.appspot.com`,
  messagingSenderId: '1096158165845'
};

firebase.initializeApp(firebaseConfig);
