var db = firebase.firestore();
var feedbacks = db.collection("feedbacks");

function searchForBadLocs(batchID){
    var locs;
    feedbacks.where("lote" == batchID).get().then(locs = function(querySnapshot, locs) {
        querySnapshot.forEach(function(doc, locs) {
            if(!doc.data().valid){
                locs.push(doc.data().locationId);
            }
        })
        return locs
    })
    return locs;
}

function checkForValid(batchID) {
    var locs = searchForBadLocs(batchID);
    return locs.length == 0 ? true : false;
}