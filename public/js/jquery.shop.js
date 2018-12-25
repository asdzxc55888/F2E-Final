(function ($) {
	$.Shop = function (element) {
		this.$element = $(element);
		this.init();
	};

	$.Shop.prototype = {
		init: function () {

			// Properties


			this.cartPrefix = "winery-"; // Prefix string to be prepended to the cart's name in the session storage
			this.cartName = this.cartPrefix + "cart"; // Cart name in the session storage
			this.shippingRates = this.cartPrefix + "shipping-rates"; // Shipping rates key in the session storage
			this.total = this.cartPrefix + "total"; // Total key in the session storage
			this.storage = sessionStorage; // shortcut to the sessionStorage object


			this.$formAddToCart = this.$element.find("form.add-to-cart"); // Forms for adding items to the cart
			this.$formCart = this.$element.find("#shopping-cart"); // Shopping cart form
			this.$checkoutCart = this.$element.find("#checkout-cart"); // Checkout form cart
			this.$checkoutOrderForm = this.$element.find("#checkout-order-form"); // Checkout user details form
			this.$shipping = this.$element.find("#sshipping"); // Element that displays the shipping rates
			this.$subTotal = this.$element.find("#stotal"); // Element that displays the subtotal charges
			this.$shoppingCartActions = this.$element.find("#shopping-cart-actions"); // Cart actions links
			this.$updateCartBtn = this.$shoppingCartActions.find("#update-cart"); // Update cart button
			this.$emptyCartBtn = this.$shoppingCartActions.find("#empty-cart"); // Empty cart button
			this.$userDetails = this.$element.find("#user-details-content"); // Element that displays the user information
			this.$paypalForm = this.$element.find("#paypal-form"); // PayPal form
			this.$confirmSubmit = this.$element.find('#confirmSubmit');
			this.$logout = this.$element.find('#nav-logout');


			this.currency = "$"; // HTML entity of the currency to be displayed in the layout
			this.currencyString = "$"; // Currency symbol as textual string
			this.paypalCurrency = "EUR"; // PayPal's currency code
			this.paypalBusinessEmail = "yourbusiness@email.com"; // Your Business PayPal's account email address
			this.paypalURL = "https://www.sandbox.paypal.com/cgi-bin/webscr"; // The URL of the PayPal's form

			// Object containing patterns for form validation
			this.requiredFields = {
				expression: {
					value: /^([\w-\.]+)@((?:[\w]+\.)+)([a-z]){2,4}$/
				},

				str: {
					value: ""
				}

			};

			// Method invocation

			this.createCart();
			this.handleAddToCartForm();
			this.handleCheckoutOrderForm();
			this.emptyCart();
			this.updateCart();
			this.displayCart();
			this.deleteProduct();
			this.displayUserDetails();
			this.populatePayPalForm();
		},

		// Public methods

		// Creates the cart keys in the session storage

		createCart: function () {
			if (this.storage.getItem(this.cartName) == null) {

				var cart = {};
				cart.items = [];

				this.storage.setItem(this.cartName, this._toJSONString(cart));
				this.storage.setItem(this.shippingRates, "0");
				this.storage.setItem(this.total, "0");
			}
		},

		// Appends the required hidden values to the PayPal's form before submitting

		populatePayPalForm: function () {
			var self = this;
			if (self.$paypalForm.length) {
				var $form = self.$paypalForm;
				var cart = self._toJSONObject(self.storage.getItem(self.cartName));
				var shipping = self.storage.getItem(self.shippingRates);
				var numShipping = self._convertString(shipping);
				var cartItems = cart.items;
				var singShipping = Math.floor(numShipping / cartItems.length);

				$form.attr("action", self.paypalURL);
				$form.find("input[name='business']").val(self.paypalBusinessEmail);
				$form.find("input[name='currency_code']").val(self.paypalCurrency);

				for (var i = 0; i < cartItems.length; ++i) {
					var cartItem = cartItems[i];
					var n = i + 1;
					var name = cartItem.product;
					var price = cartItem.price;
					var qty = cartItem.qty;

					$("<div/>").html("<input type='hidden' name='quantity_" + n + "' value='" + qty + "'/>").
						insertBefore("#paypal-btn");
					$("<div/>").html("<input type='hidden' name='item_name_" + n + "' value='" + name + "'/>").
						insertBefore("#paypal-btn");
					$("<div/>").html("<input type='hidden' name='item_number_" + n + "' value='SKU " + name + "'/>").
						insertBefore("#paypal-btn");
					$("<div/>").html("<input type='hidden' name='amount_" + n + "' value='" + self._formatNumber(price, 2) + "'/>").
						insertBefore("#paypal-btn");
					$("<div/>").html("<input type='hidden' name='shipping_" + n + "' value='" + self._formatNumber(singShipping, 2) + "'/>").
						insertBefore("#paypal-btn");

				}



			}
		},

		// Displays the user's information

		displayUserDetails: function () {
			if (this.$userDetails.length) {
				if (this.storage.getItem("shipping-name") == null) {
					var name = this.storage.getItem("billing-name");
					var email = this.storage.getItem("billing-email");
					// var city = this.storage.getItem( "billing-city" );
					var address = this.storage.getItem("billing-address");
					// var zip = this.storage.getItem( "billing-zip" );
					var country = this.storage.getItem("billing-country");

					var html = "<div class='detail'>";
					html += "<h2>付款人 和 收件人</h2>";
					html += "<ul>";
					html += "<li>" + name + "</li>";
					html += "<li>" + email + "</li>";
					html += "<li>" + address + "</li>";
					html += "</ul></div>";

					this.$userDetails[0].innerHTML = html;
				} else {
					var name = this.storage.getItem("billing-name");
					var email = this.storage.getItem("billing-email");
					// var city = this.storage.getItem( "billing-city" );
					var address = this.storage.getItem("billing-address");
					var zip = this.storage.getItem("billing-zip");
					var country = this.storage.getItem("billing-country");

					var sName = this.storage.getItem("shipping-name");
					var sEmail = this.storage.getItem("shipping-email");
					// var sCity = this.storage.getItem( "shipping-city" );
					var sAddress = this.storage.getItem("shipping-address");
					var sZip = this.storage.getItem("shipping-zip");
					var sCountry = this.storage.getItem("shipping-country");

					var html = "<div class='detail'>";
					html += "<h2>付款人</h2>";
					html += "<ul>";
					html += "<li>" + name + "</li>";
					html += "<li>" + email + "</li>";
					// html += "<li>" + city + "</li>";
					html += "<li>" + address + "</li>";
					// html += "<li>" + zip + "</li>";
					html += "<li>" + country + "</li>";
					html += "</ul></div>";

					html += "<div class='detail right'>";
					html += "<h2>收件人</h2>";
					html += "<ul>";
					html += "<li>" + sName + "</li>";
					html += "<li>" + sEmail + "</li>";
					// html += "<li>" + sCity + "</li>";
					html += "<li>" + sAddress + "</li>";
					// html += "<li>" + sZip + "</li>";
					html += "<li>" + sCountry + "</li>";
					html += "</ul></div>";

					this.$userDetails[0].innerHTML = html;

				}
			}
		},

		// Delete a product from the shopping cart

		deleteProduct: function () {
			var self = this;
			if (self.$formCart.length) {
				var cart = this._toJSONObject(this.storage.getItem(this.cartName));
				var items = cart.items;
			}
		},

		// Displays the shopping cart

		displayCart: function () {
			if (this.$formCart.length) {
				var cart = this._toJSONObject(this.storage.getItem(this.cartName));
				var items = cart.items;
				var $tableCart = this.$formCart.find(".shopping-cart");
				var $tableCartBody = $tableCart.find("tbody");

				if (items.length == 0) {
					$tableCartBody.html("");
				} else {


					for (var i = 0; i < items.length; ++i) {
						var item = items[i];
						var product = item.product;
						var price = this.currency + " " + item.price;
						var qty = item.qty;
						var html = "<tr><td class='pname'>" + product + "</td>" + "<td class='pqty'><input type='text' value='" + qty + "' class='qty'/></td>";
						html += "<td class='pprice'>" + price + "</td><td class='pdelete'><a href='' data-product='" + product + "'>&times;</a></td></tr>";

						$tableCartBody.html($tableCartBody.html() + html);
					}

				}

				if (items.length == 0) {
					this.$subTotal[0].innerHTML = this.currency + " " + 0.00;
				} else {

					var total = this.storage.getItem(this.total);
					this.$subTotal[0].innerHTML = this.currency + " " + total;
				}
			} else if (this.$checkoutCart.length) {

				var $cartBody = this.$checkoutCart.find("tbody");
				var $shipping = $('#sshipping');
				var $stotal = $('#stotal');
				var cartHTML = "";
				var totalPrice = 0;

				$.post("/readCartInformation", {
					UID: readCookie('UID')
				}, function (data, status) {
					console.log("checkoutcart:" + data);
					Object.keys(data).forEach(function (key) {
						var row = data[key];
						cartProduct = row.name;
						console.log(cartProduct);
						cartQty = row.Quantity;
						cartPrice = row.price;
						totalPrice += cartQty * cartPrice;
						console.log(totalPrice);
						cartHTML += "<tr><td class='pname'>" + cartProduct + "</td>" + "<td class='pqty'>" + cartQty + "</td>" + "<td class='pprice'>" + cartQty*cartPrice;
						$cartBody.html(cartHTML);
					});
					$stotal.html("<p>" + (totalPrice ) + "元</p>");
				})


			}
		},

		// Empties the cart by calling the _emptyCart() method
		// @see $.Shop._emptyCart()

		emptyCart: function () {
			var self = this;
			if (self.$emptyCartBtn.length) {
				self.$emptyCartBtn.on("click", function () {
					self._emptyCart();
					$.post('emptyCart', {
						UID: readCookie('UID')
					});
				});
			}
			if (self.$confirmSubmit.length) {
				self.$confirmSubmit.on("click", function () {
					self._emptyCart();
				});
			}
			if (self.$logout.length) {
				self.$logout.on("click", function () {
					self._emptyCart();
				});
			}
		},

		// Updates the cart

		updateCart: function () {
			var self = this;
			if (self.$updateCartBtn.length) {
				self.$updateCartBtn.on("click", function () {
					location.reload();
				});
			}
		},

		// Adds items to the shopping cart

		handleAddToCartForm: function () {
			var self = this;
			self.$formAddToCart.each(function () {
				var $form = $(this);
				var $product = $form.parent();
				var price = self._convertString($product.data("price"));
				var name = $product.data("name");

				$form.on("submit", function () {
					var qty = self._convertString($form.find(".qty").val());
					var subTotal = qty * price;
					var total = self._convertString(self.storage.getItem(self.total));
					var sTotal = total + subTotal;
					self.storage.setItem(self.total, sTotal);
					self._addToCart({
						product: name,
						price: price,
						qty: qty
					});
					var shipping = self._convertString(self.storage.getItem(self.shippingRates));
					var shippingRates = self._calculateShipping(qty);
					var totalShipping = shipping + shippingRates;

					self.storage.setItem(self.shippingRates, totalShipping);

					alert("成功加入購物車");

					return false;
				});
			});
		},

		// Handles the checkout form by adding a validation routine and saving user's info into the session storage

		handleCheckoutOrderForm: function () {
			var self = this;
			if (self.$checkoutOrderForm.length) {
				var $sameAsBilling = $("#same-as-billing");
				$sameAsBilling.on("change", function () {
					var $check = $(this);
					if ($check.prop("checked")) {
						$("#fieldset-shipping").slideUp("normal");
					} else {
						$("#fieldset-shipping").slideDown("normal");
					}
				});

				self.$checkoutOrderForm.on("submit", function () {
					var $form = $(this);
					var valid = self._validateForm($form);

					if (!valid) {
						return valid;
					} else {
						self._saveFormData($form);
					}
				});
			}
		},

		// Private methods


		// Empties the session storage

		_emptyCart: function () {
			this.storage.clear();
		},

		/* Format a number by decimal places
		 * @param num Number the number to be formatted
		 * @param places Number the decimal places
		 * @returns n Number the formatted number
		 */



		_formatNumber: function (num, places) {
			var n = num.toFixed(places);
			return n;
		},

		/* Extract the numeric portion from a string
		 * @param element Object the jQuery element that contains the relevant string
		 * @returns price String the numeric string
		 */


		_extractPrice: function (element) {
			var self = this;
			var text = element.text();
			var price = text.replace(self.currencyString, "").replace(" ", "");
			return price;
		},

		/* Converts a numeric string into a number
		 * @param numStr String the numeric string to be converted
		 * @returns num Number the number
		 */

		_convertString: function (numStr) {
			var num;
			if (/^[-+]?[0-9]+\.[0-9]+$/.test(numStr)) {
				num = parseFloat(numStr);
			} else if (/^\d+$/.test(numStr)) {
				num = parseInt(numStr, 10);
			} else {
				num = Number(numStr);
			}

			if (!isNaN(num)) {
				return num;
			} else {
				console.warn(numStr + " cannot be converted into a number");
				return false;
			}
		},

		/* Converts a number to a string
		 * @param n Number the number to be converted
		 * @returns str String the string returned
		 */

		_convertNumber: function (n) {
			var str = n.toString();
			return str;
		},

		/* Converts a JSON string to a JavaScript object
		 * @param str String the JSON string
		 * @returns obj Object the JavaScript object
		 */

		_toJSONObject: function (str) {
			var obj = JSON.parse(str);
			return obj;
		},

		/* Converts a JavaScript object to a JSON string
		 * @param obj Object the JavaScript object
		 * @returns str String the JSON string
		 */


		_toJSONString: function (obj) {
			var str = JSON.stringify(obj);
			return str;
		},


		/* Add an object to the cart as a JSON string
		 * @param values Object the object to be added to the cart
		 * @returns void
		 */


		_addToCart: function (values) {
			var cart = this.storage.getItem(this.cartName);

			var cartObject = this._toJSONObject(cart);
			var cartCopy = cartObject;
			var items = cartCopy.items;
			items.push(values);
			console.log(items);
			this.storage.setItem(this.cartName, this._toJSONString(cartCopy));

			//回傳資料給後端
			items.forEach(item => {
				$.post('setCartdata', item,
					function (data, status) {
						alert(data);
					});
			});
		},

		/* Custom shipping rates calculation based on the total quantity of items in the cart
		 * @param qty Number the total quantity of items
		 * @returns shipping Number the shipping rates
		 */

		_calculateShipping: function (qty) {
			var shipping = 0;
			if (qty < 6) {
				shipping = 200;
			}
			if (qty >= 6 && qty < 12) {
				shipping = 100;
			}
			if (qty >= 12 && qty <= 30) {
				shipping = 0;
			}
			return shipping;

		},

		/* Validates the checkout form
		 * @param form Object the jQuery element of the checkout form
		 * @returns valid Boolean true for success, false for failure
		 */



		_validateForm: function (form) {
			var self = this;
			var fields = self.requiredFields;
			var $visibleSet = form.find("fieldset:visible");
			var valid = true;

			form.find(".message").remove();

			$visibleSet.each(function () {

				$(this).find(":input").each(function () {
					var $input = $(this);
					var type = $input.data("type");
					var msg = $input.data("message");

					if (type == "string") {
						if ($input.val() == fields.str.value) {
							$("<span class='message'/>").text(msg).
								insertBefore($input);

							valid = false;
						}
					} else {
						if (!fields.expression.value.test($input.val())) {
							$("<span class='message'/>").text(msg).
								insertBefore($input);

							valid = false;
						}
					}

				});
			});

			return valid;

		},

		/* Save the data entered by the user in the ckeckout form
		 * @param form Object the jQuery element of the checkout form
		 * @returns void
		 */


		_saveFormData: function (form) {
			var self = this;
			var $visibleSet = form.find("fieldset:visible");

			$visibleSet.each(function () {
				var $set = $(this);
				if ($set.is("#fieldset-billing")) {
					var name = $("#name", $set).val();
					var email = $("#email", $set).val();
					// var city = $( "#city", $set ).val();
					var address = $("#address", $set).val();
					// var zip = $( "#zip", $set ).val();
					var country = $("#country", $set).val();

					self.storage.setItem("billing-name", name);
					self.storage.setItem("billing-email", email);
					// self.storage.setItem( "billing-city", city );
					self.storage.setItem("billing-address", address);
					// self.storage.setItem( "billing-zip", zip );
					self.storage.setItem("billing-country", country);
				} else {
					var sName = $("#sname", $set).val();
					var sEmail = $("#semail", $set).val();
					// var sCity = $( "#scity", $set ).val();
					var sAddress = $("#saddress", $set).val();
					// var sZip = $( "#szip", $set ).val();
					var sCountry = $("#scountry", $set).val();

					self.storage.setItem("shipping-name", sName);
					self.storage.setItem("shipping-email", sEmail);
					// self.storage.setItem( "shipping-city", sCity );
					self.storage.setItem("shipping-address", sAddress);
					// self.storage.setItem( "shipping-zip", sZip );
					self.storage.setItem("shipping-country", sCountry);

				}
			});
		}
	};

	$(function () {
		var shop = new $.Shop("#site");
	});




})(jQuery);

