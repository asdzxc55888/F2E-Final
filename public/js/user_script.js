$(document).ready(function () {
    setTimeout(function () {
        $('#paint').fadeIn(1000);
    }, 2000);

    // REGISTER DOM ELEMENTS
    const $phone = $('#phone');
    const $birthday = $('#birthday');
    const $username = $('#username');
    const $name = $('#name');
    const $address = $('#adresse');
    const $confirm = $('#confirm_btn');
    const $logout = $('#nav-logout');

    //---一次性偵測使用者Cookie---
    var user = null;
    var name = "currentUser=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) { user = c.substring(name.length,c.length); }
    }
    if (user) {
        console.log('SignIn ' + user);
        document.getElementById("nav-login").style.display = 'none';
        $('#nav-login').removeClass('nav-item');
        document.getElementById("nav-user").innerHTML = "<a class='nav-link' href='user.html'><i class='far fa-user icon_img'></i>你好!" + user + "</a>";
        document.getElementById("nav-logout").innerHTML = "<a class='nav-link' href='#'>登出</a>";
        $.post("/user.html", {
            User: user
        },
        function(data,status){
            var Bday = data.Birthday.split('T');
            console.log('Birthday:'+Bday[0]);
            $username.val(user);
            $birthday.val(Bday[0]);
            $phone.val(data.Phone);
            $name.val(data.Name);
            $address.val(data.Address);
        })
    } else {
        console.log("not logged in");
    }
    //---------------------------

    $confirm.click(function (){
        var userID = getCurrentUserID();
        const phone = $phone.val();
        const birthday = $birthday.val();
        const username = $username.val();
        const name = $name.val();
        const address = $address.val();
        console.log("修改")
        $.post("/user.html", {
            UserID: userID,
            Phone: phone,
            Birthday: birthday,
            Username: username,
            Name: name,
            Address: address
        },
        function(data,status){
            if(data=='success'){
                setCookie(username,'currentUser');
                console.log("資料修改成功");
                alert("修改成功!");
            }
            document.location.reload(true);
        })
    });
    getCurrentUserID = function(){
        var user = null;
        var name = "UID=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name) == 0) { user = c.substring(name.length,c.length); }
        }
        return user;
    }  
    setCookie = function(cvalue,cname){
        var d = new Date();
        d.setTime(d.getTime() + (24*60*60*1000));
        var expires = "expires=" + d.toGMTString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }

    //登出
     $logout.click(function () {
        logout();
        console.log('LogOut');
        document.location.href="index.html";
    });
    logout = function(){
        document.cookie = "currentUser=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "ID=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }

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