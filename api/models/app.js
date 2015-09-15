var mongoose = require('mongoose');

var AppSchema = mongoose.Schema({
  appId: String,
  players: mongoose.Schema.Types.Mixed
});


var availableApps = {
  'com.olo.test': true,
  'com.olo.hub': true
};

var auth = function (id) {
  return new Promise(function (res, rej) {
    if (id in availableApps) {
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
      var created = false;
      if (apps.length == 0) {
        console.log('app.auth: Create new app ' + id);
        created = true;

        app = new AppModel({
          appId: id
        });
      } else if (apps.length > 1) {
        return rej(new Error('More then one app with the same id'));
      } else {
        app = apps[0];
      }

      auth(id).then(function (obj) {
        console.log('app.auth: Auth ', app);
        
        if (created) {
          app.save(function (err) {
            if (err) {
              return res(err);
            }

            return res(app);
          });
        } else {
          return res(app);
        }
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


  var players = this.players;
  if (!players) {
    players = {};
  }

  var changed = false;

  // if there is a dot in a username, replace it with _
  //
  username = username.replace(/\./g, '_');

  var currentScore = players[username];
  if (!currentScore) {
    players[username] = score;
    changed = true;
  } else if (Number(currentScore) < Number(score)) {
    players[username] = score;
    changed = true;
  }

  if (changed) {
    this.markModified('players');
    this.players = players;

    return this.saveMe();
  } else {
    return Promise.resolve(this);
  }

}

module.exports = mongoose.model('App', AppSchema);