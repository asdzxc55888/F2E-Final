$(document).ready(function () {

    $('#paint').fadeIn(1000);

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
    var isLogin = false;
    // REGISTER DOM ELEMENTS
    const $email = $('#email');
    const $password = $('#password');
    const $btnSignIn = $('#btnSignIn');
    const $btnSignOut = $('#btnSignOut');
    const $signInfo = $('#sign-info');
    const $btnGoogleSingIn = $('#btnGoogleSingIn');
    const $btnFBSingIn = $('#btnFBSingIn');
    const $btnTwitterSingIn = $('#btnTwitterSingIn');


    var user = firebase.auth().currentUser;
    if (user) {
        $btnSignIn.attr('disabled', 'disabled');
        $btnSignOut.removeAttr('disabled');
        document.getElementById("nav-login").style.display = "none";
        console.log('1');
    } else {
        $btnSignOut.attr('disabled', 'disabled');
        $btnSignIn.removeAttr('disabled');
        console.log('2');
        console.log(user);
    }

    // SignIn
    $btnSignIn.click(function (e) {
        const email = $email.val();
        const pass = $password.val();
        const auth = firebase.auth();
        // signIn
        console.log(email);
        console.log(pass);
        console.log('sing in function');
        const promise = auth.signInWithEmailAndPassword(email, pass);

        promise.catch(function (e) {
            console.log(e.message);
            $signInfo.html(e.message);
        });
    });

    $btnSignOut.click(function () {
        firebase.auth().signOut();
        console.log('LogOut');
        $signInfo.html('No one login...');
        $message.html('');
    });

    // Listening Login User
    var AuthChanged = firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log('SignIn ' + user.email);
            console.log('SignIn ' + user.displayName);

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

            if (user.displayName) {
                $signInfo.html(user.displayName + " is login...");
            } else {
                $signInfo.html(user.email + " is login...");
            }
            isLogin = true;
        } else {
            console.log("not logged in");
        }
    });

    $btnFBSingIn.click(function () {
        var FBprovider = new firebase.auth.FacebookAuthProvider();
        firebase.auth().signInWithRedirect(FBprovider);
        console.log('FBSingIn Function');
    });

    $btnTwitterSingIn.click(function () {
        var Twprovider = new firebase.auth.TwitterAuthProvider();
        firebase.auth().signInWithRedirect(Twprovider);
        console.log('TwitterSingIn Function');
    });

    $btnGoogleSingIn.click(function () {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithRedirect(provider);
        console.log('GoogleSingIn Function');
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

    //設定傳送數值延遲
    $('form').submit( function(event) {
        var form = this;
        console.log("submit");
        setTimeout( function () { 
            if(isLogin){
                alert("登入成功");
                form.submit();
            }else{
                console.log("登入失敗");
            }
        }, 2000);
        return false;
    }); 


});
