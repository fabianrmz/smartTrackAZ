var db = firebase.firestore();

// Sólo llama a la funcion isValid()


function isValid(){
    let batchID = document.getElementById("batchInput").value;
    if (validBatch(batchID)){
        document.getElementById("batchRes").value = "Sí es válido";
    } else {
        document.getElementById("batchRes").value = "No es válido";
    }
}

function validBatch(batchID){
    var data = batchID.split("-");
    let med = data[0];
    let date = data[1];
    let prod = data[2];
    let dest = data[3];
    let batchNum = data[4];
    var num = 0;
    db.collection("medicines").where("ref" == med)
        .get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(num = function (doc, num) {
                if (doc.data().ref == med) {
                    num++;
                }
                return num;
            })

        });
    db.collection("locations").where("ref" == prod)
        .get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(num = function (doc, num) {
                if (doc.data().ref == prod) {
                    num++;
                }
                return num;
            })
        });
    db.collection("locations").where("ref" == dest)
        .get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(num = function (doc, num) {
                if (doc.data().ref == dest) {
                    num++;
                }
                return num;
            })
        });
    if (num == 3) {
        return true;
    } else {
        return false;
    }
}