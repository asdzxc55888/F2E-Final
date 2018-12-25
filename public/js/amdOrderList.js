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
                tableHtml += "<tr><td>" + data[i].ID + "</td><td><button type='button' class='btn btn-outline-success' id = 'orderButton' value = '" + parseInt(i) + "' onclick='ButtonClick(this)'' >更多資訊</button></td>"
                tableHtml += "<td><select id='delivery" + i + "'><option value='準備中'>準備中</option><option value='出貨中'>出貨中</option><option value='訂單完成'>訂單完成</option></select></td></tr>"
            }
            $("#orderListtbody").html(tableHtml);
        })
        var $deliveryState = $("#delivery0");
        $.post('/getDeliveryState',function(data ,state){
            for(i=0;i<data.length;i++){
                $deliveryState = $("#delivery" + i);
                $deliveryState.val(data[i].State);
            }
        })
    }

    function saveDeliveryState(){
        var $table = $("#orderListtbody");
        console.log(table);
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

function SaveButtonClick(button){
    var $table = $("#orderListtbody");
    var $deliveryState = $("#delivery0");
    for(i = 0 ; i < $table[0].rows.length ; i++){
        $deliveryState = $("#delivery" + i);
        $.post('/setDelivery',{
            UID : readCookie('UID'),
            order_ID : $table[0].rows[i].cells[0].innerHTML,
            State : $deliveryState[0].value
        })
        console.log($table[0].rows[i].cells[0].innerHTML);
        console.log($deliveryState[0].value);
    }
    alert("儲存完成");
}