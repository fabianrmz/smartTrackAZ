var lote;
var uid;
var medName;
var medicineId;
var monthNames = [ "January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December" ];

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
            if(doc.data().userType=="admin"){
                var surveyElement =' <ul class="collection with-header"> <li class="collection-item"><div><h4>Recover surveys<a href="#!" class="secondary-content"><i class="material-icons modal-trigger"  href="#modalAdmin">arrow_forward</i></h4></a></div></li> </ul> ';
                var makeFeedback =' <ul class="collection with-header"> <li class="collection-item"><div><h4>Check batch<a href="#fb" class="secondary-content"><i class="material-icons modal-trigger"  href="#modalFeedback">arrow_forward</i></h4></a></div></li> </ul> ';
                document.getElementById("optionPatient").innerHTML=surveyElement + makeFeedback;

                document.getElementById("emailUser").innerHTML+="<br>Admin🛡 ️"

            }else{//patient options
                var surveyElement =' <ul class="collection with-header"> <li class="collection-item"><div><h4>Make survey<a href="#!" class="secondary-content"><i class="material-icons modal-trigger" href="#modalCamera"  >arrow_forward</i></h4></a></div></li> <li class="collection-item"><div><h4>My rewards<a href="#!" class="secondary-content"><i class="material-icons modal-trigger" href="#modalCoupons" onclick="getCoupons()" >arrow_forward</i></h4></a></div></li> <li class="collection-item"><div><h4>My feedbacks<a href="#!" class="secondary-content"><i class="material-icons modal-trigger" href="#modalFeedbacks"  onclick="getFeedbacks()" >arrow_forward</i></h4></a></div></li> </ul> ';
                document.getElementById("optionPatient").innerHTML=surveyElement;
                document.getElementById("emailUser").innerHTML+="<br>Patient 🤒 ️"
                
            }
              
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


function setCamera(){

    document.getElementById("preview").requestFullscreen();
    
    let scanner = new Instascan.Scanner(
        {
            video: document.getElementById('preview')
        }
    );
    scanner.addListener('scan', function(content) {
        lote=content;
        console.log(lote);
        scanner.stop();
        document.exitFullscreen();
        
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


    

}

function getCoupons(){
    console.log("in here we get the reward points on the modal available for the user")
    var points =0;
    var today=new Date;
    console.log(today)
    db.collection("rewards").where("userId", "==", uid)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            if( ( (doc.data().dueDate).toDate() )> new Date){
                console.log(doc.id, " => ", doc.data());
                points+=doc.data().points;
                var dateT=(doc.data().dueDate).toDate();
                var pointsEarned="Points earned: "+doc.data().points;
                var dueDateIn= dateT.getDate()+" "+monthNames[dateT.getMonth()]+" of "+dateT.getFullYear();
                document.getElementById("historyPointsEarned").innerHTML='<li> <div class="collapsible-header"><i class="material-icons">star</i>'+dueDateIn+'</div> <div class="collapsible-body"><span>'+pointsEarned+'</span></div>   </li>'
            }
            
        });
    }).then(function(){
        
        document.getElementById("points").innerHTML="Total points: "+points+"     <i class='material-icons'>star</i>";
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

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
        dateMonthAgo.setDate(dateMonthAgo.getDate() - 90); // Set now - 90 days as the new date
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
                batch: lote,
                userId: uid,
                description: description    
            })
            .then(function() {
                M.toast({html: "Your feedback has been recieved succesfully!"});
                console.log("Document successfully written!");
                var dueDate = new Date(); 
                dueDate.setDate(dateMonthAgo.getDate() + 90); // Set now + 30 days as the new date
                db.collection("rewards").add({
                    userId: uid,
                    points: 55,
                    dueDate: dueDate,
                })
                .then(function(docRef) {
                    console.log("Document written with ID: ", docRef.id);
                    
                })
                .catch(function(error) {
                    console.error("Error adding document: ", error);
                });
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
    }else{
        M.toast({html: "Ups!, there has been a problem processing you batch or feedback"})
    }
    
    
}


function getFeedbacks(){
    var ref=  document.getElementById("feedbackList");
    ref.innerHTML="";
    console.log(uid)
    db.collection("pacientFeedbacks").where("userId", "==", uid)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            var dateT= ((doc.data().feedbackDate).toDate());
            var title= "Country: "+doc.data().countryOri+" " +dateT.getFullYear()+ ", "+dateT.getDate()+" of "+monthNames[dateT.getMonth()];
            var content="Description: "+doc.data().description;
            var liElem='<li>  <div class="collapsible-header"><i class="material-icons">filter_drama</i>'+title+'</div> <div class="collapsible-body"><span>'+content+'</span></div> </li>'
            ref.innerHTML+=liElem;
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}


    
