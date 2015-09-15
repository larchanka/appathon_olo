var UserModel = require('../models/user.js');

module.exports = {

  getSessionUser: function (req) {
    var token = req.cookies['session'];
    console.log('getSessionUser: session "', token, '"');
    return UserModel.validate(token);
  },

  get: function (req, res) {
    res.json({
      message: 'Auth'
    });
  },

  post: function (req, res) {
    var body = req.body;

    UserModel.auth(body.username, body.password).then(function (user) {
      console.log('user', user);

      res.cookie('session', user.token, { maxAge: 900000, httpOnly: true });

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
};
