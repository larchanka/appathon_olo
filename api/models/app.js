var mongoose = require('mongoose');

var AppSchema = mongoose.Schema({
  appId: String,
  players: mongoose.Schema.Types.Mixed
});

var auth = function (id) {
  return new Promise(function (res, rej) {
    if (id == 'com.olo.test') {
      return res(id);
    }

    return rej(new Error('No id'));
  });
}

AppSchema.statics.auth = function (id) {
  var AppModel = this.model('App');

  if (!id) {
    return new Promise(function (res, rej) {
      return rej(new Error('Empty id'));
    });
  }

  return new Promise(function (res, rej) {
    AppModel.find({
      appId: id
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

          return res(app);
        });
      }, function (err) {
        rej(err);
      });

    })

  });
}

AppSchema.methods.getScores = function () {
  var players = this.players;
  if (!players) {
    players = {};
  }

  players = Object.keys(players).map(function (username) {
    return {
      username: username,
      score: players[username]
    }
  });

  console.log('current scores', players);
  return players.sort(function (a, b) {
    return Number(a.score) < Number(b.score);
  });
}

AppSchema.methods.saveMe = function () {
  var app = this;
  return new Promise(function (res, rej) {
    app.save(function (err) {
      if (err) { return rej(err); }
      return res();
    });
  });
};

AppSchema.methods.setScore = function (user, score) {
  // app is found
  var username = user.username;

  this.markModified('players');

  var players = this.players;
  if (!players) {
    players = this.players = {};
  }

  var currentScore = players[username];
  if (!currentScore) {
      this.players[username] = score;
  } else if (Number(currentScore) < Number(score)) {
    this.players[username] = score;
  }

  return this.saveMe();
}

module.exports = mongoose.model('App', AppSchema);
