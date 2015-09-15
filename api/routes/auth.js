var mongoose = require('mongoose');

module.exports = {

  get: function (req, res) {
    res.json({
      message: 'Auth'
    });
  },

  post: function (req, res) {
    var body = req.body;

    var username = body.username;
    var password = body.password;

    if (username && password) {
      var User = mongoose.model('User');
      var result = User.find({
        username: username,
        password: password
      }, function (err, users) {
        if (err) {
          res.send({
            message: err.message
          });
        }

        if (users.length == 0) {
          // no user found, go to OESP and fetch the user
          if (username == 'olo' && password == 'win') {
            res.send({
              message: 'OK'
            });
          } else {
            res.send({
              message: 'ERROR'
            });
          }
        } else {
          res.send({
            message: 'OK'
          });
        }


      });

    } else {
      res.send({
        message: 'ERROR'
      });
    }

  }
}
