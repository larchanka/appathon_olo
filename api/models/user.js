var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
  username: '',
  password: ''
});

module.exports = mongoose.model('User', UserSchema);
