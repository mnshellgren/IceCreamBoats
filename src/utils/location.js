import * as firebase from 'firebase';
import * as permissions from './permissions';

export function getUserLocation() {
  return new Promise((resolve, reject) => {
      permissions.granted().then(() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve(position);
          },
          (error) => reject(error)
          //{enableHighAccuracy: false, timeout: 20000, maximumAge: 1000}
        );
      }).catch(() => {
        alert('Vi måste veta er position om vi ska kunna åka till er');
      });
    }
  );
}

export function uploadUserLocation(userId, latitude, longitude, time) {
  firebase.database().ref('users/'+userId).set({
    latitude: latitude,
    longitude: longitude,
    time: time,
    notified: true,
  });
}