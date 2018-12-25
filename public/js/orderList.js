$(document).ready(function () {
    const $OrderBtn = $('#orderButton');

    $(readOrderList());
    function readOrderList(){
        var tableHtml = "";
        $.post('/getOrderList',{
            UID : readCookie('UID')
        },function(data,state){
            console.log(data)
            for(i=0;i<data.length;i++){
                tableHtml += "<tr><td>" + data[i].ID + "</td><td><p>" + data[i].Date.substring(0,9) + "</p></td><td><p>" + data[i].Total_Price + "</p></td><td><button type='button' class='btn btn-outline-success' id = 'orderButton' value = '" + parseInt(i) + "' onclick='ButtonClick(this)'' >更多資訊</button></td>"
            }
            $("#orderListtbody").html(tableHtml);
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

function ButtonClick(button){
    var $table = $('#orderListtbody')
    var orderID=$table[0].rows[button.value].cells[0].innerHTML;
    console.log(button.value);
    console.log($table[0].rows[button.value].cells[0].innerHTML);
    document.location.href = "OrderInformation.html?orderID="+orderID;
}