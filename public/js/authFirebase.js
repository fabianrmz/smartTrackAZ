var user = firebase.auth().currentUser;
var name, email, photoUrl, uid, emailVerified;

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log("online")
        
        name = user.displayName;
        email = user.email;
        photoUrl = user.photoURL;
        emailVerified = user.emailVerified;
        uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                         // this value to authenticate with your backend server, if
                         // you have one. Use User.getToken() instead.

        //photo user change
        document.getElementById("photoUserUrl").innerHTML= '<img class="circle" src="'+photoUrl+'">';
        //user name change
        document.getElementById("nameUser").innerHTML=name;
        //user email change
        document.getElementById("emailUser").innerHTML= email;

        //
        document.getElementById("logButtons").innerHTML='<li><a href="#!" onclick="logOut()" id="buttonLog"><i class="material-icons">cancel</i>Log off</a></li>';
        checkUser(uid);

        var surveyElement =' <ul class="collection with-header"> <li class="collection-item"><div><h4>Make survey<a href="#!" class="secondary-content"><i class="material-icons modal-trigger" href="#modalCamera" onclick="setSurvey()" >arrow_forward</i></h4></a></div></li> <li class="collection-item"><div><h4>My rewards<a href="#!" class="secondary-content"><i class="material-icons modal-trigger" href="#modalCoupons" onclick="getCoupons()" >arrow_forward</i></h4></a></div></li> </ul> ';
        document.getElementById("optionPatient").innerHTML=surveyElement;

    } else {
        document.getElementById("logButtons").innerHTML='<li><a href="#!" onclick="googleSignIn()" id="buttonLog"><i class="material-icons">account_circle</i>Log in</a></li>';
        document.getElementById("photoUserUrl").innerHTML= "";
        document.getElementById("nameUser").innerHTML= "Welcome back!!";
        document.getElementById("emailUser").innerHTML= "";
        document.getElementById("optionPatient").innerHTML="";

        
        
        
      // No user is signed in.
      console.log("offline")
    }
  });


function googleSignIn() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
    
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
    
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
   
    
  }

  function logOut(){
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
      }).catch(function(error) {
        // An error happened.
      });
  }

  