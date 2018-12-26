$(document).ready(function() {
	$(function() {
		$.post('/getProducts', function(data, status) {
			var products = '<h4>選擇商品：</h4>';
			for(i = 0; i < data.length; i++) {
				products += '<button id="product">' + data[i].name + '</button>';
			}
			$('#productButton').html(products);
		});
	});
});

$(document).on('click', '#product', function() {
	$('#previousName').val($(this).text());
	$.post('/getProductInformation', 
	{
		name:$(this).text()
	},
	function(data, status) {
		$('#productName').val(data[0].name);
		$('#productPrice').val(data[0].price);
		$('#productCategory').val(data[0].category);
		$('#productStorage').val(data[0].storage);
		$('#preview_img').attr('src', data[0].imagePath);
	});
});

$(document).on('click', '#addButton', function() {
	$.post('/addProduct', 
	{
		name:$('#productName').val(),
		price:$('#productPrice').val(),
		category:$('#productCategory').val(),
		storage:$('#productStorage').val(),
		imagePath:$('#preview_img').attr('src')
	},
	function(data, status) {
		alert(data);
		if(data == '成功新增商品資訊' || data == '成功修改商品資訊') location.reload();
	});
});

$(document).on('click', '#editButton', function() {
	$.post('/editProduct', 
	{
		name:$('#productName').val(),
		price:$('#productPrice').val(),
		category:$('#productCategory').val(),
		storage:$('#productStorage').val(),
		imagePath:$('#preview_img').attr('src'),
		previousName:$('#previousName').val()
	},
	function(data, status) {
		alert(data);
		if(data == '成功新增商品資訊' || data == '成功修改商品資訊') location.reload();
	});
});

$(document).on('click', '#deleteButton', function() {
	$.post('/deleteProduct', 
	{
		name:$('#previousName').val()
	},
	function(data, status) {
		alert(data);
		location.reload();
	});
});