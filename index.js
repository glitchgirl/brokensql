//THIS FILE NEEDS TO BE FINISHED Y'ALL

var express = require('express');
var mysql = require('mysql');
const bodyParser = require('body-parser');
var app = express();

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    database : 'wk11hw3',
    password : ''
  });

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));
app.use(express.json());

connection.connect();
var sql1 = 'SELECT * FROM `users`';
connection.query(sql1, function (error, results, fields) {
  if (error) throw error;
  console.log(results);
});

app.get("/", (req, res) => {
  res.render('index');
});

app.post('/user', (req, res) => {
  let name = req.body.name;
  let username = req.body.username;
  let email = req.body.email;
  var sql2 = 'INSERT INTO `users` (`name`,`username`, `email`) VALUES (?,?,?)';
  var params = [name, username, email];
  connection.query(sql2, params,(err) => {
      if (err){ 
          console.log(err)
      }else{
          console.log('record inserted');
          res.redirect('/');
      }
  });
});


app.listen(5000);

module.exports = app;