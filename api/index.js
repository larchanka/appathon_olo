var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

require('./db.js');

app.set('port', (process.env.PORT || 5000));

app.use(function(req, res, next) {
  console.log('req', req.method);
  res.header("Access-Control-Allow-Origin", "http://localhost:9999");
  res.header("Access-Control-Allow-Credentials", true);

  if (req.method.toLowerCase() == 'options') {
    //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Headers", "*");
  }
  next();
});

app.use(cookieParser());

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', require('./routes'));

app.get('/', function(request, response) {
  response.send('Hello world');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

