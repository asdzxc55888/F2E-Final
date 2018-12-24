const https = require('https');
const fs = require('fs');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');

//建立MySQL連線
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
	database: 'project'
});

con.connect(function(err) {
    if (err) throw err;
    console.log('Connected!');
});

var app = express();

app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static('public'));

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

app.post('/changeProductCategory', function(req, res, next) {
	if(req.body.category=='全部') {
		con.query('SELECT * FROM Product, Product_Category WHERE ID=Product_ID', function (err, result) {
			if (err) throw err;
			res.send(result);
		});
	}
	else {
		con.query('SELECT * FROM Product, Product_Category WHERE Category="' + req.body.category + '" AND ID=Product_ID', function (err, result) {
			if (err) throw err;
			res.send(result);
		});
	}
});

app.post('/addOrder', function(req, res) {
	var name = req.body.name;
	var quantity = req.body.quantity;
	var price = req.body.price.substring(2, req.body.price.length);
	con.query('SELECT storage FROM Product WHERE name="' + name + '"', function (err, result) {
		if (err) throw err;
		if (result[0].storage < 1) res.send('error');
		else {
			con.query('UPDATE Product SET storage=storage-' + req.body.quantity + ' WHERE name="' + req.body.name + '"', function (err, result) {
				if (err) throw err;
				console.log("Update " + name + "'s storages");
				res.send('success');
			});
		}
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