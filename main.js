firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var user = firebase.auth().currentUser;   
    if(user != null){

      var email_id = user.email;
      document.getElementById("user_email").innerHTML = email_id;     
    }

    $("#logoutBtn").click(function() {    
      firebase.auth().signOut();
    });
  }
  else {
    window.location = "login.html";
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

function appendMember(member,key){
              var tr = "<tr memberId='" + key +"'><td>"+ member.firstName +"</td><td>"+ member.lastName +"</td><td>"+ member.emailAddress +"</td><td><a " + (member.membership_image ? "href='"+ (member.membership_image) +"'" : "") + "target='_blank'>Lihat Bukti</a></td><td><input type='checkbox' id='switcherySize2' class='switchery-sm' "+ (member.has_activate ? "checked":"") +"/></td></tr>";

              var _tr = $(tr);
              $("input[type=checkbox]",_tr).change(function(){
                var isChecked = $(this).is(":checked");
                firebase.database().ref('members/' + key + "/has_activate").set(isChecked); //set aktif atau nonaktif
              });

              var oldTr = $("tr[memberId="+ key +"]");
              if(oldTr.length > 0){
                oldTr.replaceWith(_tr);
              }else{
                $("#data-member").append(_tr);
              }
        };

        var memberRef = firebase.database().ref('members');
        memberRef.on('child_added', function(data) {
          appendMember( data.val(),data.key);
        });

        memberRef.on('child_changed', function(data) {
          appendMember( data.val(),data.key);
        });

        memberRef.on('child_removed', function(data) {
          var oldTr = $("tr[memberId="+ data.key +"]");
          if(oldTr){
            oldTr.remove();
          }
        });

function appendArticle(article,key){
              var tr = "<tr articleId='" + key +"'><td>"+ article.title +"</td></tr>";
              var _tr = $(tr);

              var oldTr = $("tr[articleId="+ key +"]");
              if(oldTr.length > 0){
                oldTr.replaceWith(_tr);
              }else{
                $("#data-news").append(_tr);
              }
        };

        var articleRef = firebase.database().ref('articles');
          articleRef.on('child_added', function(data) {
            appendArticle( data.val(),data.key);
          });

          articleRef.on('child_changed', function(data) {
            appendArticle( data.val(),data.key);
          });

          articleRef.on('child_removed', function(data) {
            var oldTr = $("tr[articleId="+ data.key +"]");
            if(oldTr){
              oldTr.remove();
            }
          });

function save_article(articleId, id, title, content, urlImg, createdAt, updatedAt) {
   var id = firebase.database().ref().child('articles').push().key;
   var articleId = firebase.database().ref().child('articles').push().key;
   var title = document.getElementById('title').value;
   var content = document.getElementById('content').value;
   var urlImg = document.getElementById('urlImg').src;
   var createdAt = firebase.database.ServerValue.TIMESTAMP;
   var updatedAt = firebase.database.ServerValue.TIMESTAMP;

   if (title == "" || content == "") {
        alert("Title and content are required");
        exit;
   } 
   else {
    firebase.database().ref('articles/' + articleId).set({
      articleId:articleId,
      id: id,
      title: title,
      content: content,
      urlImg: urlImg,
      createdAt: createdAt,
      updatedAt: updatedAt
   });
   }
   
}
