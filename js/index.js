$(document).ready(function () {
    //讀取畫面
    setTimeout(function () {
        $('#paint').fadeIn(1000);
    }, 1800);

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

    const $logout = $('#nav-logout');

    var dbRef = firebase.database().ref();
    var $item = $('.carousel .item');
    var $wHeight = $(window).height();
    $item.height($wHeight);
    $item.addClass('full-screen');

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log('SignIn ' + user.email);
            console.log('SignIn ' + user.displayName);
            document.getElementById("nav-SignUp").style.display = 'none';
            $('#nav-SignUp').removeClass('nav-item');
            document.getElementById("nav-login").style.display = 'none';
            $('#nav-login').removeClass('nav-item');
            var username = user.displayName;

            if (username == undefined) {
                dbRef.child('users:' + user.uid).on('value', function (snapshot) {
                    var data = snapshot.val();
                    console.log(data);
                    username = data.username;
                    console.log(username);
                    document.getElementById("nav-user").innerHTML = "<a class='nav-link'><i class='far fa-user icon_img'></i>你好!" + username + "</a>";
                });
            } else {
                document.getElementById("nav-user").innerHTML = "<a class='nav-link'><i class='far fa-user icon_img'></i>你好!" + user.displayName + "</a>";
            }
            document.getElementById("nav-logout").innerHTML = "<a class='nav-link' href='#'>登出</a>";

            if (user.displayName) {
                $signInfo.html(user.displayName + " is login...");
            } else {
                $signInfo.html(user.email + " is login...");
            }
        } else {
            console.log("not logged in");
        }
    });
    $('.carousel').carousel({
        interval: 4000,
        ride: true
    })

    //登出
    $logout.click(function () {
        firebase.auth().signOut();
        console.log('LogOut');
        location.reload();
        $message.html('');

        document.getElementById("nav-user").style.display = 'none';
        $('#nav-user').removeClass('nav-item');
        document.getElementById("nav-logout").style.display = 'none';
        $('#nav-logout').removeClass('nav-item');

        document.getElementById("nav-SignUp").style.display = 'block';
        $('#nav-SignUp').addClass('nav-item');
        document.getElementById("nav-login").style.display = 'block';
        $('#nav-login').addClass('nav-item');
    });
});