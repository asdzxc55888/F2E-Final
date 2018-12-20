const https = require('https');
const fs = require('fs');
const express = require('express');

var app = express();

const serverOption = {
  key: fs.readFileSync("certs/privatekey.pem").toString(),
  cert: fs.readFileSync("certs/server-cert.pem").toString()
}

app.use(express.static('public'));

app.get('/',function(req,res){
  fs.createReadStream("./index.html").pipe(res);
  //res.sendfile('index.html');
  console.log("send file ");
});

app.get('/index.html',function(req,res){
  fs.createReadStream("./index.html").pipe(res);
  //res.sendfile('index.html');
  console.log("send file ");
});

app.get('/login.html',function(req,res){
  fs.createReadStream("./login.html").pipe(res);
  //res.sendfile('login.html');
  console.log("send file ");
});

app.get('/cart.html',function(req,res){
  fs.createReadStream("./cart.html").pipe(res);
  //res.sendfile('cart.html');
  console.log("send file ");
});

app.get('/order.html',function(req,res){
  fs.createReadStream("./order.html").pipe(res);
  //res.sendfile('order.html');
  console.log("send file ");
});

app.get('/aboutus.html',function(req,res){
  res.writeHead(200, { 'Content-Type': 'text/html' });
  fs.createReadStream("./aboutus.html").pipe(res);
  //res.sendfile('aboutus.html');
  console.log("send file ");
});

app.get('/checkout.html',function(req,res){
  fs.createReadStream("./checkout.html").pipe(res);
  //res.sendfile('checkout.html');
  console.log("send file ");
});

app.get('/shop.html',function(req,res){
  fs.createReadStream("./shop.html").pipe(res);
  //res.sendfile('shop.html');
  console.log("send file ");
});

app.get('/signUp.html',function(req,res){
  fs.createReadStream("./signUp.html").pipe(res);
  //res.sendfile('signUp.html');
  console.log("send file ");
});

app.get('/user.html',function(req,res){
  fs.createReadStream("./user.html").pipe(res);
  //res.sendfile('user.html');
  console.log("send file ");
});

app.get('/userOrderInformation.html',function(req,res){
  fs.createReadStream("./userOrderInformation.html").pipe(res);
  //res.sendfile('userOrderInformation.html');
  console.log("send file ");
});

//建立server
var server = https.createServer(serverOption, app ); //the server object listens on port 8080
server.listen(8080);
/*
app.listen(8080 ,function(){
});

/*
//create a server object:
http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  fs.createReadStream("./shop.html").pipe(res);
  console.log("1230");
}).listen(8080); //the server object listens on port 8080
*/


