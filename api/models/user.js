var mongoose = require('mongoose');
var superagent = require('superagent');

var UserSchema = mongoose.Schema({
  username: String,
  password: String,
  details: mongoose.Schema.Types.Mixed
});

var auth = function (username, password) {
  return new Promise(function (res, rej) {
    superagent
    .post('https://web-api2.horizon.tv/oesp/api/NL/nld/web/session')
    .type('json')
    .send({
      username: username,
      password: password
    })
    .end(function (error, response) {
      if (error) {
        return rej(error);
      }

      if (response.error) {
        return rej(response.error);
      }

      res(response.body);
    });
  });
}

UserSchema.statics.auth = function (username, password) {

  var UserModel = this.model('User');

  return new Promise(function (res, rej) {
    UserModel.find({
        username: username
      }, function (err, users) {
        if (err) {
          return rej(err);
        }

        var user = null;
        if (users.length == 0) {
          user = new UserModel({
            username: username
          });
        } else {
          user = users[0];
        }

        auth(username, password).then(function (obj) {
          user.details = obj.customer;
          user.save(function () {
            console.log('will save');
            return res({
              details: user.details
            });
          });
        }, function (err) {
          return rej({
            message: err.message
          });
        });
    });
  });
};

module.exports = mongoose.model('User', UserSchema);
