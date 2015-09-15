var mongoose = require('mongoose');

module.exports = {

  get: function (req, res) {
    res.json({
      message: 'Auth'
    });
  },

  post: function (req, res) {
    var body = req.body;
    var User = mongoose.model('User');

    User.auth(body.username, body.password).then(function (user) {
      return res.send({
        type: 'OK',
        message: user
      });
    }, function (err) {
      res.send({
        type: 'ERROR',
        message: err.message
      });
    });
  }
}
