const https = require('https');
const fs = require('fs');
const express = require('express');
const db = require('./public/module/dbconnection');
const bodyParser = require('body-parser');
const orderquery = require('./public/module/orderquery');
const md5 = require('md5');

var app = express();

const serverOption = {
  key: fs.readFileSync("certs/privatekey.pem").toString(),
  cert: fs.readFileSync("certs/server-cert.pem").toString()
}

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'));

app.get('/test', function (req, res) {
  console.log('test');
  orderquery.getCartInformation(1, function () {

  });
});

app.get('/', function (req, res) {
  fs.createReadStream("./public/index.html").pipe(res);
  console.log("send file ");
});

app.get('/index', function (req, res) {
  fs.createReadStream("./public/index.html").pipe(res);
  console.log("send file ");
});

app.get('/login', function (req, res) {
  fs.createReadStream("./public/login.html").pipe(res);
  console.log("send file ");
});

app.get('/cart', function (req, res) {
  fs.createReadStream("./public/cart.html").pipe(res);
  console.log("send file ");
});

app.get('/order', function (req, res) {
  fs.createReadStream("./public/order.html").pipe(res);
  console.log("send file ");
});

app.get('/aboutus', function (req, res) {
  fs.createReadStream("./public/aboutus.html").pipe(res);
  console.log("send file ");
});

app.get('/checkout', function (req, res) {
  fs.createReadStream("./public/checkout.html").pipe(res);
  console.log("send file ");
});

app.get('/shop', function (req, res) {
  fs.createReadStream("./public/shop.html").pipe(res);
  console.log("send file ");
});

app.get('/signUp', function (req, res) {
  fs.createReadStream("./public/signUp.html").pipe(res);
  console.log("send file ");
});

app.get('/user', function (req, res) {
  fs.createReadStream("./public/user.html").pipe(res);
  console.log("send file ");
});

app.get('/userOrderInformation', function (req, res) {
  fs.createReadStream("./public/userOrderInformation.html").pipe(res);
  console.log("send file ");
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
      console.log('我們不一樣');
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
  let data = {
    Phone: '',
    Birthday: '',
    Name: '',
    Address: ''
  }
  db.query('SELECT Phone, Birthday, Name, Address FROM user WHERE ? ', userData, function (error, results) {
    if (error) throw error;
    else {
      data.Phone = results[0].Phone;
      data.Birthday = results[0].Birthday;
      console.log(data.Birthday);
      data.Name = results[0].Name;
      data.Address = results[0].Address;
      callback(null, data);
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

app.post('/changeProductCategory', function (req, res, next) {
  if (req.body.category == '全部') {
    db.query('SELECT * FROM Product, Product_Category WHERE ID=Product_ID', function (err, result) {
      if (err) throw err;
      res.send(result);
    });
  }
  else {
    db.query('SELECT * FROM Product, Product_Category WHERE Category="' + req.body.category + '" AND ID=Product_ID', function (err, result) {
      if (err) throw err;
      res.send(result);
    });
  }
});

app.post('/addOrder', function (req, res) {
  var name = req.body.name;
  var quantity = req.body.quantity;
  var price = req.body.price.substring(2, req.body.price.length);
  var UID = req.body.UID;
  db.query('SELECT storage,ID FROM Product WHERE name="' + name + '"', function (err, result) {
    if (err) throw err;
    var product_ID = result[0].ID;
    console.log("productID:"+product_ID);
    if (result[0].storage < 1) res.send('error');
    else {
      db.query('UPDATE Product SET storage=storage-' + req.body.quantity + ' WHERE name="' + req.body.name + '"', function (err, result) {
        if (err) throw err;
        console.log("Update " + name + "'s storages");
        res.send('success');
        orderquery.InsertCartData(UID, product_ID, req.body.quantity);
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

//建立server
var server = https.createServer(serverOption, app, function () {
  console.log("Server runing...");
}); //the server object listens on port 8080
server.listen(8080);



