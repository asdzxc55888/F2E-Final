const https = require('https');
const fs = require('fs');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const orderquery = require('./public/module/orderquery');
const db = require('./public/module/dbconnection');
const md5 = require('md5');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static('public'));

app.get('/test', function (req, res) {
  console.log('test');
  orderquery.getCartInformation(1, function () {

  });
});

app.get('/', function(req, res) {
	console.log('use initial page');
	res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/index.html',function(req,res){
    console.log('use home page');
	res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/login.html',function(req,res){
    console.log('use login page');
	res.sendFile(path.join(__dirname + '/login.html'));
});

app.get('/cart.html',function(req,res){
    console.log('use shopping cart page');
	res.sendFile(path.join(__dirname + '/cart.html'));
});

app.get('/order.html',function(req,res){
	console.log('use order page');
	res.sendFile(path.join(__dirname + '/order.html'));
});

app.get('/aboutus.html',function(req,res){
    console.log('use about us page');
	res.sendFile(path.join(__dirname + '/aboutus.html'));
});

app.get('/checkout.html',function(req,res){
    console.log('use checkout page');
	res.sendFile(path.join(__dirname + '/checkout.html'));
});

app.get('/shop.html',function(req,res){	
	console.log('use shop page');
	res.sendFile(path.join(__dirname + '/shop.html'));
});

app.get('/signUp.html',function(req,res){
    console.log('use sign up page');
	res.sendFile(path.join(__dirname + '/signUp.html'));
});

app.get('/user.html',function(req,res){
    console.log('use user page');
	res.sendFile(path.join(__dirname + '/user.html'));
});

app.get('/userOrderInformation.html',function(req,res){
    console.log('use order information page');
	res.sendFile(path.join(__dirname + '/userOrderInformation.html'));
});

app.get('/amdOrderList', function (req, res) {
  fs.createReadStream("./public/amdOrderList.html").pipe(res);
  console.log("send file ");
});

app.get('/aboutfarm.html',function(req,res){
    console.log('use about farm page');
	res.sendFile(path.join(__dirname + '/aboutfarm.html'));
});

app.get('/userMenu.html',function(req,res){
    console.log('use user menu page');
	res.sendFile(path.join(__dirname + '/userMenu.html'));
});

app.get('/manageFacility.html',function(req,res){
    console.log('use manage facility page');
	res.sendFile(path.join(__dirname + '/manageFacility.html'));
});

app.get('/manageProduct.html',function(req,res){
    console.log('use manage product page');
	res.sendFile(path.join(__dirname + '/manageProduct.html'));
});

app.get('/OrderInformation.html',function(req,res){
    console.log('use manage product page');
	res.sendFile(path.join(__dirname + '/OrderInformation.html'));
});

app.get('/amdOrderList.html',function(req,res){
    console.log('use manage product page');
	res.sendFile(path.join(__dirname + '/amdOrderList.html'));
});

app.post('/signUp.html', function (req, res) {
  SignUp(req.body.Email, req.body.Pass, req.body.Username, req.body.Phone, req.body.Address, req.body.Birthday, req.body.Name, function (err, data) {
    res.send(data);
  });
});

app.post('/login.html',function(req,res){
  LogIn(req.body.Email, req.body.Pass,function(err,data){
    res.send(data);
  });
});

function SignUp(email, pass, username, phone, address, birthday, name, callback) {
  let usernum = 0;
  let data = {
    ID: 0,
    Email: email,
    password: pass,
    username: username,
    Phone: phone,
    Address: address,
    Birthday: birthday,
    Name: name,
    level: 0
  }
  console.log(data);
  db.query('SELECT COUNT(*)+1 AS usernumber FROM user', function (error, results) {
    if (error) throw error;
    usernum = results[0].usernumber;
    data.ID = usernum;
    //創建
    db.query("INSERT INTO user SET ?", data, function (error) {
      if (error) {
        console.log('創建帳號失敗');
        throw error;
      }
      else {
        let Pass = "MD5('" + data.password + "')";
        db.query("UPDATE user SET password = " + Pass + " WHERE ID =" + data.ID, function (error) {
          if (error) throw error;
          else {
            console.log("創建帳號成功");
            LogIn(data.Email, data.password, function (err, data) {
              callback(null, data);
            });
          }
        });
      }
    });
  });
};

