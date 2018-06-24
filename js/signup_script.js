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
    // REGISTER DOM ELEMENTS
    const $email = $('#email');
    const $password = $('#password');
    const $username = $('#username');
    const $btnSignUp = $('#btnSignUp');
    const $signInfo = $('#sign-info');
    const $confirmPassword = $('#btnTwitterSingIn');

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

    $("form").submit(function(){
        return false;
    })

    $btnSignUp.click(function () {
        if (password.value == confirmPassword.value) {
            const email = $email.val();
            const pass = $password.val();
            const username = $username.val();
            const auth = firebase.auth();
            // signUp
            console.log('signup function')
            const promise = auth.createUserWithEmailAndPassword(email, pass);
            dbRef.set({
                user:{name: username.val(), email: email.val()}
            })
            promise.catch(function (e) {
                console.log(e.message);
                $signInfo.html(e.message);
            });
        }else{
            console.log('signup function cant in');
        }
    })

    

    // Listening Login User
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log('SignIn ' + user.email);
            console.log('SignIn ' + user.displayName);
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
