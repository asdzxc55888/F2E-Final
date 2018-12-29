const db = require('./dbconnection');

var InsertCartData = function (UID, Product_ID, qty) {
    //查看是否已經有建立購物車資訊，若沒有則建立order資料
    var queryCmd = "SELECT ID FROM project.orders WHERE isCheckout = false AND User_ID = " + UID;
    getOrderID(UID, function (result) {
        if (result == 0) {
            console.log('insert');
            queryCmd = "INSERT INTO project.orders (Total_Price, User_ID,isCheckout) VALUES (0, " + UID + ",false)";
            db.query(queryCmd, function (err) {
                if (err) throw err;
            });
        }
        getOrderID(UID, function (result) {
            InsertCartData2(result, Product_ID, qty);
        });
    })
}

function InsertCartData2(order_ID, Product_ID, qty) {
    getProductQty(order_ID, Product_ID, function (_qty) {
        if (_qty == 0) {
            InsertOrderProduct(order_ID, Product_ID, qty);
        } else {
            var totalqty = parseInt(qty) + parseInt(_qty);
            UpdataOrderProduct(order_ID, Product_ID, totalqty);
        }
    });
}

function getProductQty(order_ID, Product_ID, callback) {
    queryCmd = "SELECT Quantity FROM project.order_product WHERE Order_ID = " + order_ID + " AND Product_ID = " + Product_ID;
    //console.log(queryCmd);
    var _qty = 0;
    db.query(queryCmd, function (err, result) {
        if (err) throw err;
        //console.log(result);
        Object.keys(result).forEach(function (key) {
            var row = result[key];
            _qty = row.Quantity;
            console.log(_qty);
            callback(_qty);
            return;
        });
        if (_qty == 0) {
            callback(0);
        }
    });
}

function InsertOrderProduct(order_ID, Product_ID, qty) {
    console.log("Insert Order Product");
    queryCmd = "INSERT INTO project.order_product (Order_ID, Product_ID, Quantity) VALUES (" + order_ID + "," + Product_ID + "," + qty + ")";
    //console.log(queryCmd);
    db.query(queryCmd, function (err, result) {
        if (err) throw err;

    });
}

