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
    const $messageField = $('#messageInput');
    const $nameField = $('#nameInput');
    const $email = $('#email');
    const $password = $('#password');
    const $btnSignIn = $('#btnSignIn');
    const $btnSignOut = $('#btnSignOut');
    const $signInfo = $('#sign-info');
    const $btnGoogleSingIn = $('#btnGoogleSingIn');
    const $btnFBSingIn=$('#btnFBSingIn');

    var user = firebase.auth().currentUser;
    if (user) {
        $btnSignIn.attr('disabled', 'disabled');
        $btnSignOut.removeAttr('disabled');
    } else {
        $btnSignOut.attr('disabled', 'disabled');
        $btnSignIn.removeAttr('disabled');
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

    $btnSignOut.click(function(){
        firebase.auth().signOut();
        console.log('LogOut');
        $signInfo.html('No one login...');
        $message.html('');
      });

    // Listening Login User
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log('SignIn ' + user.email);
            console.log('SignIn ' + user.displayName);
            $signInfo.html(user.email + " is login...");
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

    $btnFBSingIn.click(function(){
        var provider = new firebase.auth.FacebookAuthProvider();
        firebase.auth().signInWithRedirect(provider);
        console.log('進來了好棒2');
    });

    $btnGoogleSingIn.click(function () {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithRedirect(provider);
        console.log('進來了好棒');
    });


});
