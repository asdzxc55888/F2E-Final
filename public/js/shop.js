$(document).ready(function() {
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

$(document).on('click', '#addButton', function(event) {
	var productID = $(this).attr('name');
	var data = $('#order' + productID + 'Data').serializeArray();
    event.preventDefault();
	$.post('/addOrder',
	{
		name: data[0].value,
		price: data[1].value,
		quantity: data[2].value
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
		productInformation += '<li class="col-12 col-sm-12 col-md-6 col-lg-4"><div class="product-image"><img src="' + data[i].imagePath + '"/></div><div class="product-description"><h3 class="product-name">' + data[i].name + '</h3><p class="product-price">$ ' + data[i].price + '</p><form id="order' + data[i].ID + 'Data" action="#" method="POST" class="add-to-cart"><input type="hidden" name="name" value="' + data[i].name + '"/><input type="hidden" name="price" value="' + data[i].price + '"/><div><label for="qty">數量</label><input type="text" name="qty" class="qty" value="1"/></div><p><input name="' + data[i].ID + '" id="addButton" type="submit" value="' + buttonText + '" class="btn" ' + buttonEnabled + '/></p></form></div></li>';
	}
	productInformation += '</ul>'
	$('#products').html(productInformation);
}