var mongoose = require('mongoose');

var AppSchema = mongoose.Schema({
  appId: String
});

var auth = function (id) {
  return new Promise(function (res, rej) {
    if (id == 'com.olo.test') {
      return res();
    }

    return rej();
  });
}

AppSchema.statics.auth = function (id) {
  var AppModel = this.model('App');

  return new Promise(function (res, rej) {
    AppModel.find({
      id: id
    }, function (err, apps) {
      if (err) {
        return rej(err);
      }

      var app;
      if (apps.length == 0) {
        app = new AppModel({
          appId: id
        });
      } else {
        app = apps[0];
      }

      auth(id).then(function (obj) {
        app.save(function (err) {
          if (err) {
            return res(err);
          }

          return res(obj);
        });
      }, function (err) {
        rej(err);
      });

    })

  });
}

module.exports = mongoose.model('App', AppSchema);
