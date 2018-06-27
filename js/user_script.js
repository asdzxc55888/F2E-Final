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
    const $confirm = $('#confirm_btn');

    console.log($phone);

    var isSubmit = false;

    function writeUserData(userId, name, username, phone, adresse, birthday) {
        dbRef.child('users:' + userId).set({
            username: username,
            name: name,
            phone: phone,
            adresse: adresse,
            birthday: birthday
        });
        isSubmit=true;
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
                    $username.val(data.username);
                    $birthday.val(data.birthday);
                    $phone.val(data.phone);
                    $name.val(data.name);
                    $adresse.val(data.adresse);

                    username = data.username;
                    document.getElementById("nav-user").innerHTML = "<a href='#' class='nav-link'><i class='far fa-user icon_img'></i>你好!" + username + "</a>";
                });
            } else {
                document.getElementById("nav-user").innerHTML = "<a href='#' class='nav-link'><i class='far fa-user icon_img'></i>你好!" + user.displayName + "</a>";
            }
            document.getElementById("nav-logout").innerHTML = "<a class='nav-link' href='index.html'>登出</a>";

        } else {
            console.log("not logged in");
        }
    });

    $confirm.click(function (){
        var user = firebase.auth().currentUser;
        writeUserData(user.uid, $name.val(), $username.val(), $phone.val(), $adresse.val(), $birthday.val());
    });

     //登出
     $logout.click(function () {
        firebase.auth().signOut();
        console.log('LogOut');
    });

    //設定傳送數值延遲
    $('form').submit(function (event) {
        var form = this;
        console.log("submit");
        setTimeout(function () {
            if (isSubmit) {
                alert("修改成功!");
                form.submit();
            } else {
                console.log("資料有誤");
            }
        }, 2000);
        return false;
    });
});