function LogIn(email, pass, callback) {
  let data = {
    Email: email
  }
  let returnDATA = {
    CurrentUser: '',
    UID: 0
  }
  db.query("select password AS CheckPass from user where ? ", data, function (error, results) {
    if (error) throw error;
    if (results[0].CheckPass == md5(pass)) {
      db.query('select username AS name, ID AS uid from user where ? ', data, function (error, results) {
        if (error) throw error;
        let currentUser = results[0].name;
        let ID = results[0].uid;
        returnDATA.UID = ID;
        returnDATA.CurrentUser = currentUser;
        callback(null, returnDATA);
      })
    }
    else {
      console.log('密碼錯誤');
	  callback(null,'密碼錯誤');
    }
  });
}

app.post('/user.html', function (req, res) {
  if (req.body.Phone) {
    confirmData(req.body.UserID, req.body.Phone, req.body.Birthday, req.body.Username, req.body.Name, req.body.Address, function (err, data) {
      if (data == 'success') {
        res.send(data);
      }
      else {
        res.send('fail');
      }
    });
  }
  else {
    getData(req.body.User, function (err, data) {
      res.send(data)
    });
  }
});

function confirmData(UserID, Phone, Birthday, Username, Name, Address, callback) {
  let data = {
    Phone: Phone,
    Birthday: Birthday,
    Username: Username,
    Name: Name,
    Address: Address
  }
  db.query('UPDATE user SET ? WHERE ID = ' + UserID, data, function (error, results) {
    if (error) {
        callback(null, 'fail');
        throw error;
    }
    else {
        callback(null, 'success');
    }
  });
};

function getData(User, callback) {
  let userData = {
    username: User
  }
  let Data = {
    Phone: '',
    Birthday: '',
    Name: '',
    Address: ''
  }
  db.query('SELECT Phone, Birthday, Name, Address FROM user WHERE ? ', userData, function (error, results) {
    if (error) throw error;
    else {
		//加一天
		var date = new Date(results[0].Birthday.valueOf());
		date.setDate(date.getDate() + 1);

        Data.Phone = results[0].Phone;
        Data.Birthday = date;
        Data.Name = results[0].Name;
        Data.Address = results[0].Address;
        callback(null, Data);
    }
  });
}

app.post('/setCartdata', function (req, res) {
  let body = [];
  req.on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();
    body = decodeURI(body);
    console.log(body);
    res.end(body);
  });
  console.log("setdata ");
});

app.post('/getCategories', function(req, res) {
	db.query('SELECT DISTINCT category FROM Product_Category', function(err, result) {
		if(err) throw err;
		res.send(result);
	})
});

app.post('/changeProductCategory', function(req, res, next) {
	if(req.body.category=='全部') {
		db.query('SELECT * FROM Product, Product_Category WHERE ID=product_ID', function (err, result) {
			if (err) throw err;
			res.send(result);
		});
	}
	else {
		db.query('SELECT * FROM Product, Product_Category WHERE category="' + req.body.category + '" AND ID=product_ID', function (err, result) {
			if (err) throw err;
			res.send(result);
		});
	}
});

app.post('/addOrder', function(req, res) {
	var name = req.body.name;
	var quantity = req.body.quantity;
	var price = req.body.price;
	var UID = req.body.UID;
	db.query('SELECT * FROM Product WHERE name="' + name + '"', function (err, result) {
		if (err) throw err;
		var product_ID = result[0].ID;
		if (result[0].storage < 1) res.send('error');
		else {
			db.query('UPDATE Product SET storage=storage-' + quantity + ' WHERE name="' + name + '"', function (err, result) {
				if (err) throw err;
				console.log("Update " + name + "'s storages");
				res.send('success');
				orderquery.InsertCartData(UID, product_ID, quantity);
			});
		}
    });
});

