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
    const $address = $('#adresse');
    const $confirm = $('#confirm_btn');
    const $logout = $('#nav-logout');
    const $ordered = $('#ordered');

    console.log($phone);

    var isSubmit = false;

    function writeUserData() {
        var user = firebase.auth().currentUser;
        dbRef.child('users:' + user.uid).set({
            username: $username.val(),
            name: $name.val(),
            phone: $phone.val(),
            address: $address.val(),
            birthday: $birthday.val()
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

                    username = data.username;
                    document.getElementById("nav-user").innerHTML = "<a href='#' class='nav-link' href='user.html'><i class='far fa-user icon_img'></i>你好!" + username + "</a>";
                });
            } else {
                document.getElementById("nav-user").innerHTML = "<a href='#' class='nav-link' href='user.html'><i class='far fa-user icon_img'></i>你好!" + user.displayName + "</a>";
            }
            dbRef.child('users:' + user.uid).on('value', function (snapshot) {
                var data = snapshot.val();
                $username.val(data.username);
                $birthday.val(data.birthday);
                $phone.val(data.phone);
                $name.val(data.name);
                $address.val(data.address);

                username = data.username;
            });
            document.getElementById("nav-logout").innerHTML = "<a class='nav-link' href='index.html'>登出</a>";

        } else {
            console.log("not logged in");
        }
    });

    $confirm.click(function (){
        writeUserData();
    });

     //登出
     $logout.click(function () {
        firebase.auth().signOut();
        console.log('LogOut');
    });

    $ordered.click(function (){
        var user = firebase.auth().currentUser;
    
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
