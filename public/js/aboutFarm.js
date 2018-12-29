$(document).ready(function() {
	$(function() {
		$.post('/getFarmInformation',
		{
			method: 'update'
		},
		function(data, status) {
			var Informations = '';
			for(i = 0; i < data.length; i = i + 2) {
				if(i + 2 <= data.length)
					Informations += '<div class="row"><div class="col-6"><div class="polaroid"><img src="' + data[i].imagePath + '" id="facilityImage"><div class="container"><h2>' + data[i].name + '</h2><h3>設施狀態:' + data[i].state + '</h3></div></div></div><div class="col-6"><div class="polaroid"><img src="' + data[i+1].imagePath + '" style="width:100%;height:361px;"><div class="container"><h2>' + data[i+1].name + '</h2><h3>設施狀態:' + data[i+1].state + '</h3></div></div></div></div>';
				else
					Informations += '<div class="row"><div class="col-6"><div class="polaroid"><img src="' + data[i].imagePath + '" alt="5 Terre" id="facilityImage"><div class="container"><h2>' + data[i].name + '</h2><h3>設施狀態:' + data[i].state + '</h3></div></div></div></div>';
			}
			$('#farmInformation').html(Informations);
		});
	});
});