var http = require('http');
var formidable = require('F:/node_modules/formidable');
var fs = require('fs');
var mysql = require('F:/node_modules/mysql');

var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'toor',
  database: 'bank'
});

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  if (req.url == '/create_account') {
    var form = formidable.IncomingForm()
    form.parse(req, (err, fields, files) => {
      var q = 'select count(acc_no) as cnt from bank_account;';
      con.query(q, (err, result) => {
        var q = 'insert into bank_account values("' +
          (result[0].cnt + 1) + '", "' + fields.name + '", "' +
          fields.aadhar + '", 0);'
        con.query(q, (err, result) => {
          res.end('Successfully Created Account');
        })
      });
    });
  } else if (req.url == '/withdraw') {
    var form = formidable.IncomingForm()
    form.parse(req, (err, fields, files) => {
      var q = 'select balance from bank_account where acc_no = "' + fields.acc + '";';
      console.log(q);
      con.query(q, (err, result) => {
        var q = 'update bank_account set balance = ' +
          (result[0].balance - fields.amount) +
          ' where acc_no = "' + fields.acc + '";';
        console.log(q);
        con.query(q, (err, result) => {
          res.end('Withdrawn Money' + fields.amount);
        })
      });
    });
  } else {
    fs.readFile('../index.html', (err, data) => {
      res.end(data);
    });
  }
}).listen(2606);