function UpdataOrderProduct(order_ID, Product_ID, qty) {
    queryCmd = "Update project.order_product Set Quantity = " + qty + " Where Order_ID = " + order_ID + " And Product_ID = " + Product_ID;
    //console.log(queryCmd);
    db.query(queryCmd, function (err, result) {
        if (err) throw err;

    });
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//取得購物車資料
var getCartInformation = function (UID, callback) {
    getOrderID(UID, function (order_ID) {
        queryCmd = "SELECT product.name,Quantity,product.price FROM project.order_product,project.product WHERE Order_ID = " + order_ID + " AND Product_ID = product.ID ";
        db.query(queryCmd, function (err, result) {
            if (err) throw err;
            //console.log(result);
            callback(result);
        });
    })
}

//設定訂單資料
var setOrderInformation = function (UID, Address, Date, Time, TotalPrice) {
    getOrderID(UID, function (order_ID) {
        var queryCmd = "Update project.orders Set Address = '" + Address + "' , Date = '" + Date + "' , Time = '" + Time + "' , ischeckout = true , Total_Price = " + TotalPrice + " Where ID = " + order_ID;
        //console.log(queryCmd);
        db.query(queryCmd, function () {
            InsertDelivery(order_ID)
        });
    });
}

var InsertDelivery = function (order_ID) {
    var queryCmd = "INSERT INTO project.delivery (Order_ID, State) VALUES (" + order_ID + ",'準備中')";
    db.query(queryCmd, function (err) {
        if (err) throw err;
    });
}

var setDelivery = function (UID, order_ID, state) {
    var queryCmd = "SELECT level FROM project.user WHERE ID = " + UID;
    db.query(queryCmd, function (err, result) {
        if (err) throw err;
        if (result[0].level == 1) {
            var queryCmd = "Update project.delivery Set State = '" + state + "' Where Order_ID = " + order_ID;
            db.query(queryCmd, function (err) {
                if (err) throw err;
            });
        }
    });
}

var getDeliveryState = function(order_ID,callback){
    var queryCmd = "SELECT State FROM project.delivery Where Order_ID = " + order_ID;
    db.query(queryCmd, function (err,result) {
        if (err) throw err;
        callback(result);
    });
}

var getAllDeliveryState = function(callback){
    var queryCmd = "SELECT State FROM project.delivery";
    db.query(queryCmd, function (err,result) {
        if (err) throw err;
        callback(result);
    });
}

var getOrderID = function (UID, callback) {
    var queryCmd = "SELECT ID,Date FROM project.orders WHERE isCheckout = false AND User_ID = " + UID;
    db.query(queryCmd, function (err, result) {
        if (err) throw err;
        //console.log(result);
        if (result.length == 0) {
            callback(0);
        } else {
            callback(result[0].ID);
        }
    });
}

var deleteOrderProduct = function (UID, productName, callback) {
	var quantity = 0;
	db.query('SELECT Quantity FROM order_product, product, orders WHERE orders.user_ID = ' + UID + ' AND Product_ID = product.ID AND product.name = "' + productName + '" AND Order_ID = orders.ID', function (err, result) {
		if (err) throw err;
		quantity = result[0].Quantity;
		db.query('UPDATE Product SET storage=storage+' + quantity + ' WHERE name="' + productName + '"', function (err, result) {
			if (err) throw err;
			console.log(productName + "'s storages add " + quantity);
		});		
	});
    var queryCmd = "Delete project.order_product FROM project.order_product,project.product,project.orders WHERE project.orders.user_ID = " + UID + " AND Product_ID = product.ID AND product.name = '" + productName + "' AND Order_ID = orders.ID";
    //console.log(queryCmd);
    db.query(queryCmd, function (err) {
        if (err) throw err;
        callback();
    })
}

var emptyCart = function (UID) {
	var productName = '';
	var quantity = 0;
	db.query('SELECT name, Quantity FROM order_product, product, orders WHERE orders.user_ID = ' + UID + ' AND Product_ID = product.ID AND Order_ID = orders.ID', function (err, result) {
		if (err) throw err;
		for(i = 0; i < result.length; i++) {
			productName = result[i].name;
			quantity = result[i].Quantity;
			db.query('UPDATE Product SET storage=storage+' + quantity + ' WHERE name="' + productName + '"', function (err, result) {
				if (err) throw err;
				console.log('reload products storage');
			});
		}
	});
    var queryCmd = "Delete project.order_product FROM project.order_product,project.product,project.orders WHERE project.orders.user_ID = " + UID + " AND Product_ID = product.ID  AND Order_ID = orders.ID";
    //console.log(queryCmd);
    db.query(queryCmd, function (err) {
        if (err) throw err;
    })
}

var readUserInformation = function (UID, callback) {
    var queryCmd = "Select project.user.Name,Email,Address FROM project.user WHERE project.user.ID = " + UID;
    //console.log(queryCmd);
    db.query(queryCmd, function (err, result) {
        if (err) throw err;
        callback(result);
    })
}


//取得訂單清單
var getUserOrderList = function (UID, callback) {
    var queryCmd = "SELECT ID,Date,Total_Price FROM project.orders WHERE isCheckout = true AND User_ID = " + UID;
    db.query(queryCmd, function (err, result) {
        if (err) throw err;
        callback(result);
    })

}

var readOrderProduct = function (order_ID, callback) {
    var queryCmd = "SELECT product.name,Quantity,product.price FROM project.order_product,project.product WHERE Order_ID = " + order_ID + " AND Product_ID = product.ID  ";
    db.query(queryCmd, function (err, result) {
        if (err) throw err;
        callback(result);
    })
}

var getOrderList = function (callback) {
    var queryCmd = "SELECT ID FROM project.orders WHERE isCheckout = true";
    db.query(queryCmd, function (err, result) {
        if (err) throw err;
        callback(result);
    })
}

module.exports.InsertCartData = InsertCartData;
module.exports.getCartInformation = getCartInformation;
module.exports.setOrderInformation = setOrderInformation;
module.exports.deleteOrderProduct = deleteOrderProduct;
module.exports.emptyCart = emptyCart;
module.exports.readUserInformation = readUserInformation;
module.exports.getUserOrderList = getUserOrderList;
module.exports.readOrderProduct = readOrderProduct;
module.exports.setDelivery = setDelivery;
module.exports.getAllDeliveryState = getAllDeliveryState;
module.exports.getDeliveryState = getDeliveryState;
module.exports.getOrderList = getOrderList;