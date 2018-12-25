$(document).ready(function () {
    $(readUserInformation());
    const $name = $('#name');
	const $email = $('#email');
	const $address = $('#address');

    function readUserInformation() {
		var UID = readCookie('UID');
		$.post('/readUserInformation', {
			UID: UID
		}, function (data, status) {
			console.log(data);
			Object.keys(data).forEach(function (key) {
                var row = data[key];
                console.log(row.Name);
                $name.val(row.Name);
				$email.val(row.Email);
				$address.val(row.Address);
			});
		})
	}
})