var db = firebase.firestore();
var meds;
db.collection("medicines").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        meds.push(doc.data());
    });
});

meds.forEach(function (elemento, indice, array) {
    console.log(elemento, indice);
});