app.post('/readCartInformation',function(req, res){
  var UID =  req.body.UID;
  orderquery.getCartInformation(UID,function(result){
    res.send(result);
  })
})

app.post('/deleteCartItem',function(req,res){
  var productName = req.body.productName;
  var UID =  req.body.UID;
  orderquery.deleteOrderProduct(UID,productName,function(){
    res.send('success');
  });
})

app.post('/emptyCart',function(req,res){
  var UID =  req.body.UID;
  orderquery.emptyCart(UID);
})

app.post('/readUserInformation',function(req,res){
  var UID =  req.body.UID;
  orderquery.readUserInformation(UID,function(result){
    res.send(result);
  })
})

app.post('/checkout',function(req,res){
  var UID = req.body.UID;
  var Date = req.body.Date;
  var Address = req.body.Address;
  var Time = req.body.Time;
  var TotalPrice = req.body.TotalPrice;
  console.log(UID,Date,Address,Time);
  orderquery.setOrderInformation(UID,Address,Date,Time,TotalPrice);
})

app.post('/getOrderList',function(req,res){
  orderquery.getOrderList(function(result){
    res.send(result);
  })
})

app.post('/getUserOrderList',function(req,res){
  var UID =req.body.UID;
  orderquery.getUserOrderList(UID,function(result){
    res.send(result);
  })
})

app.post('/readorder',function(req,res){
  var order_ID = req.body.order_ID;
  orderquery.readOrderProduct(order_ID,function(result){
    res.send(result);
  })
})

app.post('/setDelivery',function(req,res){
  var UID =req.body.UID;
  var order_ID = req.body.order_ID;
  var State = req.body.State;
  orderquery.setDelivery(UID,order_ID,State);
})

app.post('/getDeliveryState',function(req,res){
  var order_ID = req.body.order_ID;
  orderquery.getDeliveryState(order_ID,function(result){
    res.send(result);
  })
})

app.post('/getAllDeliveryState',function(req,res){
  orderquery.getAllDeliveryState(function(result){
    res.send(result);
  })
})

app.post('/getFarmInformation', function(req, res) {
	db.query('SELECT * FROM Farm_Information', function(err, result) {
		if(err) throw err;
		console.log('update farm information');
		res.send(result);
	});
});

app.post('/getFacilityInformation', function(req, res) {
	db.query('SELECT * FROM Farm_Information WHERE name="' + req.body.name + '"', function(err, result) {
		if(err) throw err;
		res.send(result);
	});
});

app.post('/getProducts', function(req, res) {
	db.query('SELECT * FROM Product', function(err, result) {
		if(err) throw err;
		res.send(result);
	});
});

app.post('/getProductInformation', function(req, res) {
	db.query('SELECT * FROM Product, Product_Category WHERE name="' + req.body.name + '" AND ID=Product_ID', function(err, result) {
		if(err) throw err;
		res.send(result);
	});
});

app.post('/getUserMenu', function(req, res) {
	db.query('SELECT level FROM User WHERE ID=' + req.body.ID, function(err, result) {
		if(err) throw err;
		if (result[0].level == 1) res.send('manager');
		else res.send('user');
	});
});

app.post('/addFacility', function(req, res) {
	db.query('SELECT * FROM Farm_Information WHERE name="' + req.body.name + '"', function(err, result) {
		if(err) throw err;
		if(result.length != 0) res.send('失敗，設施名稱重複');
		else if(req.body.name=='' || req.body.state=='' || req.body.imagePath=='') res.send('失敗，請填滿空格');
		else {
			var path = '';
			if(req.body.imagePath.substring(0,1) == 'C:')
				path = 'img/' + req.body.imagePath.substring(12, req.body.imagePath.length);
			else
				path = req.body.imagePath;
			db.query('SELECT * FROM Farm_Information', function(err, result) {
				if(err) throw err;
				db.query('INSERT INTO Farm_Information VALUES (' + result[result.length - 1].ID + 1 + ', "' + req.body.name + '", "' + req.body.state + '", "' + path + '")', function(err, result) {
					if(err) throw err;
					res.send('成功新增設施資訊');
				});
			});
		}
	});
});