$(document).ready(function () {


	setTimeout(function () {
		$('#paint').fadeIn(0);
	}, 0);
	const $logout = $('#nav-logout');
	const $confirmSubmit = $('#confirmSubmit');
	const $checkout = $('#checkout');
	$(readCart());

	function readCart() {
		var cartHTML = "";
		var UID = readCookie('UID');
		var totalPrices = 0;
		if (UID != null) {
			$.post("/readCartInformation", {
				UID: UID
			}, function (data, status) {
				console.log(data);
				Object.keys(data).forEach(function (key) {
					var row = data[key];
					cartProduct = row.name;
					console.log(cartProduct);
					cartQty = row.Quantity;
					cartPrice = row.price;
					totalPrices+=cartQty*cartPrice;
					cartHTML += "<tr><td class='pname'>" + cartProduct + "</td>" + "<td class='pqty'>" + cartQty + "</td>" + "<td class='pprice'>" + cartQty*cartPrice;
					cartHTML += "</td><td class='pdelete id='deleteProduct'><a href='' data-product='" + cartProduct + "'>&times;</a></td></tr>";
					$("#item-list-tbody").html(cartHTML);
				});
				$("#stotal").html(totalPrices);
			})
		}
	}

	$(document).on("click", ".pdelete a", function (e) {
		e.preventDefault();
		var productName = $(this).data("product");
		console.log(productName);
		$.post("deleteCartItem", {
			productName: productName,
			UID: readCookie('UID')
		}, function () {
			location.reload();
			console.log("reset")
		});
	});

	$confirmSubmit.click(function () {
		var userDetail = document.getElementById('user-details').getElementsByTagName('li');
		var stotal = document.getElementById('stotal');
		console.log(stotal)
		var Today=new Date();
		$.post('/checkout',{
			UID : readCookie('UID'),
			Date : Today.getFullYear()+'-'+(Today.getMonth()+1)+'-'+Today.getDate(),
			Time : Today.getHours() + ':' + Today.getMinutes() + ':' + Today.getSeconds(),
			Address: userDetail[2].innerHTML,
			TotalPrice: parseInt(stotal.innerHTML)
		},function(data,state){

		})
		alert("訂購成功");
		document.location.href = "index.html";
	});

	$checkout.click(function () {
		var UID = readCookie('UID');
		if (UID != null) {
			document.location.href = "checkout.html";
		} else {
			alert("請先登入");
			document.location.href = "login.html";
		}
	});

	$logout.click(function () {
		firebase.auth().signOut();
		console.log('LogOut');
	});
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