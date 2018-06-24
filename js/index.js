$(function(){
    var $item = $('.carousel .item'); 
    var $wHeight = $(window).height();
    $item.height($wHeight); 
    $item.addClass('full-screen');


    $('.carousel').carousel({
        interval: 4000,
        ride:true
      }) 
});

$(document).ready(function () {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBinw5cvb2cBZKTVwz_GljdBOZdkJnoIqw",
        authDomain: "f2e-final.firebaseapp.com",
        databaseURL: "https://f2e-final.firebaseio.com",
        projectId: "f2e-final",
        storageBucket: "f2e-final.appspot.com",
        messagingSenderId: "493398495425"
    };
    firebase.initializeApp(config);

    var dbRef = firebase.database().ref();

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log('SignIn ' + user.email);
            console.log('SignIn ' + user.displayName);
            document.getElementById("nav-SignUp").style.display='none';
            $('#nav-SignUp').removeClass('nav-item');
            document.getElementById("nav-login").style.display='none';
            $('#nav-login').removeClass('nav-item');
            var username = user.displayName;

            if(username==undefined){
               dbRef.child('users:'+user.uid).on('value', function (snapshot) {
                    var data = snapshot.val();
                    console.log(data);
                    username=data.username;
                    console.log(username);
                    document.getElementById("nav-user").innerHTML = "<a class='nav-link'><i class='far fa-user icon_img'></i>你好!"+username+"</a>";
                });
            }else{
                document.getElementById("nav-user").innerHTML = "<a class='nav-link'><i class='far fa-user icon_img'></i>你好!"+user.displayName+"</a>";
            }


            if (user.displayName) {
                $signInfo.html(user.displayName + " is login...");
            } else {
                $signInfo.html(user.email + " is login...");
            }
        } else {
            console.log("not logged in");
        }
    });
});