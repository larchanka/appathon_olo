module.exports = {
  get: function (req, res) {
    console.log('GET: app.js', req.query);

    var appId = req.query.appId;

    AppModel.auth(appId).then(function (app) {
      res.json({
        scores:app.getScores()
      });

    }, function (err) {
      throw err;
    })

    .catch(function (err) {
      res.json({
        type: 'ERROR',
        message: err.message
      });
    });
  },

  post: function (req, res) {
  }
};
