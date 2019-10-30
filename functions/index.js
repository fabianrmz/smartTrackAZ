const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();



// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


// Listen for changes in all documents in the 'pacientFeedbacks' collection
exports.setRewards = functions.firestore
    .document('pacientFeedbacks/{pacientFeedbacks}')
    .onWrite((change, context) => {
        const db = admin.firestore();
        console.log(uid)
        var uid= context.auth.uid;
        

    });