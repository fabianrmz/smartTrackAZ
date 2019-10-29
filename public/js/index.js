var lote;
var db = firebase.firestore();
function closeSideNav(){
    M.AutoInit();
}


function openSidenav(){
    var instance = M.Sidenav.getInstance(document.getElementById("slide-out"));
    instance.open();
}



function checkUser(id){
    var uid=id;
    var docRef = db.collection("users").doc(uid);
    docRef.get().then(function(doc) {
        if (doc.exists) {
            
            
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");


            db.collection("users").doc(uid).set({
                name: name,
                email: email,
                userType: "patient"
            })
            .then(function() {
                console.log("Document successfully written!");
              
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
            
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });

}


function setSurvey(){

    
    let scanner = new Instascan.Scanner(
        {
            video: document.getElementById('preview')
        }
    );
    scanner.addListener('scan', function(content) {
        lote=content;
        console.log(lote)
        scanner.stop();
        var instanced = M.Modal.getInstance(document.getElementById("modalCamera"));
        instanced.close();
        

    });

    Instascan.Camera.getCameras().then(cameras => 
    {
        if(cameras.length > 1){
            scanner.start(cameras[1]);
        } else if(cameras.length > 0){
            scanner.start(cameras[0]);
        } else {
            console.error("error con el dispocistivo");
        }
    });


    document.getElementById("closeCameraButton").addEventListener("click",function(){
        scanner.stop();
    });

}




    
