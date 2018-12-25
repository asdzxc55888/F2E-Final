$(document).ready(function () {
    $(readOrder());
    function readOrder() {
        var url = location.href;
        console.log(url)
        var totalPrices = 0;
        var cartHTML = "";
            var ary1 = url.split('?');
            var ary2 = ary1[1].split('&');
            var ary3 = ary2[0].split('=');
            var order_ID = ary3[1];
        $.post("/readorder", {
            UID: readCookie('UID'),
            order_ID : order_ID
        }, function (data, state) {
            console.log(data);
            Object.keys(data).forEach(function (key) {
                var row = data[key];
                cartProduct = row.name;
                console.log(cartProduct);
                cartQty = row.Quantity;
                cartPrice = row.price;
                totalPrices+=cartQty*cartPrice;
                cartHTML += "<tr><td class='pname'>" + cartProduct + "</td>" + "<td class='pqty'>" + cartQty + "</td>" + "<td class='pprice'>" + cartPrice + "</td></tr>";
                $("#item-list").html(cartHTML);
            });
            $("#stotal").html(totalPrices);
        })

        $.post("/getDeliveryState",{
            order_ID : order_ID
        }, function (data, state) {
            console.log(data[0].State);
            var deliveryHTML = data[0].State;
            $("#delivery").html(deliveryHTML);
        })
    }

})

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) {
            console.log(c.substring(nameEQ.length, c.length));
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
}