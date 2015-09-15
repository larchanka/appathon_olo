var AppModel = require('../models/app.js');

module.exports = {
  post: function (req, res) {
    var body = req.body;
    AppModel.auth(body.appId).then(function (obj) {
      return res.send({
        type: 'OK'
      });
    }, function () {
      return res.send({
        type: 'ERROR'
      });
    });
  },

  get: function (req, res) {
    res.json({
      message: 'App Auth'
    });
  }
}
