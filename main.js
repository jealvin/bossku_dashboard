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

function deleteNews(key){
  firebase.database().ref('articles/' + key).remove();
};
function deleteForum(key){
  firebase.database().ref('topics/' + key).remove();
};


function appendArticle(article,key){
    var tr = "<tr articleId='" + key +"'><td>"+ article.title +"</td></tr>";
    var action = $("<td><a href='add-news.html?key=" + key + "' class='action-edit'>edit</a> | <a href='#' class='action-delete'>delete</a></td>");
    $('.action-delete',action).click(function(){
      bootbox.confirm("Are you sure?", function(result){ 
        if(result){
          deleteNews(key);
        }
      });
    });
    var _tr = $(tr);
    _tr.append(action);

    var oldTr = $("tr[articleId="+ key +"]");
    if(oldTr.length > 0){
      oldTr.replaceWith(_tr);
    }else{
      $("#data-news").prepend(_tr);
    }
};

function appendForum(forum,key){
    var tr = "<tr forumId='" + key +"'><td>"+ forum.title +"</td><td>" + (forum.open ? "true" : "false") + "</td></tr>";
    var action = $("<td><a href='#' class='action-edit' data-toggle='modal' data-target='#forumModal' data-key='" + key + "'>edit</a> | <a href='#' class='action-delete'>delete</a></td>");
    $('.action-delete',action).click(function(){
      bootbox.confirm("Are you sure?", function(result){ 
        if(result){
          deleteForum(key);
        }
      });
    });
    var _tr = $(tr);
    _tr.append(action);

    var oldTr = $("tr[forumId="+ key +"]");
    if(oldTr.length > 0){
      oldTr.replaceWith(_tr);
    }else{
      $("#data-forum").prepend(_tr);
    }
};


function save_article(articleId, id, title, content, urlImg, createdAt, updatedAt) {
  bootbox.confirm("Are you sure?", function(result){ 
    if(result){
       var id = firebase.database().ref().child('articles').push().key;
       var articleId = firebase.database().ref().child('articles').push().key;
       var title = document.getElementById('title').value;
       var content = document.getElementById('content').value;
       var urlImg = document.getElementById('urlImg').src;
       var createdAt = firebase.database.ServerValue.TIMESTAMP;
       var updatedAt = firebase.database.ServerValue.TIMESTAMP;

       var oldId = document.getElementById('articleKey').value;
       if(oldId != null && oldId != ''){
        articleId = oldId;
       }
       var oldImg = document.getElementById('oldImg').src;
       if(oldImg != null && oldImg != ''){
        urlImg = oldImg;
       }

       if (title == "" || content == "") {
            alert("Title and content are required");
            exit;
       } 
       else {
        if(oldId != null && oldId != ''){
          var updates = {};
          updates['/articles/'+ articleId] = {
            /*articleId:articleId,*/
            /*id: id,*/
            title: title,
            content: content,
            urlImg: urlImg,
            /*createdAt: createdAt,*/
            updatedAt: updatedAt
         }
          firebase.database().ref().update(updates, function(err){
            if(err){
              alert('failed save');
            }else{
              location.reload();
            }
          });

        }else{
          firebase.database().ref('articles/' + articleId).set({
            articleId:articleId,
            id: id,
            title: title,
            content: content,
            urlImg: urlImg,
            createdAt: createdAt,
            updatedAt: updatedAt
         }, function(err){
            if(err){
              alert('failed save');
            }else{
              location.reload();
            }
          });
        }
       }
      
    }
  });
   
}
