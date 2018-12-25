$(document).ready(function () {
	$(function () {
		$.post('/changeProductCategory',
			{
				category: '全部'
			},
			UpdateProductInformation);
	});

	$('#category').on('change', function () {
		$.post('/changeProductCategory',
			{
				category: $('#category').val()
			},
			UpdateProductInformation);
	});
});

$(document).on('click', "#addButton", function (event) {
	var productID = $(this).attr('name');
	var data = $('#order' + productID + 'Data').serializeArray();
	event.preventDefault();
	if (readCookie('UID') != null) {
		$.post('/addOrder',
			{
				name: data[0].value,
				price: data[1].value,
				quantity: data[2].value,
				UID: readCookie('UID')
			},
			function (data, status) {
				if (data == 'success') alert("成功加入購物車");
				else alert("不好意思，已經沒有存貨了");
			});
	} else {
		alert("請先登入")
	}
});

function UpdateProductInformation(data, status) {
	var productInformation = '<ul>';
	var buttonText = '';
	var buttonDisabled = '';
	for (i = 0; i < data.length; i++) {
		buttonText = '';
		if(data[i].storage == 0) {
			buttonText = '暫無存貨';
			buttonEnabled = 'disabled';
		}
		else {
			buttonText = '加入購物車';
			buttonEnabled = '';
		}
		productInformation += '<li class="col-12 col-sm-12 col-md-6 col-lg-4"><div class="product-image"><img src="' + data[i].imagePath + '"/></div><div class="product-description"><h3 class="product-name">' + data[i].name + '</h3><p class="product-price">$ ' + data[i].price + '</p><form id="order' + data[i].ID + 'Data" action="#" method="POST" class="add-to-cart"><input type="hidden" name="name" value="' + data[i].name + '"/><input type="hidden" name="price" value="' + data[i].price + '"/><div><label for="qty">數量</label><input type="text" name="qty" class="qty" value="1"/></div><p><input name="' + data[i].ID + '" id="addButton" type="submit" value="' + buttonText + '" class="btn" ' + buttonEnabled + '/></p></form></div></li>';
	}
	productInformation += '</ul>'
	$('#products').html(productInformation);
}

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