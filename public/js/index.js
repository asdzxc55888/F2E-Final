$(document).ready(function () {
    //讀取畫面
    setTimeout(function () {
        $('#paint').fadeIn(0);
    }, 0);

    const $logout = $('#nav-logout');

    var $item = $('.carousel .item');
    var $wHeight = $(window).height();
    $item.height($wHeight);
    $item.addClass('full-screen');

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
        document.getElementById("nav-user").innerHTML = "<a class='nav-link' href='userMenu.html'><i class='far fa-user icon_img'></i>你好!" + user + "</a>";
        document.getElementById("nav-logout").innerHTML = "<a class='nav-link' href='index.html'>登出</a>";
    } else {
        console.log("not logged in");
    }
    //---------------------------
    $('.carousel').carousel({
        interval: 4000,
        ride: true
    })
    
    //登出
    $logout.click(function () {
        logout();
        console.log('LogOut');
        location.reload();
    });
    logout = function(){
        document.cookie = "currentUser=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "UID=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
});