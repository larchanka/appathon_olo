var UserModel = require('../models/user.js');

module.exports = {

  getSessionUser: function (token) {
    console.log('getSessionUser: session "' + token + '"');
    return UserModel.validate(token);
  },

  get: function (req, res) {
    console.log('GET /api/auth', req.query);

    res.json({
      message: 'Auth'
    });
  },

  post: function (req, res) {
    console.log('POST /api/auth', req.body);

    var body = req.body;

    UserModel.auth(body.username, body.password).then(function (user) {
      console.log('POST /api/auth user ', user);
      res.cookie('session', user.token);

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