app.post('/editFacility', function(req, res) {
	db.query('SELECT * FROM Farm_Information WHERE name="' + req.body.name + '"', function(err, result) {
		if(err) throw err;
		if(result.length != 0 && req.body.name != req.body.previousName) res.send('失敗，設施名稱重複');
		else if(req.body.name=='' || req.body.state=='' || req.body.imagePath=='') res.send('失敗，請填滿空格');
		else {
			db.query('UPDATE Farm_Information SET name="' + req.body.name + '", state="' + req.body.state + '", imagePath="' + req.body.imagePath + '" WHERE name="' + req.body.previousName + '"', function(err, result) {
				if(err) throw err;
				res.send('成功修改設施資訊');
			});
		}
	});
});

app.post('/deleteFacility', function(req, res) {
	db.query('DELETE FROM Farm_Information WHERE name="' + req.body.name + '"', function(err, result) {
		if(err) throw err;
		res.send('成功刪除設施資訊');
	});
});

app.post('/addProduct', function(req, res) {
	db.query('SELECT * FROM Product WHERE name="' + req.body.name + '"', function(err, result) {
		if(err) throw err;
		if(result.length != 0) res.send('失敗，商品名稱重複');
		else if(req.body.name=='' || req.body.price=='' || req.body.category=='' || req.body.storage=='' || req.body.imagePath=='') res.send('失敗，請填滿空格');
		else {
			var path = '';
			if(req.body.imagePath.substring(0,1) == 'C:')
				path = 'img/' + req.body.imagePath.substring(12, req.body.imagePath.length);
			else
				path = req.body.imagePath;
			db.query('SELECT * FROM Product', function(err, result) {
				if(err) throw err;
				var newID = result[result.length - 1].ID + 1;
				db.query('INSERT INTO Product VALUES (' + newID + ', ' + req.body.price + ', "' + req.body.name + '", ' + req.body.storage + ', "' + path + '")', function(err, result) {
					if(err) throw err;
					db.query('INSERT INTO Product_Category VALUES ("' + req.body.category + '", ' + newID +')', function(err, result) {
						if(err) throw err;
						res.send('成功新增商品資訊');
					});
				});
			});
		}
	});
});

app.post('/editProduct', function(req, res) {
	db.query('SELECT * FROM Product WHERE name="' + req.body.name + '"', function(err, result) {
		if(err) throw err;
		if(result.length != 0 && req.body.name != req.body.previousName) res.send('失敗，商品名稱重複');
		else if(req.body.name=='' || req.body.price=='' || req.body.category=='' ||req.body.storage=='' || req.body.imagePath=='') res.send('失敗，請填滿空格');
		else {
			db.query('SELECT ID FROM Product WHERE name="' + req.body.previousName + '"', function(err, result) {
				if(err) throw err;
				db.query('UPDATE Product_Category SET category="' + req.body.category + '" WHERE product_ID=' + result[0].ID, function(err, result) {
					if(err) throw err;
				});
				db.query('UPDATE Product SET name="' + req.body.name + '", price="' + req.body.price + '", storage=' + req.body.storage + ', imagePath="' + req.body.imagePath + '" WHERE name="' + req.body.previousName + '"', function(err, result) {
					if(err) throw err;
				});
				res.send('成功修改商品資訊');
			});
		}
	});
});

app.post('/deleteProduct', function(req, res) {
	db.query('DELETE FROM Product WHERE name="' + req.body.name + '"', function(err, result) {
		if(err) throw err;
		res.send('成功刪除商品資訊');
	});
});

const serverOption = {
    key: fs.readFileSync('certs/privatekey.pem'),
    cert: fs.readFileSync('certs/server-cert.pem')
};

//建立server
var server = https.createServer(serverOption, app);
server.listen(8080, function() {
	console.log('Running on port 8080.');
});