var lote;
var uid;
var medName;
var medicineId;
var db = firebase.firestore();
function closeSideNav(){
    M.AutoInit();
}


function openSidenav(){
    var instance = M.Sidenav.getInstance(document.getElementById("slide-out"));
    instance.open();
}



function checkUser(id){
    uid=id;
    var docRef = db.collection("users").doc(uid);
    docRef.get().then(function(doc) {
        if (doc.exists) {
            
            
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");


            db.collection("users").doc(uid).set({
                userId: uid,
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
        console.log(lote);
        scanner.stop();
        var instanced = M.Modal.getInstance(document.getElementById("modalCamera"));
        instanced.close();
        setModalFeedback(lote);

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

function getCoupons(){
    console.log("in here we get the coupons on the modal available for the user")
}


function setModalFeedback(lote){
    var splitBatch=lote.split("_");
    var medRef=splitBatch[0];
    //set information for the modal 
    var instanced = M.Modal.getInstance(document.getElementById("modalFeedback"));
    instanced.open();
    var valid = false;
    db.collection("medicines").where("ref","==", String(medRef))
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    document.getElementById("batchIde").innerText="Medicine: "+doc.data().name;
                    medName=doc.data().name;
                    valid=true;
                    medicineId=doc.id;
                });
            }).then(function(){
                if(!valid){
                    instanced.close();
                    console.log("not valid")
                }else{

                }
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });


}

function reloadPage(){
    //reload page to remove elements from feedback form
    location.reload();
}

function sendFeedBack(){
    //obtain data to upload and validate it
    var description= document.getElementById('description').value;
    document.getElementById('description').value="";
    console.log(description)
    var splitBatch=lote.split("_");
    if(lote.length==26 && splitBatch.length==6 && description.length>24){
        //SYM_010119_MEX_USA_ABCD_FA -> example for batch 26 characthers long
        var splitBatch=lote.split("_");
        console.log(splitBatch)
        var dateFormat=splitBatch[1];
        console.log("format month "+parseInt(dateFormat.substring(0,2)))
        console.log("format day "+parseInt(dateFormat.substring(2,4)))
        console.log("format year "+parseInt(dateFormat.substring(4,6)))
        var batchDate; // batch date TO SAVE
        batchDate= new Date(2000+parseInt(dateFormat.substring(4,6)), parseInt(dateFormat.substring(0,2))-1, parseInt(dateFormat.substring(2,4)));
        console.log(batchDate.getDate());
        console.log(batchDate);
        
        var dateMonthAgo = new Date(); 
        dateMonthAgo.setDate(dateMonthAgo.getDate() - 90); // Set now + 30 days as the new date
        console.log(dateMonthAgo);
        
        if(batchDate>dateMonthAgo){
            var todayDate=new Date;//today date  TO SAVE
            var valid=false;
             //today date  TO SAVE
            var medRef=splitBatch[0];//medicine reference  
            var countryOrigin=splitBatch[2]; //country origin reference  TO SAVE
            var countryDestination=splitBatch[3]; //country Destination reference  TO SAVE
            var batchId = splitBatch[4]; //batch id   TO SAVE
            var assetId = splitBatch[5]; //asset id   TO SAVE
            db.collection("pacientFeedbacks").doc(lote).set({
                batchDate: batchDate,
                feedbackDate: todayDate,
                medicineId: medicineId,
                countryOri: countryOrigin,
                countryDes: countryDestination,
                batchId: batchId,
                assetId: assetId,
                userId: uid         
            })
            .then(function() {
                M.toast({html: "Your feedback has been recieved succesfully!, you have recieved a reward"});
                console.log("Document successfully written!");
            })
            .catch(function(error) {
                M.toast({html: "Ups, there has been a problem with your batch!"})
                console.log(error)
            });                    
        }else{
            M.toast({html: "Ups, your medicine feedback has expired!"})
        }
        /*
        
        */
       
        /*

        if(description.length>24 && ){
            //Add a new document in collection "feedbackPatients"but first validate
            db.collection("patientFeedbacks").doc(lote).set({
                description: "Los Angeles",
                state: "CA",
                country: "USA"
            })
            .then(function() {
                console.log("Document successfully written!");
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });

        }
        */
    }
    
    
}


    
