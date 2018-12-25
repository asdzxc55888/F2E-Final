$(document).ready(function() {
	$(function() {
		var UID = readCookie('UID');
		$.post('/getUserMenu', 
		{
			ID: UID
		},
		function(data, status) {
			var menu = '';
			if(data == 'manager') {
				menu += '<a href="manageProduct.html"><管理商品資訊></a><br><br>';
				menu += '<a href="manageFacility.html"><管理設施資訊></a><br><br>';
				menu += '<a href="amdOrderList.html"><更新訂單資訊></a><br><br>';
				menu += '<a href="user.html"><修改使用者資料></a><br><br>';
			}
			else {
				menu += '<a href="OrderInformation.html"><查看訂單資訊></a><br><br>';
				menu += '<a href="user.html"><修改使用者資料></a><br><br>';
			}
			$('#menuContent').html(menu);
		});
	});
});

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