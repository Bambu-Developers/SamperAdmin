// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// PROD
// export const environment = {
//   production: false,
//   urlService: `https://us-central1-sanper-stable.cloudfunctions.net/SanperAPI`,
//   firebase: {
//     apiKey: 'AIzaSyDD-tm3jhua8kIaHbSPkl-TXeTQDBvSoDA',
//     authDomain: 'sanper-stable.firebaseapp.com',
//     databaseURL: 'https://sanper-stable.firebaseio.com',
//     projectId: 'sanper-stable',
//     storageBucket: 'sanper-stable.appspot.com',
//     messagingSenderId: '433484075711'
//   },
// };

// DEV
export const environment = {
  production: false,
  urlService: `https://us-central1-sanper-stable.cloudfunctions.net/SanperAPI`,
  firebase: {
      apiKey: 'AIzaSyD-EogtUgTPasSE26IeNVp2jaoqv4Oxh1g',
      authDomain: 'sanper-dev1.firebaseapp.com',
      databaseURL: 'https://sanper-dev1-default-rtdb.firebaseio.com',
      projectId: 'sanper-dev1',
      storageBucket: 'sanper-dev1.appspot.com',
      messagingSenderId: '177489101048',
      appId: '1:177489101048:web:de7a4f6e6b9e05f75d7b0d'
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
