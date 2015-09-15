var express = require('express');
var app = express();
var bodyParser = require('body-parser');

require('./db.js');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var router = express.Router();

router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });   
});

app.use('/api', router);

app.get('/', function(request, response) {
  response.send('Hello world');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

