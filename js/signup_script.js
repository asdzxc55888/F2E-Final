$(document).ready(function () {
    
    setTimeout(function(){
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
    const $email = $('#email');
    const $password = $('#password');
    const $username = $('#username');
    const $btnSignUp = $('#btnSignUp');
    const $signInfo = $('#sign-info');
    const $confirmPassword = $('#confirmPassword');

    var user = firebase.auth().currentUser;

    if(user){
        $navSignup.style.display="none";
        console.log("有使用者");
    }else{
        console.log("無使用者");
    }

    // 密碼驗證
    function validatePassword() {
        if (password.value != confirmPassword.value) {
            confirmPassword.setCustomValidity("密碼不一致");
        } else {
            confirmPassword.setCustomValidity('');
        }
    }

    password.onchange = validatePassword;
    confirmPassword.onkeyup = validatePassword;

    $("form").submit(function () {
        return false;
    })

    function writeUserData(userId, name, email) {
        dbRef.child('users:' + userId).set({
            username: name,
            email: email,
        });
    }

    //  註冊
    $btnSignUp.click(function () {
        if (password.value == confirmPassword.value) {
            const email = $email.val();
            const pass = $password.val();
            const username = $username.val();
            const auth = firebase.auth();
            // signUp
            console.log('signup function')
            const promise = auth.createUserWithEmailAndPassword(email, pass);
            console.log(promise);

            promise.then(function(user){
                //  將資料寫入database
                auth.signInWithEmailAndPassword(email, pass);
                var user = firebase.auth().currentUser;
                writeUserData(user.uid, username, email);
                console.log("創建帳號成功");
                alert("註冊成功!");
              }).catch(function (e) {
                console.log(e.message);
                $signInfo.html(e.message);
                console.log("創建帳號失敗");
            });
        } else {
            console.log('signup function cant in');
        }
    })

    // Listening Login User
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            window.user = user;
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
                    document.getElementById("nav-user").innerHTML = "<a href='#' class='nav-link'><i class='far fa-user icon_img'></i>你好!"+username+"</a>";
                });
            }else{
                document.getElementById("nav-user").innerHTML = "<a href='#' class='nav-link'><i class='far fa-user icon_img'></i>你好!"+user.displayName+"</a>";
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


    firebase.auth().getRedirectResult().then(function (result) {
        if (result.credential) {
            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            var token = result.credential.accessToken;
            console.log(token);
            // ...
        }
        // The signed-in user info.
        var user = result.user;
        console.log(user);
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        console.log(errorCode);
        console.log(errorMessage);
        console.log(email);
        console.log(credential);
        // ...
    });


});
