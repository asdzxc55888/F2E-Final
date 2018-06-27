$(document).ready(function () {
    setTimeout(function () {
        $('#paint').fadeIn(1000);
    }, 2000);
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
    // REGISTER DOM ELEMENTS
    const $phone = $('#phone');
    const $birthday = $('#birthday');
    const $username = $('#username');
    const $name = $('#name');
    const $adresse = $('#adresse');
    const $confirmPassword = $('#confirmPassword');

    console.log($phone);

    var user = firebase.auth().currentUser;
    var isSignUp = false;

    function writeUserData(userId, name, username, phone, adresse, birthday) {
        dbRef.child('users:' + userId).set({
            username: username,
            name: name,
            phone: phone,
            adresse: adresse,
            birthday: birthday
        });
    }

    // Listening Login User
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            window.user = user;
            console.log('SignIn ' + user.email);
            console.log('SignIn ' + user.displayName);
            document.getElementById("nav-login").style.display = 'none';
            $('#nav-login').removeClass('nav-item');
            var username = user.displayName;

            if (username == undefined) {
                dbRef.child('users:' + user.uid).on('value', function (snapshot) {
                    var data = snapshot.val();
                    console.log(data);
                    $username.val(data.username);
                    console.log($username.value);
                    console.log($username);

                    username = data.username;
                    document.getElementById("nav-user").innerHTML = "<a href='#' class='nav-link'><i class='far fa-user icon_img'></i>你好!" + username + "</a>";
                });
            } else {
                document.getElementById("nav-user").innerHTML = "<a href='#' class='nav-link'><i class='far fa-user icon_img'></i>你好!" + user.displayName + "</a>";
            }
        } else {
            console.log("not logged in");
        }
    });

    //設定傳送數值延遲
    $('form').submit(function (event) {
        var form = this;
        console.log("submit");
        setTimeout(function () {
            if (isSignUp) {
                alert("註冊成功!");
                form.submit();
            } else {
                console.log("資料有誤");
            }
        }, 2000);
        return false;
    });
});
