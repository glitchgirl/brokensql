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
connection.query('SELECT * FROM `users`', function (error, results, fields) {
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

  connection.query('INSERT INTO `users` (`name`,`username`, `email`) VALUES (?,?,?)', [name, username, email] ,(err) => {
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