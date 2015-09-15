var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/olo');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  // yay!
  console.log('DB Connected');
});
