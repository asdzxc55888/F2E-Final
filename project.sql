#create database project;

use project;

DROP TABLE Product_Category;
DROP TABLE Product;
DROP TABLE Farm_Information;
DROP TABLE order_product;
DROP TABLE orders;
DROP TABLE user;
DROP TABLE delivery;

CREATE TABLE Product
(ID INT NOT NULL, 
price INT NOT NULL, 
name TEXT NOT NULL, 
storage INT NOT NULL, 
imagePath TEXT NOT NULL, 
PRIMARY KEY(ID));

CREATE TABLE Product_Category
(category VARCHAR(10) NOT NULL, 
product_ID INT NOT NULL, 
PRIMARY KEY(category, product_ID),
FOREIGN KEY(product_ID) REFERENCES Product(ID) ON DELETE CASCADE);

CREATE TABLE Farm_Information
(ID INT NOT NULL,
name TEXT NOT NULL,
state TEXT NOT NULL,
imagePath TEXT NOT NULL,
PRIMARY KEY(ID));

CREATE TABLE user
(ID INT NOT NULL,
Email VARCHAR(255) NOT NULL,
password TEXT NOT NULL,
Phone TEXT NOT NULL,
Name TEXT NOT NULL,
Address TEXT NOT NULL,
Birthday DATE DEFAULT NULL,
level INT NOT NULL,
username TEXT NOT NULL,
PRIMARY KEY (ID),
UNIQUE (Email));

CREATE TABLE delivery
(ID INT NOT NULL AUTO_INCREMENT,
Order_ID INT NOT NULL,
Date DATE DEFAULT NULL,
State TEXT NOT NULL,
PRIMARY KEY (ID),
KEY order_id_idx (Order_ID));

CREATE TABLE orders
(ID INT NOT NULL AUTO_INCREMENT,
Total_Price INT NOT NULL,
Address TEXT DEFAULT NULL,
Date DATE DEFAULT NULL,
Time TIME DEFAULT NULL,
User_ID INT NOT NULL,
isCheckout INT DEFAULT NULL,
PRIMARY KEY (ID),
KEY user_id_idx (User_ID),
FOREIGN KEY (User_ID) REFERENCES user(id));

CREATE TABLE order_product
(Order_ID INT NOT NULL,
Product_ID INT NOT NULL,
Quantity INT NOT NULL,
PRIMARY KEY (Order_ID, Product_ID),
FOREIGN KEY (Order_ID) REFERENCES orders(id));

//初始化商品資訊
INSERT INTO Product
VALUES		(001, 180, "杏仁果牛奶糖", 100, "img/candy1.jpg");
INSERT INTO Product
VALUES		(002, 180, "特濃牛奶糖", 100, "img/candy2.jpg");
INSERT INTO Product
VALUES		(003, 50, "牧場拉麵", 100, "img/ramen.jpg");
INSERT INTO Product
VALUES		(004, 95, "牧場鮮乳(936ml)", 100, "img/milk.jpg");
INSERT INTO Product
VALUES		(005, 200, "鮮乳手做餅(芝麻)", 100, "img/cookie1.jpg");
INSERT INTO Product
VALUES		(006, 200, "鮮乳手做餅(乳酪)", 100, "img/cookie2.jpg");
INSERT INTO Product
VALUES		(007, 200, "鮮乳手做餅(原味)", 100, "img/cookie3.jpg");

//初始化商品類別資訊
INSERT INTO Product_Category
VALUES		("糖果", 001);
INSERT INTO Product_Category
VALUES		("糖果", 002);
INSERT INTO Product_Category
VALUES		("其他", 003);
INSERT INTO Product_Category
VALUES		("乳品", 004);
INSERT INTO Product_Category
VALUES		("餅乾", 005);
INSERT INTO Product_Category
VALUES		("餅乾", 006);
INSERT INTO Product_Category
VALUES		("餅乾", 007);

//初始化設施資訊
INSERT INTO Farm_Information
VALUES		(001, "腳踏車", "正常開放", "img/img_bicycle.jpg");
INSERT INTO Farm_Information
VALUES		(002, "碰碰船", "正常開放", "img/img_bumper_ship.jpg");
INSERT INTO Farm_Information
VALUES		(003, "腳踏船", "正常開放", "img/img_pedal_boat.jpg");
INSERT INTO Farm_Information
VALUES		(004, "體驗擠牛奶", "正常開放", "img/img_milking.jpg");
INSERT INTO Farm_Information
VALUES		(005, "體驗餵牛", "正常開放", "img/img_feed_cow.jpg");
INSERT INTO Farm_Information
VALUES		(006, "體驗騎牛", "正常開放", "img/img_ride_cow.jpg");

//初始化使用者資訊
INSERT INTO user
VALUES		(1, "test@gmail.com", md5("123"), "0965010920", "何韋辰", "123", "2001-11-00", 1, "好棒");
INSERT INTO user
VALUES      (2, "user@gmail.com", md5("456"), "0800092000", "何媽媽", "456", "2001-02-28", 0, "bang");

//初始化訂單資訊
INSERT INTO orders 
VALUES (1,0,NULL,NULL,NULL,1,0);

//初始化訂單內容資訊
INSERT INTO order_product
VALUES (1,1,4), (1,2,1);
