// Ver detalles medicamentos
firebase.initializeApp({
    apiKey: '### FIREBASE API KEY ###',
    authDomain: '### FIREBASE AUTH DOMAIN ###',
    projectId: '### CLOUD FIRESTORE PROJECT ID ###'
});
var db = firebase.firestore();
var medRef = db.collection("medicine");
var patFbRef = db.collection("pacientFeedbacks");

function getMedInfo(med) {
    var docMed = medRef.doc(med);
    if (docMed != null) {
        displayAllMedInfo(docMed);
    }
}

function displayAllMedInfo(docMed){
    // Actualización de la información en el front-end
}

function submitRetro(){
    // Condiciones para subirlo
    var as = document.getElementById("idDocumento").value;
    var bs = document.getElementById("idDocumento").value;
    if(as != null && bs != null){
        patFbRef.add({

        })
    }
}