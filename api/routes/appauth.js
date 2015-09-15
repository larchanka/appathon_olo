var AppModel = require('../models/app.js');

module.exports = {
  post: function (req, res) {
    console.log('POST /api/appauth', req.body);

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
    console.log('GET /api/appauth', req.query);

    res.json({
      message: 'App Auth'
    });
  }
}
