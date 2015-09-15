var auth = require('./auth.js');
var AppModel = require('../models/app.js');

module.exports = {
  post: function (req, res) {

    var score = req.body.score;
    var appId = req.body.appId;

    var currentUser = null;

    auth.getSessionUser(req).then(function (user) {
      currentUser = user
    }, function (err) {
      console.log('error');
      throw new Error('Unauthenticated');
    })

    .then(function() {
      return AppModel.auth(appId)
    }, function (err) {
      console.log('error');
      throw new Error('Wrong App ID');
    })

    .then(function (app) {
      return app.setScore(user, score);
    })

    .then(function () {
      return currentUser.addScore(appId, score);
    })

    .then(function () {

      return res.send({
        type: 'OK'
      });

    })

    .catch(function (err) {
      console.log(err.stack);
      return res.send({
        type: 'ERROR',
        message: err.message
      });
    });

  },

  get: function (req, res) {
    var appId = req.query.appId;
    var currentUser;

    auth.getSessionUser(req).then(function (user) {
      currentUser = user
    }, function (err) {
      console.log('error');
      throw new Error('Unauthenticated');
    })

    .then(function() {
      return AppModel.auth(appId);
    })

    .then(function (app) {
      res.json({
        type: 'OK',
        message: currentUser.getScores()
      });
    })

    .catch(function (err) {
      res.json({
        type: 'ERROR',
        message: err.message
      });
    });

  }
};
