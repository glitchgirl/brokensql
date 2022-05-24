//THIS FILE NEEDS TO BE FINISHED Y'ALL

var express = require('express');
var mysql = require('mysql');

var app = express();

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    database : 'wk11hw3',
    password : ''
  });

connection.connect();
 
connection.query('select * from customers', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results);
});

connection.end();

module.exports = app;