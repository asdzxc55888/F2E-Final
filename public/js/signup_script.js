$(document).ready(function () {
    $('#paint').fadeIn(1000);

    // REGISTER DOM ELEMENTS
    const $email = $('#email');
    const $password = $('#password');
    const $username = $('#usernickname');
    const $btnSignUp = $('#btnSignUp');
    const $confirmPassword = $('#confirmPassword');
    const $name = $('#username');
    const $phone = $('#phone');
    const $birthday = $('#birthday');
    const $address = $('#address');

    //var user = getCookie();

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

    //  註冊
    $btnSignUp.click(function () {
        if (password.value == confirmPassword.value) {
            const email = $email.val();
            const pass = $password.val();
            const username = $username.val();
            const address = $address.val();
            const phone = $phone.val();
            const birthday = $birthday.val();
            const name = $name.val();
            console.log('birthday:'+birthday);
            // signUp
            console.log('signup function')
            $.post("/signUp.html", {
                Email: email,
                Pass: pass,
                Username: username,
                Address: address,
                Phone: phone,
                Birthday: birthday,
                Name: name
            },
            function(data,status){
                var CurrentUser=data.CurrentUser;
                var ID=data.UID;
                console.log(CurrentUser);
                setCookie(CurrentUser,'currentUser');
                setCookie(ID,'UID');
                console.log("創建帳號成功");
                alert("註冊成功!");
                document.location.href="index.html";
            })
        } else {
            console.log('signup function cant in');
        }
    })

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