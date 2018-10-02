firebase.auth().onAuthStateChanged(function(user) {
  if (user) {

    isValidAdmin(user,function(isValid){
      if(isValid){
        // User is signed in.    
        window.location = "index.html";
      }else{
        firebase.auth().signOut();
        alert('you are not admin');
      }
    });
  }
  else {
    $("#loginBtn").click(function() {
        var email = $("#loginEmail").val();
        var password = $("#loginPassword").val();        

        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.

          var errorCode = error.code;
          var errorMessage = error.message;
          
          window.alert("Error : " + errorMessage);
        });
    });

    $("#logoutBtn").click(function() {    
      firebase.auth().signOut();
    });

  }
});

function isValidAdmin(user,callback){
  var database = firebase.database();
  database.ref('admins/' + user.uid).once('value')
    .then(function(snapshot){
      var uid = snapshot.val();

      if(callback != null && typeof callback === "function"){
          callback(uid != null);
      }
    });
}