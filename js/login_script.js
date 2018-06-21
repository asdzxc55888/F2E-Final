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

    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    firebase.auth().languageCode = 'pt';
    provider.setCustomParameters({
        'login_hint': 'user@example.com'
    });

    var dbRef = firebase.database().ref();
    // REGISTER DOM ELEMENTS
    const $messageField = $('#messageInput');
    const $nameField = $('#nameInput');
    const $email = $('#email');
    const $password = $('#password');
    const $btnSignIn = $('#btnSignIn');
    const $btnSignOut = $('#btnSignOut');
    const $signInfo = $('#sign-info');
    const $btnGoogleSingIn = $('btnGoogleSingIn');

    var user = firebase.auth().currentUser;
    if (user) {
        $btnSignIn.attr('disabled', 'disabled');
        $btnSignOut.removeAttr('disabled')
    } else {
        $btnSignOut.attr('disabled', 'disabled');
        $btnSignIn.removeAttr('disabled')
    }


    // SignIn
    $btnSignIn.click(function (e) {
        const email = $email.val();
        const pass = $password.val();
        const auth = firebase.auth();
        // signIn
        console.log('sing in function');
        const promise = auth.signInWithEmailAndPassword(email, pass);
        promise.catch(function (e) {
            console.log(e.message);
            //$signInfo.html(e.message);
        });
    });

    // Listening Login User
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log('SignIn ' + user.email);
            $signInfo.html(user.email + " is login...");
            $btnSignIn.attr('disabled', 'disabled');
            $btnSignOut.removeAttr('disabled')

        } else {
            console.log("not logged in");
        }
    });


    // LISTEN FOR KEYPRESS EVENT
    $messageField.keypress(function (e) {
        if (e.keyCode == 13) {
            //FIELD VALUES
            var username = $nameField.val();
            var message = $messageField.val();
            console.log(username);
            console.log(message);

            //SAVE DATA TO FIREBASE AND EMPTY FIELD
            dbRef.push({ name: username, text: message });
            $messageField.val('');
        }
    });

    $btnGoogleSingIn.click(function onSignIn(googleUser) {
        firebase.auth().signInWithRedirect(provider);
        console.log('進來了好棒');
        var profile = googleUser.getBasicProfile();
        console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    });

    firebase.auth().getRedirectResult().then(function(result) {
        if (result.credential) {
          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = result.credential.accessToken;
          // ...
        }
        // The signed-in user info.
        var user = result.user;
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });

});
