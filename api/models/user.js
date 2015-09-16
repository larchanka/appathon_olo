var mongoose = require('mongoose');
var superagent = require('superagent');

var AppModel = require('./app.js');
var ScoreModel = require('./score.js');

var UserSchema = mongoose.Schema({
  username: String,
  token   : String,
  details: mongoose.Schema.Types.Mixed,
  scores: [] //score ids
});

var mockData = ({ 
  oespToken: 'cddac195bbbaef214f63ae7e775c78a71d7ba64fd5e7c7a978cfa0ae16940393',
  username: 'hackathon19',
  countryCode: 'NL',
  languageCode: 'nld',
  deviceCode: 'web',
  locationId: '24443942973',
  timeToIdleSeconds: 7200,
  customer: 
    { givenName: 'FOC (RONALD VAN RAVENSBERG)',
      familyName: 'Liberty Global Exhibition 31',
      gender: 'female',
      status: [],
      smartCardId: '0000509286',
      stbType: 'HZN',
      replayTvEntitled: true,
      replayTvAvailable: true,
      replayTvMinimumBroadcastTime: 0,
      replayTvOptedIn: true 
  }
});

var auth = function (username, password) {
  console.log('Will try to connect using', username, password);

  if (username === 'hackathon19') {
    return Promise.resolve(mockData);
  }

  var called = false;
  return new Promise(function (res, rej) {
    superagent
    .post('https://web-api2.horizon.tv/oesp/api/NL/nld/web/session')
    .type('json')
    .send({
      username: username,
      password: password
    })
    .end(function (error, response) {
      if (called) { return; }
      called = true;

      if (error) {
        console.log('error is', error);
        return rej(error);
      }

      if (response.error) {
        return rej(response.error);
      }

      res(response.body);
    });
  });
}

UserSchema.methods.saveMe = function () {
  var user = this;
  return new Promise(function (res, rej) {
    user.save(function (err) {
      if (err) { return rej(err); }
      return res();
    });
  });
}

UserSchema.methods.getScores = function () {
  return this.scores.sort(function (a, b) {
    return a.date < b.date;
  });
}

UserSchema.methods.addScore = function (appId, score) {

  this.scores.push({
    score: score,
    date: new Date().getTime()
  });

  return this.saveMe();
}

UserSchema.statics.validate = function (token) {
  // will fetch username from database, take it's cookie and will try to reauthenticate
  // into the system with the token
  var UserModel = this.model('User');

  return new Promise(function (res, rej) {

    UserModel.find({
      token: token || 'unknown'
    }, function (err, users) {
      if (err) {
        return rej(err);
      }

      if (users.length) {
        user = users[0];
        console.log('user.validate: ', user);

        // XXX: validate token
        return res(user);
      } 

      return rej();
    });

  });
}

UserSchema.statics.auth = function (username, password) {

  var UserModel = this.model('User');

  return new Promise(function (res, rej) {
    UserModel.find({
      username: username
    }, function (err, users) {
      if (err) {
        return rej(err);
      }

      var user = null;
      if (users.length == 0) {
        user = new UserModel({
          username: username
        });
      } else {
        user = users[0];
      }

      auth(username, password).then(function (obj) {
        user.details = obj.customer;
        user.token = obj.oespToken;

        user.save(function () {
          return res({
            token: user.token,
            details: user.details
          });
        });
      }, function (err) {
        return rej({
          message: err.message
        });
      });
    });
  });
};

module.exports = mongoose.model('User', UserSchema);
