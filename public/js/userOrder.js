$(document).ready(function () {
    setTimeout(function () {
        $('#paint').fadeIn(0);
    }, 0);
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
    const $logout = $('#nav-logout');

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
            dbRef.child('order' + user.uid).on('value', function (snapshot) {
                var orderData = snapshot.val();
                var item1=orderData.item1
                var item2=orderData.item2
                var item3=orderData.item3
                var item4=orderData.item4
                var item5=orderData.item5
                var item6=orderData.item6
                var item7=orderData.item7
                var item8=orderData.item8
                var item_arr = [item1,item2,item3,item4,item5,item6,item7,item8];
                var totalItem = orderData.totalItem;

                for(var i = 0 ; i < totalItem ; i++){
                    document.getElementById('item-list').innerHTML+="<tr><td class='pname'>"+item_arr[i].itemName +"</td><td class='pqty'>"+item_arr[i].itemNum+"</td></tr>"
                 }
                 document.getElementById('stotal').innerHTML=orderData.totalPrice;
            });
            document.getElementById("nav-logout").innerHTML = "<a class='nav-link' href='index.html'>登出</a>";

        } else {
            console.log("not logged in");
        }
    });

     //登出
     $logout.click(function () {
        firebase.auth().signOut();
        console.log('LogOut');
    });

    $(function(){
        $('a[title]').tooltip();
        });
});
