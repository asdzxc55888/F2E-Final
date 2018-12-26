$(document).ready(function() {
	$(function() {
		$.post('/getFarmInformation', function(data, status) {
			var facilities = '<h4>選擇設施：</h4>';
			for(i = 0; i < data.length; i++) {
				facilities += '<button id="facility">' + data[i].name + '</button>';
			}
			$('#facilityButton').html(facilities);
		});
	});
});

$(document).on('click', '#facility', function() {
	$('#previousName').val($(this).text());
	$.post('/getFacilityInformation', 
	{
		name:$(this).text()
	},
	function(data, status) {
		$('#facilityName').val(data[0].name);
		$('#facilityState').val(data[0].state);
		$('#preview_img').attr('src', data[0].imagePath);
	});
});

$(document).on('click', '#addButton', function() {
	$.post('/addFacility', 
	{
		name:$('#facilityName').val(),
		state:$('#facilityState').val(),
		imagePath:$('#preview_img').attr('src')
	},
	function(data, status) {
		alert(data);
		if(data == '成功新增設施資訊' || data == '成功修改設施資訊') location.reload();
	});
});

$(document).on('click', '#editButton', function() {
	$.post('/editFacility', 
	{
		name:$('#facilityName').val(),
		state:$('#facilityState').val(),
		imagePath:$('#preview_img').attr('src'),
		previousName:$('#previousName').val()
	},
	function(data, status) {
		alert(data);
		if(data == '成功新增設施資訊' || data == '成功修改設施資訊') location.reload();
	});
});

$(document).on('click', '#deleteButton', function() {
	$.post('/deleteFacility', 
	{
		name:$('#previousName').val()
	},
	function(data, status) {
		alert(data);
		location.reload();
	});
});