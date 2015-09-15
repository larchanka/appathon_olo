var auth = require('./auth.js');

module.exports = {
  post: function (req, res) {

    auth.getSessionUser(req).then(function (user) {
      return res.send({
        type: 'OK'
      });
    }, function (err) {
      return res.send({
        type: 'ERROR',
        message: 'Unauthenticated'
      });
    });
  },

  get: function (req, res) {
    res.json({
      message: 'Score Auth'
    });
  }
};
