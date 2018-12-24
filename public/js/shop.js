$(document).ready(function(){
	$(function() {
		$.post('/changeProductCategory',
		{
			category: '全部'
        },
		UpdateProductInformation);
	});
	
	$('#category').on('change', function(){
		$.post('/changeProductCategory',
		{
			category: $('#category').val()
        },
		UpdateProductInformation);
	});
});

$(document).on('click',"#addButton",function(event) {
    event.preventDefault();
	$.post('/addOrder',
	{
		name: $('#productName').text(),
		quantity: $('#qty').val(),
		price: $('#productPrice').text()
	},
	function(data, status) {
		if(data=='success') alert("成功加入購物車");
		else alert("不好意思，已經沒有存貨了");
	});
});

function UpdateProductInformation(data, status){
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
		productInformation += '<li class="col-12 col-sm-12 col-md-6 col-lg-4"><div class="product-image"><img src="' + data[i].imagePath + '"/></div><div class="product-description"><h3 id="productName" class="product-name">' + data[i].name + '</h3><p id="productPrice" class="product-price" value=' + data[i].price + '>$ ' + data[i].price + '</p><form id="orderData" action="#" method="POST" class="add-to-cart"><div><label for="qty">數量</label><input type="text" name="qty" id="qty" class="qty" value="1"/></div><p><input id="addButton" type="submit" value="' + buttonText + '" class="btn" ' + buttonEnabled + '/></p></form></div></li>';
	}
	productInformation += '</ul>'
	$('#products').html(productInformation);
}