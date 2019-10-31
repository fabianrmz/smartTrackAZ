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
    var desc = document.getElementById("desc").value;
    var lote = document.getElementById("lote").value;
    var ts = firebase.firestore.FieldValue.serverTimestamp();
    var userID = "ktQrdD6BBPeqjMKUBxFUsWo9U882"//obtener UserID
    if(desc != null && lote != null){
        patFbRef.add({
            description: desc,
            lote: lote,
            userId: userID,
            time: ts
        })
    }
}