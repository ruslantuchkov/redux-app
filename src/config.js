import { initializeApp } from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

export const appName = 'learnjscourse';

export const firebaseConfig = {
  apiKey: 'AIzaSyBlwaZYc_RwUPkQMOmDIcf-6t1zW5ranu0',
  authDomain: `${appName}.firebaseapp.com`,
  databaseURL: `https://${appName}.firebaseio.com`,
  projectId: appName,
  storageBucket: `${appName}.appspot.com`,
  messagingSenderId: '1096158165845'
};

initializeApp(firebaseConfig);
