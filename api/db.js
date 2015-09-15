var mongoose = require('mongoose');
var url = ('MONGOLAB_URI' in process.env) ? process.env.MONGOLAB_URI : 'mongodb://localhost/olo';

// require all the models
require('./models');

mongoose.connect(url);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  // yay!
  console.log('DB Connected');
});
