$(document).ready(function () {

    $('#paint').fadeIn(1000);

    var isLogin = false;
    // REGISTER DOM ELEMENTS
    const $email = $('#email');
    const $password = $('#password');
    const $btnSignIn = $('#btnSignIn');
    const $btnSignOut = $('#btnSignOut');
    const $signInfo = $('#sign-info');

    // SignIn
    $btnSignIn.click(function (e) {
        const email = $email.val();
        const pass = $password.val();
        // signIn
        console.log(email);
        console.log(pass);
        console.log('sing in function');
        $.post("/login.html", {
            Email: email,
            Pass: pass
        },
        function(data,status){
			if(data == '密碼錯誤') {
				alert('密碼錯誤');
			}
			else {
				var CurrentUser=data.CurrentUser;
				var ID=data.UID;
				setCookie(CurrentUser,'currentUser');
				setCookie(ID,'UID');
				console.log("登入成功");
				alert("成功!");
				document.location.href="index.html";
			}
        })
    });

    $btnSignOut.click(function () {
        document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "UID=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        console.log('LogOut');
        $signInfo.html('No one login...');
        $message.html('');
    });

    setCookie = function(cvalue,cname){
        var d = new Date();
        d.setTime(d.getTime() + (24*60*60*1000));
        var expires = "expires=" + d.toGMTString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }

    //設定傳送數值延遲
    $('form').submit( function(event) {
        return false;
    }); 


});
