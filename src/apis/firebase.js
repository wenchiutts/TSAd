// @format
import firebase, { analytics } from 'firebase/app';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/auth';
import * as Analytics from 'expo-firebase-analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyBai94b4Uf7XyvZXCXm2WDXTQmsLPHBKgo',
  authDomain: 'ins-reports-dev.firebaseapp.com',
  databaseURL: 'https://ins-reports-dev.firebaseio.com',
  projectId: 'ins-reports-dev',
  storageBucket: 'ins-reports-dev.appspot.com',
  messagingSenderId: '222094529171',
  appId: '1:222094529171:web:8a493f348d0f706df3b366',
  measurementId: 'G-WE1VMY17V1',
};

if (firebase.apps.length === 0) {
  try {
    firebase.initializeApp(firebaseConfig);
  } catch (e) {
    if (__DEV__) {
      console.log('Init firebase error', e);
    }
  }
}

// const db = firebase.firestore();

export const getAuthState = () =>
  new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged(async user => {
      if (!user) {
        const newUser = await firebase
          .auth()
          .signInAnonymously()
          .catch(e => reject(e));
        resolve({ user: newUser });
      } else {
        resolve({ user });
      }
    });
  });

export const logEvent = ({ name }) => {
  try {
    console.log('firebase logevent');
    Analytics.logEvent(name);
  } catch (e) {
    if (__DEV__) {
      console.log('logEvent error:', e);
    }
  }
};
